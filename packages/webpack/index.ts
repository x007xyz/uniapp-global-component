import { generateNewContent, getAllPagesMap, getRoute, isWx, parseComponentOptions, readPagesJSON, getMatchedComponents } from "@uniapp-global-component/core"
import path from "path"

// 是否初始化过
let _init = false

let componentOptions: ComponentOption[] = []

let pagesMap: PagesMap

function initOptions(options: LoaderOptions): LoaderOptions {
  return {
    pagesPath: path.resolve(__dirname,'./src'),
    rewrite: '$refs',
    ...options
  }
}

export default function (content: string): string {
  if (!isWx()) {
    return content;
  }

  const options = initOptions(this.query)

  if (!_init) {
    _init = true
    // 获取所有页面
    pagesMap = getAllPagesMap(readPagesJSON(options.pagesPath));
    // 初始化解析配置，解析页面路由
    componentOptions = parseComponentOptions(options.components)
  }
  
  // 获取当前文件的小程序路由
  const route = getRoute(this.resourcePath);
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