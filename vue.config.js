// module.exports = {
//   transpileDependencies: ["vuetify"],
// };
module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  chainWebpack: (config) => {
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
