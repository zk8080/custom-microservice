/*
 * @Author: your name
 * @Date: 2020-05-28 14:47:01
 * @LastEditTime: 2020-05-28 16:12:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/utils/handleAssets.ts
 */ 
import { getMicroData, setMicroData } from './data';
import {MANIFEST_PREFIX} from './constant';

interface Appended {
    styleId: string,
    styleSrc: string,
    scriptId: string,
    scriptSrc: string
}

/**
 * 根据microId和appName查找静态manifest
 * @param {string} microId
 * @param {string} appName
*/
export const getManifest = (microId: string, appName: string): Object | undefined => {
    const manifests: Object | undefined = getMicroData(microId, MANIFEST_PREFIX);
    if(manifests){
        return manifests[appName]
    }
}

/**
 * 缓存manifest
 * @param {string} microId
 * @param {string} appName
 * @param {Object} manifest
*/

export const cacheManifest = (microId: string, appName: string, manifest: Object): void => {
    const manifests: Object | undefined = getMicroData(microId, MANIFEST_PREFIX);
    if(!manifests){
        setMicroData(microId, MANIFEST_PREFIX, {
            [appName]: manifest
        })
        return;
    }
    manifests[appName] = manifest;
}

/**
 * 生成appName
 * @param {string} path
*/
export const generateAppName = (path: string): string => path.replace('/', '$');

/**
 * 获取manifest文件具体内容
 * @param {string} host 子应用域名
*/
export const fetchManifest = async (host: string): Promise<Object> => {
    let manifest: Object;
    const now: number = Date.now();
    try{
        const fetchUrl: string = `${host}/asset-manifest.json?${now}`;
        const res: Response = await fetch(fetchUrl);
        manifest = await res.json();
    }
    catch(e){
        console.log('获取manifest文件内容异常', e);
    }
    return manifest;
}

/**
 * 创建script标签和link标签 加载静态资源
 * @param {Object} Appended style节点和script节点内容
*/
export const appendStylesAndScripts = ({ styleId, styleSrc, scriptId, scriptSrc }: Appended): Promise<void> => {
    return new Promise(resolve => {
        // 创建style节点
        let style: HTMLElement = document.createElement('link');
        style = Object.assign(style, {
            id: styleId,
            rel: 'stylesheet',
            type: 'text/css',
            href: styleSrc
        });

        // 创建script节点
        let script: HTMLElement = document.createElement('script');
        script = Object.assign(script, {
            id: scriptId,
            src: scriptSrc,
            defer: 'defer',
            onload: () => {
                resolve()
            }
        });

        // 插入节点
        const fragment: DocumentFragment = document.createDocumentFragment();
        fragment.appendChild(style);
        fragment.appendChild(script);
        document.head.appendChild(fragment);
    })
}

/**
 * 删除当前节点
 * @param {HTMLElement} node
*/
const removeSelf = (node: HTMLElement | undefined): void => {
    node && node.parentNode.removeChild(node);
}

/**
 * 删除加载的静态资源节点
 * @param {string} host 子应用域名
 * @param {string} scriptId
 * @param {string} styleId
*/
export const removeStylesAndScripts = (host: string, scriptId: string, styleId: string): void => {
    // 清除子应用资源
    removeSelf(document.getElementById(scriptId));
    removeSelf(document.getElementById(styleId));
    // 删除所有和子应用有关的script标签和css标签
    try{
        // 删除script
        Array.from(document.head.getElementsByTagName('script')).forEach(el => {
            const attr: Attr | null = el.attributes.getNamedItem('src');
            if(attr && attr.value.startsWith(host)) {
                removeSelf(el);
            }
        })
        // 删除css
        Array.from(document.head.getElementsByTagName('link')).forEach(el => {
            const attr: Attr | null = el.attributes.getNamedItem('href');
            if(attr && attr.value.startsWith(host)) {
                removeSelf(el);
            }
        })
    }
    catch(e){
        console.log('移除页面资源异常', e)
    }
}
