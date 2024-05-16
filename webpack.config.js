import path from 'path';

export default {
	mode: 'development',
	entry: './src/main.tsx',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		publicPath: './',
	},
	devServer: {
		static: './',
		compress: true,
		host: '0.0.0.0',
		port: 5173,
		devMiddleware: {
			index: true,
			mimeTypes: { phtml: 'text/html' },
			publicPath: './',
			serverSideRender: true,
			writeToDisk: true,
		},
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx$/,
				use: 'ts-loader',
				exclude: [/node_modules/, /D:\\DumpStack.log.tmp/],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};
