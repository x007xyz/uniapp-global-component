import { generateNewContent, getAllPagesMap, getMatchedComponents, getRoute, isWx, parseComponentOptions, readPagesJSON } from "@uniapp-global-component/core"

import path from "path"

function initOptions(options: LoaderOptions): LoaderOptions {
  return {
    pagesPath: path.resolve(__dirname,'./src'),
    rewrite: '$refs',
    ...options
  }
}

export default function (config: LoaderOptions) {
  let _init = false;

  let componentOptions: ComponentOption[] = []

  let pagesMap: PagesMap
  return {
    name: '@uniapp-global-component/vite',
    transform(content: string, id: string) {
      if (id.endsWith('.vue')) {
        if (!isWx()) {
          return content;
        }

        const options = initOptions(config)
      
        if (!_init) {
          _init = true
          // 获取所有页面
          pagesMap = getAllPagesMap(readPagesJSON(options.pagesPath));
          // 初始化解析配置，解析页面路由
          componentOptions = parseComponentOptions(options.components)
        }
        
        // 获取当前文件的小程序路由
        const route = getRoute(id);
        if (pagesMap.has(route)) {
          // 如果页面没有解析过，则解析页面；页面修改不更新
          // if (!pagesMap.get(route)) {
          //   pagesMap.set(route, getMatchedComponents(content, componentOptions))
          // }
      
          pagesMap.set(route, getMatchedComponents(content, componentOptions, options.rewrite))
        
          let componentCodeArray = pagesMap.get(route)
          if (componentCodeArray.length === 0) {
            return content;
          }
          return generateNewContent(content, componentCodeArray.map(option => option.code).join(''));
        }
        return content;
      }
    }
  }
}