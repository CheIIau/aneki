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
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Aneki';
      return args;
    });
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
