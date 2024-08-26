const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    login: "./src/login.ts",
    game: "./src/game.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },      
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(mp3|wav|ogg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "assets/sounds/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/login.html", // Caminho para o template HTML do login
      filename: "login.html", // Nome do arquivo gerado na pasta /dist
      chunks: ["login"], // Inclui o bundle do login
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Caminho para o template HTML do jogo
      filename: "index.html", // Nome do arquivo gerado na pasta /dist
      chunks: ["game"], // Inclui o bundle do jogo
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets/sounds", to: "assets/sounds" }, // Copia os sons para o diretório de saída
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },mode: 'development'
};
