const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './main.js',
   output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js',
   },
   devServer: {
      inline: true,
	  contentBase: path.join(__dirname, 'public'),
      compress: true,
      port: 9000,
		setup(app) {
			//app.get('/bundle.js', (req, res) => {
			//	  res.sendFile(path.resolve(__dirname, 'dist/bundle.js'));
			//});
			app.get('/.dashboard_data', (req, res) => {
			  res.sendFile(path.resolve(__dirname, 'public/dashboard_data'));
			});
     }
   },
   module: {
      rules: [
		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
            }
        },
		{
			test: /\.css$/,
			exclude: /node_modules/,
			use: [
			    'style-loader',
					{
						loader: 'css-loader',
						options: {
						importLoaders: 1,
						modules: true
					}
				}
			]
		}
	]
	}
}
