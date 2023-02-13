module.exports = {
	extends: ['../../.eslintrc.cjs', 'plugin:react/recommended'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		'react/react-in-jsx-scope': 'off'
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
