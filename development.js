import path from "path";
const src = path.resolve(__dirname, "src");
const docs = path.resolve(__dirname, "docs");

export default {
  entry: [src + "/main.jsx"],
  output: {
    path: docs,
    filename: "[name].bundle.js"
  },
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    contentBase: docs,
    disableHostCheck: true
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(css|scss$)/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(ttf|svg|otf|jpg|png)$/,
        loader: "url-loader"
      },
      {
        test: /\.glsl$/,
        loader: "glsl-loader"
      },
      {
        test:/\.json$/,
        loader:"json-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  }
};
