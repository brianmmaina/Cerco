// functions/.eslintrc.js
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        node: true,
        es2020: true,
    },
    extends: ["eslint:recommended"],
    rules: {
        // any function-specific rule overrides
    },
};
