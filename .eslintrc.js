module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
        },
        ecmaVersion: 'latest',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: { 'no-console': 'off', 'no-useless-catch': 'off' },
    settings: {
        'import/resolver': {
            alias: [['@', './src']],
        },
    },
};
