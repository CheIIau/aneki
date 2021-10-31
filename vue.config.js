/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
// module.exports = {
//   transpileDependencies: ["vuetify"],
// };
// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
    compression: {
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
  // configureWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'production') {
  //     return {
  //       plugins: [
  //         new CompressionPlugin({
  //           test: / \. js $ | \ .html $ |. \ css /, // соответствие имени файла
  //           threshold: 10240, // Сжать данные более 10k
  //           deleteOriginalAssets: false, // Не удалять исходные файлы
  //         }),
  //       ],
  //     };
  //   }
  // },
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.optimization.minimize(true);
    config.plugin('VuetifyLoaderPlugin').tap(() => [
      {
        match(originalTag, { kebabTag, camelTag }) {
          if (kebabTag.startsWith('core-')) {
            return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`];
          }
        },
      },
    ]);
  },
};
