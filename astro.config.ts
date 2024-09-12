import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import UnoCSS from 'unocss/astro'
import vue from '@astrojs/vue'
import remarkDirective from 'remark-directive'
import { remarkAsides } from './src/remark-plugins/remark-asides.js'

export default defineConfig({
  site: 'https://jzllove9.github.io',
  server: {
    port: 1977,
  },
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({
      injectReset: true,
    }),
    vue(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      wrap: true,
    },
    remarkPlugins: [remarkDirective, remarkAsides({})],
  },
})
