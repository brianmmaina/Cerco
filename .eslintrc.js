// .eslintrc.js
module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
        presets: ['module:metro-react-native-babel-preset'],
        },
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        'react-native/react-native': true,
    },
    plugins: ['react', 'react-native'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'prettier',
    ],
    settings: {
        react: { version: 'detect' },
    },
    rules: {
        // Turn off these overly strict style rules:
        'react-native/sort-styles': 'off',
        'react-native/no-color-literals': 'off',

        // Allow unused vars in handlers for now:
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

        // Other tweaks
        'react-native/no-inline-styles': 'warn',
        'react/prop-types': 'off',
        'no-console': 'off',
    },
};
