module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true,
        "jest": true
    },
    "extends": [
        "@react-native-community",
        "plugin:react/recommended",
        "prettier",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "react-native",
        "react-hooks"
    ],
    "overrides": [
        {
          files: ['*.ts', '*.tsx'],
          rules: {
            '@typescript-eslint/no-shadow': ['error'],
            'no-shadow': 'off',
            'no-undef': 'off',
            'import/prefer-default-export': 'off',
            'react/no-unescaped-entities': 'off',
            'max-len': ['error', { code: 120 }],
            "react-native/no-inline-styles": "error",
            "react-hooks/rules-of-hooks": "off",
            "react/prop-types": "off"
          },
        },
     ],
    "globals": {
        "__DEV__": true
    },
    "settings": {
        "react": {
          "version": "detect"
        }
    }
}