"use strict";

const { resolve } = require("path");

module.exports = {
	entry: ["./client/index.js"],
	output: {
		path: __dirname,
		filename: "./public/bundle.js",
	},
	mode: "development",
	context: __dirname,
	devtool: "source-map",
	resolve: {
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /jsx?$/,
				loader: "babel-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
					{
						loader: "url-loader",
						options: {
							limit: 8192,
						},
					},
				],
			},
		],
	},
};
