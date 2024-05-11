module.exports = {
  root: true,
  extends: ['devextreme/spell-check'],
  overrides: [{
    files: ['*.ts', '*.tsx'],
    extends: ['devextreme/react'],
    env: {
      browser: true,
      es6: true
    },
    rules: {
      "space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }]
    },
    parserOptions: {
      project: './tsconfig.json',
      'createDefaultProgram': true,
      'ecmaVersion': 8,
    },
    globals: {
      System: false,
      AmazonGateway: false,
      AmazonFileSystem: false,
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        'pragma': 'React',
        version: '16.2',
        flowVersion: '0.53',
      },
      propWrapperFunctions: [
        'forbidExtraProps',
      ],
    },
  }, {
    files: ['*.test.tsx'],
    extends: ['devextreme/jest']
  }]
};
