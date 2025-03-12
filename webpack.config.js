module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/, // Applique cette règle aux fichiers CSS
          use: ['style-loader', 'css-loader'], // Utilise ces loaders pour traiter les fichiers CSS
        },
      ],
    },
  };