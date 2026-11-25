# Великий гусь — сайт команды

Статический сайт творческой студии двух разработчиков. Без сборки и зависимостей:
чистые HTML, CSS и JavaScript. Тёмная и светлая темы, русский и английский языки,
PWA (установка и офлайн-режим), страница 404 и защитные заголовки через meta-CSP.

Живая версия: <https://skarbovoleg.github.io/-/>

## Что внутри

```
index.html               — вся страница: шапка, проекты, команда, планы, девлог, FAQ, подписка, контакты
404.html                 — страница «не найдено» в стиле сайта
manifest.webmanifest     — PWA-манифест (иконки, цвета, standalone)
sw.js                    — service worker: офлайн-кэш оболочки сайта
.nojekyll                — отключает Jekyll на GitHub Pages (нужно для папок с подчёркиванием)
assets/css/styles.css    — дизайн-система: токены тем, компоненты, адаптив, доступность
assets/js/app.js         — логика: темы, RU/EN, фильтры, модалки, подписка, пасхалка, PWA
assets/img/              — SVG-логотип, маскот, favicon, PNG-иконки, OG-обложка
tools/                   — служебные скрипты (скриншоты, иконки, OG-обложка)
```

## Локальный запуск

Открыть `index.html` двойным щелчком можно, но service worker и часть возможностей
работают только по HTTP. Проще так:

```powershell
cd great-goose-site
python -m http.server 8931 --bind 127.0.0.1
# затем открыть http://127.0.0.1:8931/
```

## Как менять контент

**Тексты и переводы** — `assets/js/app.js`, объект `I18N`. Ключи `ru` и `en` должны
совпадать: при переключении языка подставляются значения из словаря.

**Проекты.** Карточка живёт в `index.html` (блок `<!-- Проект 1 -->`), а подробное
описание для модального окна — в `assets/js/app.js`, объект `PROJECTS`. Если добавляете
новый проект:

1. скопируйте `<article class="card project" data-project="id" data-status="dev" data-search="...">`;
2. добавьте в `PROJECTS` запись с тем же `id`;
3. добавьте ключи `projects.pNtitle`, `projects.pNdesc`, `projects.pNlong`, `projects.pNf1…f4`
   в оба языка.

Фильтр «В планах» ищет `data-status="planned"`, поиск — по `data-search` и тексту карточки.

**Почта** указана в трёх местах: `index.html` (ссылки `mailto:` и текст), `assets/js/app.js`
(переменная `EMAIL`). Замените все три.

**Цвета и темы** — переменные в начале `assets/css/styles.css`: блоки
`:root, [data-theme="dark"]`, `[data-theme="light"]` и `@media (prefers-color-scheme: light)`
для режима «как в системе».

**Ссылки на репозиторий** — `https://github.com/SkarbovOleg/-` (в контактах и подвале).

## Публикация

Сайт раздаётся GitHub Pages из ветки `main`, поэтому публикация — это `git push`:

```powershell
git add -A
git commit -m "Сайт 2.0: редизайн и новые разделы"
git push origin main
```

Через минуту изменения появятся на <https://skarbovoleg.github.io/-/>.

Полезно знать:

- **Индексация выключена**: в `index.html` стоит `<meta name="robots" content="noindex, ...">`.
  Удалите эту строку, когда сайт будет готов попасть в поиск.
- **Кэш PWA**: после правок CSS/JS поднимите версию в `sw.js` (`var CACHE = 'great-goose-v3'`),
  иначе у вернувшихся посетителей останется старая копия из кэша.
- **Форма подписки** отправляет данные на Formspree: `https://formspree.io/f/mqavwwbz`
  (атрибут `action` у `#subscribe-form`). Если форма перестанет приходить — проверьте
  лимиты и адрес формы в личном кабинете Formspree.
- **Ссылки с параметрами**: `?theme=light|dark|auto` и `?lang=ru|en` — удобно для превью
  и для того, чтобы поделиться сайтом в нужном виде.

## Инструменты (не нужны для работы сайта)

Скриншоты и проверки вёрстки через Chrome DevTools Protocol — свежий профиль на каждый
запуск (иначе service worker отдаст старый кэш):

```powershell
node tools/cdp.mjs --url "http://127.0.0.1:8931/" --out tools/shots/desktop.png --w 1440 --h 950
node tools/cdp.mjs --url "http://127.0.0.1:8931/" --out tools/shots/mobile.png --w 390 --h 844 --mobile --full
```

Путь к Chrome можно переопределить переменной окружения `CHROME_PATH`.

Быстрые проверки без скриншотов: `--eval-file tools/audit.js` (полнота перевода RU/EN,
дубли `id`, битые якоря, `alt` у картинок) и `--offline --eval-file tools/offline-check.js`
(работает ли офлайн-кэш PWA после перезагрузки без сети).

Пересборка иконок и OG-обложки:

```powershell
# 1) отрендерить SVG в PNG (headless Chrome)
chrome --headless=new --screenshot=assets/img/icon-512.png --window-size=512,512 --default-background-color=00000000 assets/img/icon.svg
# 2) уменьшить до 192/180
python tools/make-icons.py
# 3) обложка 1200×630
chrome --headless=new --screenshot=assets/img/og-cover.png --window-size=1200,630 tools/og.html
```

## Версия 2.0 — что изменилось

- редизайн: новая сетка, тёмная/светлая/системная тема, анимации, адаптив от 320 px;
- новые разделы: команда, дорожная карта, девлог, FAQ;
- проекты: статусы, прогресс, теги, фильтры, поиск и модальные окна с подробностями;
- полноценный перевод RU/EN через `data-i18n` (вместо ручной подстановки);
- доступность: skip-link, семантика, `aria`-атрибуты, фокус-кольца, `prefers-reduced-motion`;
- PWA: манифест, service worker, офлайн-режим, установка на телефон;
- все изображения локальные (SVG-маскот и иконки) — ноль внешних запросов;
- безопасность: CSP без внешних источников, `object-src 'none'`, `base-uri 'none'`,
  ссылки `rel="noopener noreferrer"`;
- убраны прежние «защитные» ворота, перекрывавшие страницу, и пустые `styles.css`/`scripts.js`;
- страница 404, `.nojekyll`, README с инструкциями;
- пасхалка: гуся можно погладить (счётчик и достижение на 10-й раз).

## Поддержка браузеров

Chrome/Edge 105+, Firefox 110+, Safari 16+. `color-mix()` и `<dialog>` деградируют
аккуратно: модалка откроется как обычный диалог, фоны станут чуть проще.
