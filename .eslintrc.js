module.exports = {
	extends: "erb",
	plugins: ["@typescript-eslint"],
	rules: {
		// A temporary hack related to IDE not resolving correct package.json
		"import/no-extraneous-dependencies": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": "off",
		"import/extensions": "off",
		"import/no-unresolved": "off",
		"import/no-import-module-exports": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": "error",
		"no-unused-vars": "warn",
		"@typescript-eslint/no-unused-vars": "warn",
		"no-console": "off",
		"no-await-in-loop": "off",
		"one-var": "off",
		"react/jsx-props-no-spreading": "off",
		"react/function-component-definition": "off",
		"react/prop-types": "off",
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
	settings: {
		"import/resolver": {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node: {},
			webpack: {
				config: require.resolve("./.erb/configs/webpack.config.eslint.ts"),
			},
			typescript: {},
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
};
