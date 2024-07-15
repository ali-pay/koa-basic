import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
  },
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'unused-imports/no-unused-vars': 'warn',
    },
  },
)
