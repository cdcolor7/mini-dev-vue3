export default {
  lang: 'en-US',
  title: 'mini-dev-vue3 源码学习',
  description: '深入学习vue3源代码，基于TypeScript语言开发、Lerna + Monorepo多包管理实现一个mini版的vue3框架',

  themeConfig: {
    // repo: 'vuejs/vitepress',
    // docsDir: 'docs',

    // editLinks: true,
    // editLinkText: 'Edit this page on GitHub',
    // lastUpdated: 'Last Updated',

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // carbonAds: {
    //   carbon: 'CEBDT27Y',
    //   custom: 'CKYD62QM',
    //   placement: 'vuejsorg'
    // },

    nav: [
      { text: 'Vue3', link: '/vue3/index', activeMatch: '^/$|^/vue3/' },
      {
        text: 'Monorepo',
        link: '/lerna/info',
        activeMatch: '^/lerna/'
      },
      {
        text: 'Rollup',
        link: '/rollup/info',
        activeMatch: '^/rollup/'
      },
      {
        text: 'Gitee',
        link: 'https://gitee.com/yiyi520/mini-dev-vue3'
      }
    ],

    sidebar: {
      '/vue3/': getGuideSidebar(),
      '/lerna/': getLernaSidebar(),
      '/rollup/': getConfigSidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: '准备工作',
      children: [
        { text: '开篇词', link: '/vue3/index' },
        { text: '目录结构', link: '/vue3/prepare/catalogue' },
        { text: '源码构建', link: '/vue3/prepare/build' },
        { text: 'Vue3入口', link: '/vue3/prepare/entrance' },
      ]
    },
    {
      text: 'Compiler-Core',
      children: [
        { text: 'Introduction', link: '/vue3/compiler/core-index' },
      ]
    },
    {
      text: 'Compiler-Dom',
      children: [
        { text: 'Introduction', link: '/vue3/compiler/dom-index' },
      ]
    },
    {
      text: 'Reactivity',
      children: [
        { text: 'Introduction', link: '/vue3/reactivity/index' },
      ]
    },
    {
      text: 'Runtime-Core',
      children: [
        { text: 'Introduction', link: '/vue3/runtime/core-index' },
      ]
    },
    {
      text: 'Runtime-Dom',
      children: [
        { text: 'Introduction', link: '/vue3/runtime/dom-index' },
      ]
    }
  ]
}

function getLernaSidebar() {
  return [
    {
      text: 'Monorepo',
      children: [
        { text: 'lerna', link: '/lerna/info' },
        { text: 'pnpm', link: '/lerna/pnmp' },
        { text: '版本号管理', link: '/lerna/version' }
      ]
    }
  ]
}

function getConfigSidebar() {
  return [
    {
      text: 'Rollup',
      children: [
        { text: '基本使用', link: '/rollup/info' },
        { text: 'tsconfig配置详解', link: '/rollup/tsconfig' },
      ]
    }
  ]
}
