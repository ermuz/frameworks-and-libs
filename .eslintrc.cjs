module.exports = {
	env: {
		es6: true, // 支持并启用es6语法
		node: true, // 支持node语法及变量
		browser: true // 支持浏览器全局变量
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		quotes: ['error', 'single'],
		semi: ['error', 'always']
	}
};
