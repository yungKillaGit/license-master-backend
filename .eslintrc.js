const { configure, presets } = require('eslint-kit');

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',

  presets: [
    presets.imports(),
    presets.node(),
    presets.prettier({
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      quoteProps: 'consistent',
      trailingComma: 'es5',
      printWidth: 140,
    }),
    presets.typescript(),
  ],
});
