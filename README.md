## 使用说明
uniapp小程序全局组件插件，自动全局引入组件，根据`$refs`调用方法按需引入组件，支持webpack/vite配置
### 在webpack中使用

在`config.vue.js`文件中配置

```js
const path = require('path');

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: "@uniapp-global-component/webpack",
            options: {
              pagesPath: path.resolve(__dirname,'./src'),
              rewrite: "uni.$global", // 默认$refs
              components: [{
                code: `<base-confirm ref='confirm'></base-confirm>`,
                global: true
              }, {
                code: `<base-loading ref='loading'></base-loading>`,
                global: false
              }]
            }
          },
        },
      ],
    },
  },
};
```
### 在vite项目中使用

在`vite.config.js`文件中配置

```js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import globalComponent from '@uniapp-global-component/vite'
import path from 'path'
export default defineConfig({
  plugins: [
    globalComponent({
      pagesPath: path.resolve(__dirname,'./src'),
      rewrite: "uni.$global", // 默认$refs
      components: [{
        code: `<base-confirm ref='confirm'></base-confirm>`,
        global: true
      }, {
        code: `<base-loading ref='loading'></base-loading>`,
        global: false
      }]
    }),
    uni()
  ],
})
```