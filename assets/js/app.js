/* ==========================================================================
   «Великий гусь» — логика сайта.
   Без зависимостей: тема, язык (RU/EN), фильтры проектов, модалки,
   подписка через Formspree, буфер обмена, пасхалка с гусём, PWA.
   ========================================================================== */
(function () {
    'use strict';

    var html = document.documentElement;
    html.classList.add('js');

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    var STORAGE = {
        theme: 'gg_theme',
        lang: 'gg_lang',
        quacks: 'gg_quacks'
    };

    var EMAIL = 'velikiygusofficial@gmail.com';

    /* ======================================================================
       1. Переводы
       ====================================================================== */
    var I18N = {
        ru: {
            'meta.title': 'Великий гусь — команда разработчиков игр',
            'meta.description': 'Великий гусь — творческая студия двух разработчиков. Делаем игры, в которые сами бы играли: исторические стратегии, приключенческие платформеры и эксперименты.',

            'skipLink': 'Перейти к содержимому',
            'brand.name': 'Великий гусь',
            'brandTagline': 'команда разработчиков',
            'cta.subscribe': 'Подписаться',

            'nav.home': 'Главная',
            'nav.projects': 'Проекты',
            'nav.team': 'Команда',
            'nav.roadmap': 'Планы',
            'nav.devlog': 'Девлог',
            'nav.faq': 'Вопросы',
            'nav.contact': 'Контакты',

            'aria.menu': 'Открыть меню',
            'aria.menuClose': 'Закрыть меню',
            'aria.toTop': 'Наверх',
            'aria.close': 'Закрыть',
            'aria.goose': 'Погладить гуся',
            'aria.themeAuto': 'Тема: как в системе',
            'aria.themeLight': 'Тема: светлая',
            'aria.themeDark': 'Тема: тёмная',
            'aria.switchLang': 'Switch to English',

            'hero.eyebrow': '🎮 Творческая студия двух разработчиков',
            'hero.titleLead': 'Игры, в которые',
            'hero.titleAccent': 'играли бы сами',
            'hero.lead': 'Великий гусь — это творческая студия двух разработчиков. Мы делаем то, во что сами бы с удовольствием играли: захватывающие приключения, стратегии с интересными механиками и проекты с душой.',
            'hero.ctaProjects': 'Смотреть проекты',
            'hero.ctaSubscribe': 'Подписаться на новости',
            'hero.hint': 'Гуся можно погладить — он отвечает «га!»',

            'stats.projects': 'проекта в работе',
            'stats.developers': 'разработчика',
            'stats.platforms': 'платформы',

            'projects.eyebrow': '🚀 Портфолио',
            'projects.title': 'Наши проекты',
            'projects.lead': 'Три проекта в работе: историческая стратегия, приключенческий платформер и секретная новинка. Скачивание откроется сразу после релиза.',
            'projects.filterAll': 'Все',
            'projects.filterDev': 'В разработке',
            'projects.filterPlanned': 'В планах',
            'projects.searchLabel': 'Поиск по проектам',
            'projects.searchPlaceholder': 'Поиск по проектам…',
            'projects.statusDev': 'В разработке',
            'projects.statusPlanned': 'В планах',
            'projects.details': 'Подробнее',
            'projects.notify': 'Уведомить',
            'projects.empty': 'Ничего не нашлось. Попробуйте другой запрос.',
            'projects.note': '⏳ Игры пока недоступны для скачивания — мы сообщим, как только появится первая сборка.',

            'projects.p1title': 'Гражданская война в России 2D',
            'projects.p1genre': 'Историческая стратегия',
            'projects.p1desc': 'Историческая игра о Гражданской войне в России: выбирай класс, исследуй большую карту и сражайся с противниками.',
            'projects.p1long': 'Историческая игра о Гражданской войне в России. Выбирайте класс, исследуйте большую карту и сражайтесь с противниками в PvP. Ставка — на атмосферу эпохи и понятные правила боя: разобраться можно за пару минут.',
            'projects.p1f1': 'Выбор класса',
            'projects.p1f2': 'Большая карта',
            'projects.p1f3': 'PvP-сражения',
            'projects.p1f4': 'Исторические фракции',

            'projects.p2title': 'Спаси Алису',
            'projects.p2genre': 'Приключенческий платформер',
            'projects.p2desc': 'Приключенческий платформер: помоги герою спасти Алису от злодеев, пройдя через опасные уровни, головоломки и боссов.',
            'projects.p2long': 'Приключенческий платформер, в котором герой отправляется спасать Алису. Опасные уровни, головоломки, боссы и коллекционные предметы. Учимся на классике жанра и добавляем собственные механики.',
            'projects.p2f1': 'Платформер',
            'projects.p2f2': 'Головоломки',
            'projects.p2f3': 'Боссы',
            'projects.p2f4': 'Сбор предметов',

            'projects.p3title': 'Секретный проект',
            'projects.p3genre': 'Пока секрет',
            'projects.p3desc': 'Новый увлекательный проект в разработке. Скоро будет больше информации!',
            'projects.p3long': 'Новый проект команды, о котором пока нельзя рассказать подробности. Экспериментируем с механиками и проверяем идеи на прототипах — как только будет что показать, сразу напишем в девлоге.',
            'projects.p3f1': 'Эксперимент',
            'projects.p3f2': 'Новые механики',
            'projects.p3f3': 'Экшен',
            'projects.p3f4': 'Секретная механика',

            'team.eyebrow': '👨‍💻 О нас',
            'team.title': 'Команда',
            'team.lead': 'VelikiyGus — творческая студия двух разработчиков. Мы делаем то, во что сами бы с удовольствием играли: захватывающие приключения, стратегии с интересными механиками и проекты с душой.',
            'team.quote': '«VelikiyGus» — разработчик игр и веб-приложений. Создаю увлекательные игры и интересные проекты.',
            'team.skillsTitle': '🛠️ Технические навыки',
            'team.skillGameDev': 'Разработка игр',
            'team.skill2d': '2D-графика',
            'team.skillWeb': 'Веб-разработка',
            'team.specTitle': 'Специализация',
            'team.specText': 'Разработка 2D-игр, веб-приложений и игровых механик.',
            'team.goalsTitle': 'Цели',
            'team.goalsText': 'Создавать качественные игры, которые будут нравиться игрокам.',
            'team.platformsTitle': 'Платформы',
            'team.platformsText': 'Windows, Web, Roblox, мобильные устройства.',
            'team.contactsTitle': 'Контакты',
            'team.contactsText': 'Напишите нам на почту или подпишитесь на новости.',

            'roadmap.eyebrow': '🧭 Куда движемся',
            'roadmap.title': 'Дорожная карта',
            'roadmap.lead': 'Порядок этапов и сроки могут меняться — все новости публикуем в девлоге.',
            'roadmap.stateDone': 'Готово',
            'roadmap.stateActive': 'В работе',
            'roadmap.statePlanned': 'В планах',
            'roadmap.r1title': 'Сайт команды',
            'roadmap.r1text': 'Новая версия сайта: дизайн, разделы о команде и проектах, тёмная тема и английская версия.',
            'roadmap.r2title': 'Гражданская война в России 2D',
            'roadmap.r2text': 'Классы, большая карта и PvP-сражения. Дальше — баланс и первый публичный тест.',
            'roadmap.r3title': 'Спаси Алису',
            'roadmap.r3text': 'Уровни, головоломки и боссы. Собираем прототип первого мира.',
            'roadmap.r4title': 'Секретный проект',
            'roadmap.r4text': 'Экспериментируем с механиками. Расскажем, когда будет что показать.',

            'devlog.eyebrow': '📝 Дневник разработки',
            'devlog.title': 'Девлог',
            'devlog.lead': 'Что нового у команды — коротко и по делу.',
            'devlog.d1date': '25 ноября 2026',
            'devlog.d1tag': 'Сайт',
            'devlog.d1title': 'Версия 2.0: новый сайт',
            'devlog.d1text': 'Полностью переделали сайт: тёмная и светлая темы, английская версия, проекты с фильтрами, дорожная карта, девлог и FAQ. Добавили офлайн-режим и установку как приложение.',
            'devlog.d2date': '4 января 2026',
            'devlog.d2tag': 'Сайт',
            'devlog.d2title': 'Тёмная тема и английский язык',
            'devlog.d2text': 'На сайте появились переключатель темы и перевод на английский, а структура страницы стала заметно аккуратнее.',
            'devlog.d3date': 'Сентябрь 2025',
            'devlog.d3tag': 'Запуск',
            'devlog.d3title': 'Запуск сайта',
            'devlog.d3text': 'Собрали первую версию сайта команды: рассказ о нас, список проектов и форма подписки на новости.',

            'faq.eyebrow': '💬 Вопросы',
            'faq.title': 'Частые вопросы',
            'faq.q1': 'Когда выйдут игры?',
            'faq.a1': 'Точных дат пока нет: мы не хотим обещать раньше времени. Все вехи и первые сборки появятся в девлоге, а подписчикам придёт письмо.',
            'faq.q2': 'Где скачать игры?',
            'faq.a2': 'Игры ещё не вышли — кнопки скачивания появятся на карточках проектов. Подпишитесь на новости, чтобы не пропустить релиз.',
            'faq.q3': 'На каких платформах будут игры?',
            'faq.a3': 'Ориентируемся на Windows и Web, часть проектов планируется для Roblox и мобильных устройств.',
            'faq.q4': 'Можно ли помочь или предложить идею?',
            'faq.a4': 'Конечно! Напишите на почту: мы читаем всё и отвечаем в течение 1–2 рабочих дней.',
            'faq.q5': 'Что будет с моим email после подписки?',
            'faq.a5': 'Мы используем его только для новостей о проектах. Рассылка идёт через Formspree, отписаться можно в один клик в любом письме.',
            'faq.q6': 'Почему «Великий гусь»?',
            'faq.a6': 'Потому что гусь — птица серьёзная, упорная и с характером. Как наши игры. Га!',

            'subscribe.eyebrow': '🔔 Новости',
            'subscribe.title': 'Подписаться на новости',
            'subscribe.lead': 'Напишем, когда появится первая сборка, и расскажем о важных обновлениях. Без спама.',
            'subscribe.perk1': 'Уведомим о выходе новых игр',
            'subscribe.perk2': 'Пришлём анонсы обновлений',
            'subscribe.perk3': 'Иногда — эксклюзивные новости команды',
            'subscribe.emailLabel': '📧 Ваш email',
            'subscribe.emailPlaceholder': 'you@example.com',
            'subscribe.nameLabel': '👤 Имя (необязательно)',
            'subscribe.namePlaceholder': 'Как к вам обращаться?',
            'subscribe.gamesLabel': '🎮 О каких играх писать?',
            'subscribe.allFuture': 'Все будущие игры',
            'subscribe.consent': 'Я согласен получать письма о проектах и на обработку персональных данных',
            'subscribe.button': 'Подписаться',
            'subscribe.note': 'Отписаться можно в один клик. Почту не передаём третьим лицам.',
            'subscribe.sending': 'Отправляем…',
            'subscribe.success': 'Готово! Проверьте почту — мы добавили вас в список.',
            'subscribe.error': 'Не получилось отправить. Попробуйте ещё раз или напишите на почту.',
            'subscribe.invalidEmail': 'Похоже, в адресе опечатка.',
            'subscribe.consentRequired': 'Нужно согласие на обработку данных.',

            'contact.eyebrow': '📧 На связи',
            'contact.title': 'Напишите нам',
            'contact.lead': 'Есть вопросы, идеи или предложение о сотрудничестве? Будем рады письму.',
            'contact.emailLabel': 'Почта команды',
            'contact.copy': 'Скопировать',
            'contact.write': 'Написать',
            'contact.responseTitle': 'Скорость ответа',
            'contact.responseText': 'Обычно отвечаем в течение 1–2 рабочих дней.',
            'contact.responseNote': 'Если письмо не дошло — попробуйте форму подписки или напишите повторно.',
            'contact.codeTitle': 'Код и история',
            'contact.codeText': 'Сайт открыт: смотрите исходники и историю изменений в репозитории.',

            'footer.tagline': 'игры с характером',
            'footer.about': 'Творческая студия двух разработчиков. Делаем игры, в которые сами бы играли.',
            'footer.share': 'Поделиться сайтом',
            'footer.sections': 'Разделы',
            'footer.projects': 'Проекты',
            'footer.contacts': 'Контакты',
            'footer.quacks': 'Гусей поглажено:',
            'footer.rights': 'Все права защищены',
            'footer.made': 'Сделано небольшой командой с большим гусём',

            'modal.features': 'Особенности',
            'modal.platforms': 'Платформы',
            'modal.close': 'Закрыть',
            'modal.note': 'Игра ещё в разработке — дата релиза появится в девлоге.',

            'toast.copied': 'Почта скопирована в буфер обмена',
            'toast.copyError': 'Не удалось скопировать — выделите адрес вручную',
            'toast.notify': 'Игра отмечена в форме — осталось указать email',
            'toast.shared': 'Ссылка на сайт скопирована',
            'toast.shareError': 'Не удалось поделиться ссылкой',
            'toast.quack': 'Га!',
            'toast.quackAchievement': 'Достижение: гусиный повелитель',
            'toast.offlineReady': 'Сайт сохранён для офлайн-просмотра'
        },

        en: {
            'meta.title': 'Great Goose — a game development team',
            'meta.description': 'Great Goose is a small studio of two developers making games we would love to play: historical strategies, adventure platformers and experiments.',

            'skipLink': 'Skip to content',
            'brand.name': 'Great Goose',
            'brandTagline': 'game development team',
            'cta.subscribe': 'Subscribe',

            'nav.home': 'Home',
            'nav.projects': 'Projects',
            'nav.team': 'Team',
            'nav.roadmap': 'Roadmap',
            'nav.devlog': 'Devlog',
            'nav.faq': 'FAQ',
            'nav.contact': 'Contact',

            'aria.menu': 'Open menu',
            'aria.menuClose': 'Close menu',
            'aria.toTop': 'Back to top',
            'aria.close': 'Close',
            'aria.goose': 'Pet the goose',
            'aria.themeAuto': 'Theme: system',
            'aria.themeLight': 'Theme: light',
            'aria.themeDark': 'Theme: dark',
            'aria.switchLang': 'Переключить на русский',

            'hero.eyebrow': '🎮 A studio of two developers',
            'hero.titleLead': 'Games we\'d',
            'hero.titleAccent': 'play ourselves',
            'hero.lead': 'Great Goose is a small creative studio of two developers. We build what we would happily play ourselves: exciting adventures, strategies with interesting mechanics and projects made with heart.',
            'hero.ctaProjects': 'See projects',
            'hero.ctaSubscribe': 'Get updates',
            'hero.hint': 'You can pet the goose — it says “honk!”',

            'stats.projects': 'projects in progress',
            'stats.developers': 'developers',
            'stats.platforms': 'platforms',

            'projects.eyebrow': '🚀 Portfolio',
            'projects.title': 'Our projects',
            'projects.lead': 'Three projects in the works: a historical strategy, an adventure platformer and a secret new game. Downloads will open right after release.',
            'projects.filterAll': 'All',
            'projects.filterDev': 'In development',
            'projects.filterPlanned': 'Planned',
            'projects.searchLabel': 'Search projects',
            'projects.searchPlaceholder': 'Search projects…',
            'projects.statusDev': 'In development',
            'projects.statusPlanned': 'Planned',
            'projects.details': 'Details',
            'projects.notify': 'Notify me',
            'projects.empty': 'Nothing found. Try another query.',
            'projects.note': '⏳ The games are not available for download yet — we will let you know as soon as the first build is ready.',

            'projects.p1title': 'Russian Civil War 2D',
            'projects.p1genre': 'Historical strategy',
            'projects.p1desc': 'A historical game about the Russian Civil War: pick a class, explore a large map and fight your opponents.',
            'projects.p1long': 'A historical game about the Russian Civil War. Pick a class, explore a large map and fight other players in PvP. We focus on the atmosphere of the era and clear combat rules you can learn in a couple of minutes.',
            'projects.p1f1': 'Class system',
            'projects.p1f2': 'Large map',
            'projects.p1f3': 'PvP battles',
            'projects.p1f4': 'Historical factions',

            'projects.p2title': 'Save Alice',
            'projects.p2genre': 'Adventure platformer',
            'projects.p2desc': 'An adventure platformer: help the hero save Alice from the villains by getting through dangerous levels, puzzles and bosses.',
            'projects.p2long': 'An adventure platformer where the hero sets out to save Alice. Dangerous levels, puzzles, bosses and collectibles. We learn from the classics of the genre and add our own mechanics.',
            'projects.p2f1': 'Platforming',
            'projects.p2f2': 'Puzzles',
            'projects.p2f3': 'Bosses',
            'projects.p2f4': 'Collectibles',

            'projects.p3title': 'Secret project',
            'projects.p3genre': 'Still a secret',
            'projects.p3desc': 'A new exciting project is in development. More information coming soon!',
            'projects.p3long': 'A new team project we cannot talk about yet. We are experimenting with mechanics and testing ideas in prototypes — as soon as we have something to show, it will be in the devlog.',
            'projects.p3f1': 'Experiment',
            'projects.p3f2': 'New mechanics',
            'projects.p3f3': 'Action',
            'projects.p3f4': 'Secret mechanic',

            'team.eyebrow': '👨‍💻 About us',
            'team.title': 'The team',
            'team.lead': 'VelikiyGus is a creative studio of two developers. We build what we would happily play ourselves: exciting adventures, strategies with interesting mechanics and projects made with heart.',
            'team.quote': '“VelikiyGus” — game and web developer. I create engaging games and interesting projects.',
            'team.skillsTitle': '🛠️ Technical skills',
            'team.skillGameDev': 'Game development',
            'team.skill2d': '2D graphics',
            'team.skillWeb': 'Web development',
            'team.specTitle': 'Specialisation',
            'team.specText': '2D games, web applications and game mechanics.',
            'team.goalsTitle': 'Goals',
            'team.goalsText': 'To make quality games that players will enjoy.',
            'team.platformsTitle': 'Platforms',
            'team.platformsText': 'Windows, Web, Roblox, mobile devices.',
            'team.contactsTitle': 'Contacts',
            'team.contactsText': 'Write us an email or subscribe to the news.',

            'roadmap.eyebrow': '🧭 Where we are going',
            'roadmap.title': 'Roadmap',
            'roadmap.lead': 'The order of milestones and dates may change — all news goes to the devlog.',
            'roadmap.stateDone': 'Done',
            'roadmap.stateActive': 'In progress',
            'roadmap.statePlanned': 'Planned',
            'roadmap.r1title': 'Team website',
            'roadmap.r1text': 'A new version of the site: fresh design, team and project sections, dark theme and an English version.',
            'roadmap.r2title': 'Russian Civil War 2D',
            'roadmap.r2text': 'Classes, a large map and PvP battles. Next up: balance and the first public test.',
            'roadmap.r3title': 'Save Alice',
            'roadmap.r3text': 'Levels, puzzles and bosses. We are building the first world prototype.',
            'roadmap.r4title': 'Secret project',
            'roadmap.r4text': 'Experimenting with mechanics. We will talk about it when there is something to show.',

            'devlog.eyebrow': '📝 Development diary',
            'devlog.title': 'Devlog',
            'devlog.lead': 'What is new with the team — short and to the point.',
            'devlog.d1date': '25 November 2026',
            'devlog.d1tag': 'Website',
            'devlog.d1title': 'Version 2.0: a new website',
            'devlog.d1text': 'We rebuilt the site: dark and light themes, an English version, projects with filters, a roadmap, a devlog and an FAQ. Added offline mode and installable app support.',
            'devlog.d2date': '4 January 2026',
            'devlog.d2tag': 'Website',
            'devlog.d2title': 'Dark theme and English',
            'devlog.d2text': 'The site got a theme switcher and an English translation, and the page structure became much tidier.',
            'devlog.d3date': 'September 2025',
            'devlog.d3tag': 'Launch',
            'devlog.d3title': 'Website launch',
            'devlog.d3text': 'We shipped the first version of the team site: who we are, a list of projects and a news subscription form.',

            'faq.eyebrow': '💬 Questions',
            'faq.title': 'Frequently asked',
            'faq.q1': 'When will the games be released?',
            'faq.a1': 'There are no exact dates yet — we do not want to promise too early. All milestones and first builds will appear in the devlog, and subscribers will get an email.',
            'faq.q2': 'Where can I download the games?',
            'faq.a2': 'The games are not out yet — download buttons will appear on the project cards. Subscribe to the news so you do not miss the release.',
            'faq.q3': 'Which platforms are planned?',
            'faq.a3': 'We focus on Windows and Web; some projects are planned for Roblox and mobile devices.',
            'faq.q4': 'Can I help or suggest an idea?',
            'faq.a4': 'Sure! Write us an email: we read everything and reply within 1–2 business days.',
            'faq.q5': 'What happens to my email after subscribing?',
            'faq.a5': 'We use it only for project news. Delivery runs through Formspree and you can unsubscribe with one click in any email.',
            'faq.q6': 'Why “Great Goose”?',
            'faq.a6': 'Because a goose is a serious, persistent bird with character. Just like our games. Honk!',

            'subscribe.eyebrow': '🔔 News',
            'subscribe.title': 'Get the news',
            'subscribe.lead': 'We will write when the first build is ready and share important updates. No spam.',
            'subscribe.perk1': 'Be the first to hear about new games',
            'subscribe.perk2': 'Get update announcements',
            'subscribe.perk3': 'Occasional exclusive team news',
            'subscribe.emailLabel': '📧 Your email',
            'subscribe.emailPlaceholder': 'you@example.com',
            'subscribe.nameLabel': '👤 Name (optional)',
            'subscribe.namePlaceholder': 'What should we call you?',
            'subscribe.gamesLabel': '🎮 Which games are you interested in?',
            'subscribe.allFuture': 'All future games',
            'subscribe.consent': 'I agree to receive project emails and to the processing of my personal data',
            'subscribe.button': 'Subscribe',
            'subscribe.note': 'Unsubscribe with one click. We never share your email with third parties.',
            'subscribe.sending': 'Sending…',
            'subscribe.success': 'Done! Check your inbox — you are on the list.',
            'subscribe.error': 'Sending failed. Please try again or email us directly.',
            'subscribe.invalidEmail': 'That email address looks off.',
            'subscribe.consentRequired': 'Please accept the data processing terms.',

            'contact.eyebrow': '📧 Say hello',
            'contact.title': 'Write to us',
            'contact.lead': 'Questions, ideas or a partnership proposal? We would love to hear from you.',
            'contact.emailLabel': 'Team email',
            'contact.copy': 'Copy',
            'contact.write': 'Write',
            'contact.responseTitle': 'Response time',
            'contact.responseText': 'We usually reply within 1–2 business days.',
            'contact.responseNote': 'If your email did not arrive, try the subscription form or send it again.',
            'contact.codeTitle': 'Code and history',
            'contact.codeText': 'The site is open: browse the source code and the change history in the repository.',

            'footer.tagline': 'games with character',
            'footer.about': 'A creative studio of two developers. We make games we would play ourselves.',
            'footer.share': 'Share this site',
            'footer.sections': 'Sections',
            'footer.projects': 'Projects',
            'footer.contacts': 'Contacts',
            'footer.quacks': 'Geese petted:',
            'footer.rights': 'All rights reserved',
            'footer.made': 'Made by a small team with a very big goose',

            'modal.features': 'Features',
            'modal.platforms': 'Platforms',
            'modal.close': 'Close',
            'modal.note': 'The game is still in development — the release date will appear in the devlog.',

            'toast.copied': 'Email copied to clipboard',
            'toast.copyError': 'Could not copy — please select the address manually',
            'toast.notify': 'Game selected in the form — just add your email',
            'toast.shared': 'Site link copied',
            'toast.shareError': 'Could not share the link',
            'toast.quack': 'Honk!',
            'toast.quackAchievement': 'Achievement unlocked: goose whisperer',
            'toast.offlineReady': 'The site is saved for offline browsing'
        }
    };

    var lang = localStorage.getItem(STORAGE.lang) === 'en' ? 'en' : 'ru';

    // Тему и язык можно задать ссылкой: ?theme=dark&lang=en
    var params = new URLSearchParams(window.location.search);
    var paramLang = params.get('lang');
    if (paramLang === 'ru' || paramLang === 'en') lang = paramLang;

    function t(key) {
        var dict = I18N[lang] || I18N.ru;
        return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : (I18N.ru[key] || key);
    }

    /* ======================================================================
       2. Тема
       ====================================================================== */
    var THEMES = ['auto', 'light', 'dark'];
    var THEME_GLYPH = { auto: '◐', light: '☀️', dark: '🌙' };
    var theme = localStorage.getItem(STORAGE.theme);
    if (THEMES.indexOf(theme) === -1) theme = 'auto';
    var paramTheme = params.get('theme');
    if (THEMES.indexOf(paramTheme) !== -1) theme = paramTheme;

    function themeLabel(value) {
        return t(value === 'light' ? 'aria.themeLight' : value === 'dark' ? 'aria.themeDark' : 'aria.themeAuto');
    }

    function applyTheme(value, announce) {
        theme = value;
        html.setAttribute('data-theme', value);
        localStorage.setItem(STORAGE.theme, value);

        var btn = $('#theme-toggle');
        var glyph = $('#theme-glyph');
        if (glyph) glyph.textContent = THEME_GLYPH[value];
        if (btn) {
            btn.setAttribute('aria-label', themeLabel(value));
            btn.setAttribute('title', themeLabel(value));
        }
        if (announce) toast(THEMES.indexOf(value) === 0 ? t('aria.themeAuto') : themeLabel(value), 'ok');
    }

    function initTheme() {
        applyTheme(theme, false);
        var btn = $('#theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
                applyTheme(next, true);
            });
        }
    }

    /* ======================================================================
       3. Локализация DOM
       ====================================================================== */
    function applyLanguage(next, announce) {
        lang = next;
        html.setAttribute('lang', next);
        localStorage.setItem(STORAGE.lang, next);

        $$('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        $$('[data-i18n-html]').forEach(function (el) {
            el.innerHTML = t(el.getAttribute('data-i18n-html'));
        });
        $$('[data-i18n-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        $$('[data-i18n-aria-label]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
        });

        document.title = t('meta.title');
        var desc = $('meta[name="description"]');
        if (desc) desc.setAttribute('content', t('meta.description'));
        var ogTitle = $('meta[property="og:title"]');
        var ogDesc = $('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute('content', t('meta.title'));
        if (ogDesc) ogDesc.setAttribute('content', t('meta.description'));
        var twTitle = $('meta[name="twitter:title"]');
        var twDesc = $('meta[name="twitter:description"]');
        if (twTitle) twTitle.setAttribute('content', t('meta.title'));
        if (twDesc) twDesc.setAttribute('content', t('meta.description'));

        var langBtn = $('#lang-toggle');
        if (langBtn) {
            var label = $('.lang-switch__current', langBtn);
            if (label) label.textContent = next === 'ru' ? 'RU' : 'EN';
            langBtn.setAttribute('aria-label', t('aria.switchLang'));
            langBtn.setAttribute('title', t('aria.switchLang'));
        }

        var burger = $('#burger');
        if (burger) {
            burger.setAttribute('aria-label', t(burger.getAttribute('aria-expanded') === 'true' ? 'aria.menuClose' : 'aria.menu'));
        }
        var toTop = $('#to-top');
        if (toTop) {
            toTop.setAttribute('aria-label', t('aria.toTop'));
            toTop.setAttribute('title', t('aria.toTop'));
        }
        var goose = $('#goose-card');
        if (goose) goose.setAttribute('aria-label', t('aria.goose'));
        var modalClose = $('#modal-close');
        if (modalClose) modalClose.setAttribute('aria-label', t('aria.close'));

        applyTheme(theme, false);

        if (currentProject) renderModal(currentProject);
        if (announce) toast(next === 'ru' ? 'Русский язык включён' : 'English is on', 'ok');
    }

    function initLanguage() {
        applyLanguage(lang, false);
        var btn = $('#lang-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                applyLanguage(lang === 'ru' ? 'en' : 'ru', true);
            });
        }
    }

    /* ======================================================================
       4. Уведомления (тосты)
       ====================================================================== */
    function toast(message, type, icon) {
        var stack = $('#toast-stack');
        if (!stack) return;
        var el = document.createElement('div');
        el.className = 'toast' + (type ? ' toast--' + type : '');
        el.innerHTML = '<span class="toast__icon">' + (icon || (type === 'error' ? '!' : '✓')) + '</span><span></span>';
        el.lastElementChild.textContent = message;
        stack.appendChild(el);
        setTimeout(function () {
            el.classList.add('is-out');
            setTimeout(function () { el.remove(); }, 320);
        }, 3600);
    }

    /* ======================================================================
       5. Мобильное меню
       ====================================================================== */
    function initMenu() {
        var burger = $('#burger');
        var nav = $('#primary-nav');
        if (!burger || !nav) return;

        function close() {
            nav.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', t('aria.menu'));
            document.body.classList.remove('menu-open');
        }

        burger.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            burger.setAttribute('aria-label', open ? t('aria.menuClose') : t('aria.menu'));
            document.body.classList.toggle('menu-open', open);
        });

        $$('.nav__link', nav).forEach(function (link) {
            link.addEventListener('click', close);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) close();
        });
    }

    /* ======================================================================
       6. Скролл: прогресс, тень шапки, активный пункт, кнопка «наверх»
       ====================================================================== */
    function initScrollUi() {
        var header = $('#site-header');
        var bar = $('#scroll-progress-bar');
        var toTop = $('#to-top');
        var ticking = false;

        function update() {
            var y = window.scrollY || window.pageYOffset;
            var height = document.documentElement.scrollHeight - window.innerHeight;
            var progress = height > 0 ? Math.min(100, (y / height) * 100) : 0;
            if (bar) bar.style.width = progress + '%';
            if (header) header.classList.toggle('is-scrolled', y > 12);
            if (toTop) toTop.classList.toggle('is-visible', y > 600);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        update();

        if (toTop) {
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    function initScrollSpy() {
        var links = $$('.nav__link');
        if (!links.length || !('IntersectionObserver' in window)) return;

        var map = {};
        links.forEach(function (link) {
            var id = link.getAttribute('href').replace('#', '');
            if (id) map[id] = link;
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) { l.classList.remove('is-active'); });
                var link = map[entry.target.id];
                if (link) link.classList.add('is-active');
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        Object.keys(map).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) observer.observe(section);
        });
    }

    /* ======================================================================
       7. Появление блоков и счётчики
       ====================================================================== */
    function initReveal() {
        var items = $$('.reveal');
        if (!items.length) return;

        if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            $$('.counter').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function (el) { observer.observe(el); });

        var counters = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                counters.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        $$('.counter').forEach(function (el) { counters.observe(el); });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = performance.now();
        var duration = 1100;

        function frame(now) {
            var ratio = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - ratio, 3);
            el.textContent = String(Math.round(target * eased));
            if (ratio < 1) window.requestAnimationFrame(frame);
            else el.textContent = String(target);
        }
        window.requestAnimationFrame(frame);
        // страховка: если rAF «замёрз» (фоновая вкладка), всё равно показываем итог
        window.setTimeout(function () { el.textContent = String(target); }, duration + 400);
    }

    /* ======================================================================
       8. Проекты: фильтры и поиск
       ====================================================================== */
    var PROJECTS = {
        'civil-war': {
            titleKey: 'projects.p1title',
            longKey: 'projects.p1long',
            genreKey: 'projects.p1genre',
            statusKey: 'projects.statusDev',
            statusClass: 'pill--dev',
            progress: 45,
            emoji: '⚔️',
            cover: 'cover--civil',
            platforms: 'Windows, Web',
            features: ['projects.p1f1', 'projects.p1f2', 'projects.p1f3', 'projects.p1f4']
        },
        'save-alice': {
            titleKey: 'projects.p2title',
            longKey: 'projects.p2long',
            genreKey: 'projects.p2genre',
            statusKey: 'projects.statusDev',
            statusClass: 'pill--dev',
            progress: 30,
            emoji: '👧',
            cover: 'cover--alice',
            platforms: 'Windows, Web, Mobile',
            features: ['projects.p2f1', 'projects.p2f2', 'projects.p2f3', 'projects.p2f4']
        },
        'secret': {
            titleKey: 'projects.p3title',
            longKey: 'projects.p3long',
            genreKey: 'projects.p3genre',
            statusKey: 'projects.statusPlanned',
            statusClass: 'pill--planned',
            progress: 10,
            emoji: '🎮',
            cover: 'cover--secret',
            platforms: 'TBA',
            features: ['projects.p3f1', 'projects.p3f2', 'projects.p3f3', 'projects.p3f4']
        }
    };

    var activeFilter = 'all';
    var searchQuery = '';

    function applyProjectFilter() {
        var cards = $$('.project');
        var visible = 0;

        cards.forEach(function (card) {
            var matchesStatus = activeFilter === 'all' || card.getAttribute('data-status') === activeFilter;
            var haystack = (card.getAttribute('data-search') || '') + ' ' + card.textContent.toLowerCase();
            var matchesQuery = !searchQuery || haystack.indexOf(searchQuery) !== -1;
            var show = matchesStatus && matchesQuery;
            card.classList.toggle('is-hidden', !show);
            if (show) visible += 1;
        });

        var empty = $('#projects-empty');
        if (empty) empty.hidden = visible !== 0;
    }

    function initProjects() {
        $$('.filter').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeFilter = btn.getAttribute('data-filter');
                $$('.filter').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
                applyProjectFilter();
            });
        });

        var search = $('#project-search');
        if (search) {
            search.addEventListener('input', function () {
                searchQuery = search.value.trim().toLowerCase();
                applyProjectFilter();
            });
        }

        applyProjectFilter();
    }

    /* ======================================================================
       9. Модалка проекта
       ====================================================================== */
    var currentProject = null;

    function renderModal(id) {
        var project = PROJECTS[id];
        if (!project) return;
        currentProject = id;

        var modal = $('#project-modal');
        if (!modal) return;

        var cover = $('#modal-cover');
        if (cover) cover.className = 'modal__cover ' + project.cover;
        var emoji = $('#modal-emoji');
        if (emoji) emoji.textContent = project.emoji;

        var status = $('#modal-status');
        if (status) {
            status.className = 'pill ' + project.statusClass;
            status.textContent = t(project.statusKey);
        }
        var genre = $('#modal-genre');
        if (genre) genre.textContent = t(project.genreKey);
        $('#modal-title').textContent = t(project.titleKey);
        $('#modal-desc').textContent = t(project.longKey);
        $('#modal-platforms').textContent = project.platforms;

        var features = $('#modal-features');
        if (features) {
            features.innerHTML = '';
            project.features.forEach(function (key) {
                var li = document.createElement('li');
                li.textContent = t(key);
                features.appendChild(li);
            });
        }

        var progress = $('#modal-progress');
        if (progress) progress.setAttribute('aria-valuenow', String(project.progress));
        var fill = $('#modal-progress-fill');
        if (fill) fill.style.width = project.progress + '%';

        var notify = $('#modal-notify');
        if (notify) notify.setAttribute('data-notify', id);
    }

    function openProject(id) {
        var modal = $('#project-modal');
        if (!modal) return;
        renderModal(id);
        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', '');
        }
    }

    function closeProject() {
        var modal = $('#project-modal');
        if (!modal) return;
        if (typeof modal.close === 'function') modal.close();
        else modal.removeAttribute('open');
        currentProject = null;
    }

    function initModal() {
        var modal = $('#project-modal');
        if (!modal) return;

        $$('[data-open-project]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openProject(btn.getAttribute('data-open-project'));
            });
        });

        ['#modal-close', '#modal-dismiss'].forEach(function (sel) {
            var btn = $(sel);
            if (btn) btn.addEventListener('click', closeProject);
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeProject();
        });

        modal.addEventListener('cancel', function () {
            currentProject = null;
        });
    }

    /* ======================================================================
       10. «Уведомить о выходе»
       ====================================================================== */
    function notifyAbout(id) {
        closeProject();

        var checkbox = $('input[name="games"][value="' + id + '"]');
        if (checkbox) checkbox.checked = true;

        var section = $('#subscribe');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        var email = $('#subscribe-email');
        if (email) {
            setTimeout(function () { email.focus({ preventScroll: true }); }, 500);
        }

        toast(t('toast.notify'), 'ok');
    }

    function initNotify() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest ? e.target.closest('[data-notify]') : null;
            if (btn) notifyAbout(btn.getAttribute('data-notify'));
        });
    }

    /* ======================================================================
       11. Форма подписки
       ====================================================================== */
    function initForm() {
        var form = $('#subscribe-form');
        if (!form) return;

        var statusEl = $('#form-status');
        var emailInput = $('#subscribe-email');
        var emailError = $('#email-error');
        var submitBtn = form.querySelector('button[type="submit"]');
        var submitLabel = submitBtn ? submitBtn.innerHTML : '';

        function setStatus(message, ok) {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.className = 'form__status' + (message ? (ok ? ' is-ok' : ' is-error') : '');
        }

        function validate() {
            var valid = true;
            var email = emailInput.value.trim();
            var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (emailError) emailError.textContent = '';
            emailInput.removeAttribute('aria-invalid');

            if (!pattern.test(email)) {
                if (emailError) emailError.textContent = t('subscribe.invalidEmail');
                emailInput.setAttribute('aria-invalid', 'true');
                valid = false;
            }

            var consent = form.querySelector('input[name="privacy"]');
            if (consent && !consent.checked) {
                setStatus(t('subscribe.consentRequired'), false);
                valid = false;
            }

            return valid;
        }

        emailInput.addEventListener('input', function () {
            if (emailInput.getAttribute('aria-invalid') === 'true' && emailError) {
                emailError.textContent = '';
                emailInput.removeAttribute('aria-invalid');
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate()) return;

            var oldLabel = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = t('subscribe.sending');
            }
            setStatus('', true);

            var data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                form.reset();
                setStatus(t('subscribe.success'), true);
                toast(t('subscribe.success'), 'ok');
            }).catch(function () {
                setStatus(t('subscribe.error'), false);
                toast(t('subscribe.error'), 'error');
            }).then(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = oldLabel || submitLabel;
                }
            });
        });
    }

    /* ======================================================================
       12. Почта, «поделиться», год
       ====================================================================== */
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            try {
                var area = document.createElement('textarea');
                area.value = text;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.top = '-1000px';
                document.body.appendChild(area);
                area.select();
                var ok = document.execCommand('copy');
                document.body.removeChild(area);
                ok ? resolve() : reject(new Error('copy failed'));
            } catch (err) {
                reject(err);
            }
        });
    }

    function initClipboard() {
        var btn = $('#copy-email');
        if (btn) {
            btn.addEventListener('click', function () {
                copyText(EMAIL).then(function () {
                    toast(t('toast.copied'), 'ok');
                }).catch(function () {
                    toast(t('toast.copyError'), 'error');
                });
            });
        }

        var share = $('#share-btn');
        if (share) {
            share.addEventListener('click', function () {
                var payload = { title: document.title, text: t('meta.description'), url: window.location.href };
                if (navigator.share) {
                    navigator.share(payload).catch(function () { /* пользователь отменил */ });
                } else {
                    copyText(window.location.href).then(function () {
                        toast(t('toast.shared'), 'ok');
                    }).catch(function () {
                        toast(t('toast.shareError'), 'error');
                    });
                }
            });
        }
    }

    function initYear() {
        var year = $('#year');
        if (year) year.textContent = String(new Date().getFullYear());
    }

    /* ======================================================================
       13. Пасхалка: гусь
       ====================================================================== */
    function initGoose() {
        var card = $('#goose-card');
        var bubble = $('#goose-bubble');
        var counter = $('#quack-count');
        if (!card) return;

        var quacks = parseInt(localStorage.getItem(STORAGE.quacks), 10) || 0;
        if (counter) counter.textContent = String(quacks);

        var words = ['Га!', 'Га-га!', 'Га?', 'ГА!', 'Га-га-га!'];

        function quack() {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                try {
                    var ctx = quack.ctx || (quack.ctx = new AudioCtx());
                    if (ctx.state === 'suspended') ctx.resume();
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    var now = ctx.currentTime;
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(420, now);
                    osc.frequency.exponentialRampToValueAtTime(170, now + 0.16);
                    gain.gain.setValueAtTime(0.0001, now);
                    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
                    osc.connect(gain).connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.22);
                } catch (err) { /* аудио может быть недоступно */ }
            }

            card.classList.remove('is-quacking');
            void card.offsetWidth;
            card.classList.add('is-quacking');
            setTimeout(function () { card.classList.remove('is-quacking'); }, 1100);

            if (bubble) {
                bubble.textContent = words[Math.floor(Math.random() * words.length)];
                bubble.classList.add('is-visible');
                clearTimeout(quack.timer);
                quack.timer = setTimeout(function () { bubble.classList.remove('is-visible'); }, 1000);
            }

            quacks += 1;
            localStorage.setItem(STORAGE.quacks, String(quacks));
            if (counter) counter.textContent = String(quacks);

            if (quacks % 10 === 0) {
                party();
                toast(t('toast.quackAchievement'), 'ok');
            }
        }

        card.addEventListener('click', quack);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                quack();
            }
        });
    }

    function party() {
        var emojis = ['🦆', '🦆', '🥚', '✨', '🎉'];
        for (var i = 0; i < 16; i++) {
            var span = document.createElement('span');
            span.className = 'party-goose';
            span.textContent = emojis[i % emojis.length];
            span.style.left = Math.random() * 100 + 'vw';
            span.style.animationDelay = Math.random() * 0.8 + 's';
            span.style.fontSize = 1.2 + Math.random() * 1.8 + 'rem';
            document.body.appendChild(span);
            setTimeout(function (node) {
                return function () { node.remove(); };
            }(span), 4200);
        }
    }

    /* ======================================================================
       14. PWA
       ====================================================================== */
    function initServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').catch(function () { /* офлайн-режим просто не включится */ });
        });
    }

    /* ======================================================================
       15. Старт
       ====================================================================== */
    function init() {
        initTheme();
        initLanguage();
        initMenu();
        initScrollUi();
        initScrollSpy();
        initReveal();
        initProjects();
        initModal();
        initNotify();
        initForm();
        initClipboard();
        initYear();
        initGoose();
        initServiceWorker();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
