if (process.env.NODE_ENV !== 'production') require('dotenv').load();

const webpack = require('webpack');
const plugins =  [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  }),
];

module.exports = {
  entry: './src/index.ts',
  output: { filename: './public/bundle.js' },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts'],
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.glsl$/,
        loader: 'raw-loader',
      },
      {
        test: /\.glsl$/,
        loader: 'glslify-loader',
      },
    ],
  },
  plugins,
};
