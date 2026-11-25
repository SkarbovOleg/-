/* Скриншоты и проверки через Chrome DevTools Protocol.
   Примеры:
     node tools/cdp.mjs --url "http://127.0.0.1:8931/" --out tools/shots/x.png --w 390 --h 860 --mobile
     node tools/cdp.mjs --url "http://127.0.0.1:8931/?theme=dark" --out tools/shots/y.png --full
     node tools/cdp.mjs --url "http://127.0.0.1:8931/" --eval "document.title" --out tools/shots/z.png
*/
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function arg(name, fallback = null) {
    const i = process.argv.indexOf('--' + name);
    if (i === -1) return fallback;
    const next = process.argv[i + 1];
    if (!next || next.startsWith('--')) return true;
    return next;
}

const url = arg('url', 'http://127.0.0.1:8931/');
const out = arg('out', 'tools/shots/shot.png');
const width = Number(arg('w', 1440));
const height = Number(arg('h', 900));
const mobile = Boolean(arg('mobile', false));
const full = Boolean(arg('full', false));
const theme = arg('theme', 'dark');
const scale = Number(arg('scale', 1));
const waitMs = Number(arg('wait', 700));
const scrollY = Number(arg('scroll', 0));
const evalExpr = arg('eval', null);
const evalFile = arg('eval-file', null);
const clickSel = arg('click', null);
const offline = Boolean(arg('offline', false));
const port = Number(arg('port', 9333));

// Свежий профиль на каждый запуск, иначе service worker отдаст старый кэш.
const userDataDir = join(tmpdir(), 'gg-cdp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
mkdirSync(dirname(resolve(out)), { recursive: true });

const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank'
], { stdio: 'ignore' });

let browserWsUrl = null;
for (let i = 0; i < 100 && !browserWsUrl; i++) {
    await sleep(150);
    try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) browserWsUrl = (await res.json()).webSocketDebuggerUrl;
    } catch { /* ещё не поднялся */ }
}
if (!browserWsUrl) {
    chrome.kill();
    throw new Error('Chrome не запустился');
}

const pending = new Map();
let lastId = 0;
const listeners = new Map();

const ws = new WebSocket(browserWsUrl);
await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
});

const consoleMessages = [];
const pageErrors = [];

ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
        const { resolve: res, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message + ' ' + JSON.stringify(msg.error.data || '')));
        else res(msg.result);
        return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
        const type = msg.params.type;
        if (type === 'error' || type === 'warning') {
            consoleMessages.push({
                type,
                text: msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(' ')
            });
        }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
        pageErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleMessages.push({ type: 'log', text: msg.params.entry.text });
    }
    const key = msg.method;
    if (listeners.has(key)) {
        for (const fn of listeners.get(key)) fn(msg.params);
    }
});

function send(method, params = {}, sessionId) {
    const id = ++lastId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    ws.send(JSON.stringify(payload));
    return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
}

function once(method, timeout = 15000) {
    return new Promise((res, rej) => {
        const timer = setTimeout(() => rej(new Error('timeout: ' + method)), timeout);
        const list = listeners.get(method) || [];
        const fn = (params) => {
            clearTimeout(timer);
            listeners.set(method, list.filter((f) => f !== fn));
            res(params);
        };
        list.push(fn);
        listeners.set(method, list);
    });
}

try {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Log.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: scale, mobile,
        screenOrientation: mobile ? { type: 'portraitPrimary', angle: 0 } : undefined
    }, sessionId);
    await send('Emulation.setEmulatedMedia', {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: theme }]
    }, sessionId);

    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url }, sessionId);
    await loaded;
    await sleep(waitMs);

    // Офлайн-проверка: сначала даём service worker установиться, потом рубим сеть и перезагружаем.
    if (offline) {
        await sleep(2500);
        await send('Network.enable', {}, sessionId);
        await send('Network.emulateNetworkConditions', {
            offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0
        }, sessionId);
        const reloaded = once('Page.loadEventFired');
        await send('Page.reload', {}, sessionId);
        await reloaded;
        await sleep(1000);
    }

    if (scrollY) {
        await send('Runtime.evaluate', {
            expression: `window.scrollTo(0, ${scrollY}); new Promise(r => setTimeout(() => r(window.scrollY), 400))`,
            awaitPromise: true, returnByValue: true
        }, sessionId);
        await sleep(400);
    }

    if (clickSel) {
        await send('Runtime.evaluate', {
            expression: `(function(){const el=document.querySelector(${JSON.stringify(clickSel)}); if(!el) return 'not found'; el.click(); return 'clicked';})()`,
            returnByValue: true
        }, sessionId);
        await sleep(500);
    }

    const expression = evalFile ? readFileSync(resolve(evalFile), 'utf8') : evalExpr;
    if (expression) {
        const res = await send('Runtime.evaluate', {
            expression, returnByValue: true, awaitPromise: true
        }, sessionId);
        const value = res.result?.value;
        console.log('EVAL:', JSON.stringify(value, null, 2));
        if (res.exceptionDetails) {
            console.log('EVAL ERROR:', res.exceptionDetails.text, res.exceptionDetails.exception?.description || '');
        }
    }

    let clip = { x: 0, y: scrollY || 0, width, height, scale: 1 };
    if (full) {
        const metrics = await send('Page.getLayoutMetrics', {}, sessionId);
        const size = metrics.cssContentSize || metrics.contentSize;
        clip = { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 };
    }

    const shot = await send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: full, clip
    }, sessionId);

    writeFileSync(resolve(out), Buffer.from(shot.data, 'base64'));
    console.log('SAVED:', resolve(out), `${clip.width}x${clip.height}`);

    if (consoleMessages.length) {
        console.log('CONSOLE:');
        for (const m of consoleMessages) console.log(' -', m.type, m.text.slice(0, 400));
    } else {
        console.log('CONSOLE: ok (нет ошибок и предупреждений)');
    }
    if (pageErrors.length) {
        console.log('PAGE ERRORS:');
        for (const e of pageErrors) console.log(' -', e.slice(0, 400));
    }
} finally {
    try { ws.close(); } catch { /* ignore */ }
    chrome.kill();
    await sleep(300);
}
