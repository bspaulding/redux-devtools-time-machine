module.exports = {
	entry: "./src/index.js",
	output: {
		path: "dist",
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader",
				query: {
					presets: ["react", "stage-0", "es2015"],
					plugins: ["transform-class-properties"]
				}
			},
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
			{ test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
			{ test: /\.gif(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
			{ test: /\.mp4(\?v=\d+\.\d+\.\d+)?$/, loader: "file" }
		]
	}
}
