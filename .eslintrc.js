const resolve = require('path').resolve;

module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "@nuxtjs",
    "plugin:nuxt/recommended",
    "airbnb-base"
  ],
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "rules": {
    "no-shadow": [
      "error",
      {
        "allow": [
          "state"
        ]
      }
    ],
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "Vue"
        ]
      }
    ],
    "no-debugger": [
      "warn"
    ],
    "vue/no-v-html": "off"
  },
  "overrides": [
    {
      "files": [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      "env": {
        "jest": true
      }
    }
  ],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": {
          "resolve": {
            "alias": {
              "@": __dirname,
            }
          }
        }
      }
    }
  }
};
