module.exports = {
    root: true,
    extends: ['universe/native', 'plugin:@tanstack/eslint-plugin-query/recommended'],
    plugins: ['prettier'],
    rules: {
        indent: ['error', 'tab'],
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'react/react-in-jsx-scope': 'off',
        'no-empty-function': 'off',
        'prettier/prettier': [1],
        'no-empty-pattern': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
        'react-hooks/rules-of-hooks': 'error',
    },
};
