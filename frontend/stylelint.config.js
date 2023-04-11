module.exports = {
  defaultSeverity: 'error',
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-scss'],
  rules: {
    // 兼容bem命名
    'selector-class-pattern': '^[-_a-zA-Z0-9]*$',
    'color-function-notation': 'modern',
    'string-quotes': 'single',
    'rule-empty-line-before': [
      'always',
      {
        except: ['inside-block'],
      },
    ],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
  },
};
