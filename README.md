## 功能说明
在uniapp小程序中实现全局组件的插件，支持：
1. 自动实现全局引入组件
2. 根据调用方法按需引入组件
3. 支持webpack/vite配置

## 使用说明
需要先在uniapp的components中，创建组件；我们创建组件`base-confirm`和`base-loading`
### 在webpack中使用

添加`npm`包

```bash
npm install @uniapp-global-component/webpack -D
```

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
            // 使用HBuilder构建的项目
            // loader: path.resolve(__dirname,'./node_modules/@uniapp-global-component/webpack'),
            // 使用cli构建的项目
            loader: "@uniapp-global-component/webpack",
            options: {
              // HBuilder构建项目，默认地址
              // pagesPath: path.resolve(__dirname,'.'),
              // cli构建项目，默认地址
              pagesPath: path.resolve(__dirname,'./src'),
              // rewrite: "uni.$global", // 默认$refs
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

添加`npm`包

```bash
npm install @uniapp-global-component/vite -D
```

在`vite.config.js`文件中配置

```js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import globalComponent from '@uniapp-global-component/vite'
import path from 'path'
export default defineConfig({
  plugins: [
    globalComponent({
      // HBuilder构建项目，默认地址
      // pagesPath: path.resolve(__dirname,'.'),
      // cli构建项目，默认地址
      pagesPath: path.resolve(__dirname,'./src'),
      // rewrite: "uni.$global", // 默认$refs
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
### 配置说明

#### pagesPath

定义`pages.json`文件所在目录地址，插件会从`pages.json`中获取页面路径，然后只在页面文件上添加全局组件

### components

`code`定义插入的组件代码，`global`为`true`时，表示组件代码全局插入，为`false`时会根据调用方法引入

### rewrite

重写调用方法。

在组件为根据调用方法引入时，默认会在代码中查找`$refs.{name}`，根据name与组件代码的ref名称匹配，然后在页面中插入组件代码；

rewrite重新调用的代码，如设置为`uni.$global`，插件就会去查找`uni.$global.{name}`，然后配置组件代码，而不再是`$refs.{name}`。

这个配置项可以实现在页面外调用全局组件，在`main.js`中定义：
```js
uni.$global = {
  confirm: function (options) {
    // 在这里，你可以添加你自己的代码，例如修改options或者添加新的行为
    console.log("showToast", options);
    // eslint-disable-next-line no-undef
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    page.$vm.$refs.confirm.show({
      message: "提示",
      vertical: "bottom",
    });
  },
};
```
在非页面文件中，就可以操作全局组件了；但是**在非页面文件中调用，不会被插件检测到，不会引入按需组件**。