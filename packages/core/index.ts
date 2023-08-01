import { parse } from 'jsonc-parser'
import * as fs from 'fs'
import * as path from 'path'

// pages.json文件所在目录
const rootPath = process.env.UNI_INPUT_DIR || path.join(process.env.INIT_CWD || '', 'src')

export function isWx(): boolean {
  return process.env.UNI_PLATFORM === 'mp-weixin'
}

export function generateNewContent(content: string, labelCode: string): string {
  const match = content.match(/<template>([\s\S]*)<\/template>/)
  if (match) {
    // 使用正则，在根元素上添加目标组件
    const newTemplate = match[1].replace(/(<[^>]+>)([\s\S]*)(<\/[^>]+>)/, `$1$2${labelCode}$3`)
    // 替换<template>的内容
    const newContent = content.replace(/<template>([\s\S]*)<\/template>/, `<template>${newTemplate}</template>`)
    return newContent
  } else {
    console.log('No <template> found')
    return content
  }
}

/**
 * 读取pages.json文件
 * @param path 
 * @returns 
 */
export function readPagesJSON(pathStr: string = rootPath): PagesJSON {
  const filePath = path.join(pathStr, 'pages.json')
  const pagesJson = parse(fs.readFileSync(filePath, 'utf8'))

  return pagesJson
}

/**
 * 从pages.json文件中获取所有页面
 */
export function getAllPagesMap(pagesJson: PagesJSON): PagesMap {
  const pages = pagesJson.pages || []
  const subpackages = pagesJson.subpackages || pagesJson.subPackages || []

  return pages.reduce(
    (map: PagesMap, item: any) => {
      map.set('/' + item.path, undefined)
      return map
    },
    subpackages.reduce((map: PagesMap, item: any) => {
      // 获取分包路由配置
      const root = item.root
      item.pages.forEach((item: any) => {
        map.set('/' + root + '/' + item.path, undefined)
      })
      return map
    }, new Map())
  )
}

// 根据resourcePath获取路由
export const getRoute = (resourcePath: string): string => resourcePath.replace(rootPath, '').replace('.vue', '').replace(/\\/g, '/')

function getRefAttributes(code: string) {
  const regex = /ref\s*=\s*["']([^"']*)["']/g;
  let match;
  let ref = "";

  while ((match = regex.exec(code)) !== null) {
    ref = match[1];
  }

  return ref;
}

export const parseComponentOptions = (options: ComponentOption[]) => {
  return options.map(option => {
    const ref = getRefAttributes(option.code);
    if (!ref) {
      throw new Error(`Invalid ref attribute: ${option.code}`);
    }
    return {
      code: option.code,
      ref,
      global: option.global,
    }
  })
}
/**
 * 对在正则中使用的字符进行转义
 * @param string 
 * @returns 
 */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const getMatchedComponents = (template: string, componentOptions: ComponentOption[], refStr: string) => {
  return componentOptions.filter(option => {
    if (option.global) {
      return true;
    }
    const regex = new RegExp(`${escapeRegExp(`${refStr}.${option.ref}`)}|${refStr}[${option.ref}]`, 'g');
    return regex.test(template)
  })
}