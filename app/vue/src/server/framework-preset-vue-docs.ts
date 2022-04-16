import { Options, StorybookConfig } from '@storybook/core-common';
import { hasDocsOrControls } from '@storybook/docs-tools';

export function webpackFinal(webpackConfig: any = {}, options: Options) {
  if (!hasDocsOrControls(options)) return webpackConfig;

  let vueDocgenOptions = {};

  options.presetsList?.forEach((preset) => {
    if (preset.name.includes('addon-docs') && preset.options.vueDocgenOptions) {
      const appendableOptions = preset.options.vueDocgenOptions;
      vueDocgenOptions = {
        ...vueDocgenOptions,
        ...appendableOptions,
      };
    }
  });

  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-docgen-loader', { paths: [require.resolve('@storybook/vue')] }),
    enforce: 'post',
    options: {
      docgenOptions: {
        alias: webpackConfig.resolve.alias,
        ...vueDocgenOptions,
      },
    },
  });
  return webpackConfig;
}

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('@storybook/renderer-vue/dist/esm/docs/config')];
};
