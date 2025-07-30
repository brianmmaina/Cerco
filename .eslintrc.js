module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
        presets: ['module:metro-react-native-babel-preset'],
        },
    },
    env: {
        'react-native/react-native': true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'prettier',
    ],
    plugins: ['react', 'react-native'],
    settings: { react: { version: 'detect' } },
    rules: {
        'react-native/no-inline-styles': 'warn',
        'react/display-name': 'off',
        // we can add more project-specific rules here
    },
};
