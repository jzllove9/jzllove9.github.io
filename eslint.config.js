import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  astro: true,
  formatters: {
    astro: true,
    css: true,
  },
}, {
  rules: {
    'astro/missing-client-only-directive-value': 'off',
  },
})
