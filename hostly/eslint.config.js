import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  // Configuração Principal (para todos os arquivos)
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReactConfig.plugins.react,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": "warn",
      "no-unused-vars": ["warn", { args: "none" }],
    },
  },

  // =======================================================
  // <<< BLOCO NOVO ADICIONADO AQUI >>>
  // Exceção para o AuthContext
  // =======================================================
  {
    files: ["src/context/AuthContext.jsx"],
    rules: {
      // Desativa a regra que causa o aviso amarelo apenas para este arquivo
      "react-refresh/only-export-components": "off",
    },
  },

  // Configuração de arquivos a ignorar
  {
    ignores: ["dist/**"],
  },
];
