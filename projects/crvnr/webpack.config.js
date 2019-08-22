const path = require("path");

module.exports = {
	entry: {
		"Game": "./src/js/game/Game.js"
	},
	output: {
		path: path.resolve(__dirname + "/public/js")
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"]
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			},
			{
				test: /\.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: "file-loader",
						options: { outputPath: "../images/" }
					}
				]
			},
			{
				test: /jquery.*.js/,
				use: [
					{
						loader: "expose-loader",
						options: "jQuery"
					},
					{
						loader: "expose-loader",
						options: "$"
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS, using Node Sass by default
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "../fonts/",
							publicPath: "/fonts/" // Take the directory into account
						}
					}
				]
			}
		]
	},
	plugins: []
};
