import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  astro: true,
  formatters: {
    astro: true,
    css: true,
  },
  markdown: false,
}, {
  rules: {
    'astro/missing-client-only-directive-value': 'off',
  },
})
