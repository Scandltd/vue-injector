module.exports = {
  locales: {
    '/': {
      lang: 'en',
      title: 'Vue Injector',
      description: 'Dependancy injection for Vue.js.'
    },
    '/ru/': {
      lang: 'ru',
      title: 'Vue Injector',
      description: 'Dependancy injection for Vue.js.'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-icon-152x152.png` }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'Scandltd/vue-injector',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Translations',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API',
            link: '/api/'
          },
          {
            text: 'Change history',
            link: 'https://github.com/Scandltd/vue-injector/releases'
          }
        ],
        sidebar: [
          '/installation.md',
          '/',
          {
            title: 'Guide',
            collapsable: false,
            children: [
              '/guide/',
              '/guide/essentials/reg-service.md',
              '/guide/essentials/get-service.md',
              '/guide/essentials/vue.md',
              '/guide/essentials/vuex.md',
              '/guide/essentials/nuxt.md'
            ]
          }
        ]
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Переводы',
        editLinkText: 'Изменить эту страницу на GitHub',
        nav: [
          {
            text: 'Руководство',
            link: '/ru/guide/'
          },
          {
            text: 'Справочник APIe',
            link: '/ru/api/'
          },
          {
            text: 'История изменений',
            link: 'https://github.com/Scandltd/vue-injector/releases'
          }
        ],
        sidebar: [
          '/ru/installation.md',
          '/ru/',
          {
            title: 'Основы',
            collapsable: false,
            children: [
              '/ru/guide/',
              '/ru/guide/essentials/reg-service.md',
              '/ru/guide/essentials/get-service.md',
              '/ru/guide/essentials/vue.md',
              '/ru/guide/essentials/vuex.md',
              '/ru/guide/essentials/nuxt.md'
            ]
          }
        ]
      }
    }
  }
}
