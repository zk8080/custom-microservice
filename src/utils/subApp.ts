/*
 * @Author: your name
 * @Date: 2020-05-28 09:34:31
 * @LastEditTime: 2020-05-28 16:28:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/utils/subApp.ts
 */ 
import { History } from 'history';
import { getGlobalData, getMicroData, setMicroData } from './data';
import { APP_MOUNT_NODE, APP_ENTER_PREFIX, APP_LEAVE_PREFIX, APP_PATH, APP_BASENAME, MICRO_CONFIG_PREFIX } from './constant';
import { checkConfig, MicroConfig } from './mainApp';

interface SubAppFuncs {
    getPath: () => string,
    isInMicro: () => boolean,
    getMountNode: () => HTMLDivElement | never,
    registerAppEnter: (callback: (history: History) => void) => void | never,
    registerAppLeave: (callback: () => void) => void | never,
    getBasename: () => string
}

/**
 * 获取子应用被分配的微前端路径
 * @param {string} microId 从属的主应用id，若应用中不存在子应用嵌套，则不传microId，否则需要穿microId
 * @returns {string}
*/

export const getPath = (microId: string = '001'): string => {
    return getMicroData(microId, APP_PATH) || '';
}

/**
 * 获取子应用的basename
 * @returns {string}
*/
export const getBasename = (): string => {
    return getGlobalData(APP_BASENAME) || '/';
}

/**
 * 当前应用是否运行在微前端环境中
 * @param {string} microId 从属的主应用id，若应用中不存在子应用嵌套，则不传microId，否则需要穿microId
 * @returns {boolean}
*/

export const isInMicro = (microId: string): boolean => {
    return !!getMicroData(microId, APP_MOUNT_NODE);
}

/**
 * 获取子应用在微前端环境中的渲染节点
 * @param {string} microId 从属的主应用id，若应用中不存在子应用嵌套，则不传microId，否则需要穿microId
 * @returns {HTMLDivElement}
*/
export const getMountNode = (microId: string): HTMLDivElement | never => {
    const mountNode: HTMLDivElement | undefined = getMicroData(microId, APP_MOUNT_NODE);
    if(mountNode){
        return mountNode;
    }
    throw new Error('Micro page do not provide node to render son app')
}

/**
 * 注册当前应用加载前的回调
 * @param {function} callback 回调函数
 * @param {string} microId 从属的主应用id，若应用中不存在子应用嵌套，则不传microId，否则需要穿microId
*/

export const registerAppEnter = (callback: (history: History) => void, microId: string = '001'): void | never => {
    if(!callback && !microId) {
        return;
    }

    if(typeof callback !== 'function') {
        throw new Error('registerAppEnter must be function')
    }

    setMicroData(microId, APP_ENTER_PREFIX, callback)
}


/**
 * 注册当前应用卸载前的回调函数
 * @param {function} callback 回调函数
 * @param {string} microId 从属的主应用id，若应用中不存在子应用嵌套，则不传microId，否则需要穿microId
*/
export const registerAppLeave = (callback: () => void, microId: string = '001'): void | never => {
    if(!callback && !microId) {
        return;
    }

    if(typeof callback !== 'function') {
        throw new Error('registerAppLeave must be function')
    }

    setMicroData(microId, APP_LEAVE_PREFIX, callback)
}

/**
 * 查找从属应用microId，根据传入的MicroConfig和需要需要匹配的microId
 * @param {object} microconfig 微服务配置json
 * @param {string} microId 需要匹配的子应用microId
 * @returns {string} microId 从属应用microId
*/
const getMicroId = ({id, children}: MicroConfig, microId: string): string | undefined => {
    if(Array.isArray(children)){
        for (let i = 0; i < children.length; i++) {
            if(children[i].id === microId){
                return id;
            }else{
                const id: string | undefined = getMicroId(children[i], microId);
                if(id) {
                    return id;
                }
            }
            
        }
    }
}

/**
 * 传入当前应用id 获取从属应用id
 * @param {string} microId 当前应用id
 * @returns {string} 从属应用id
 */
export const getParentId = (microId: string): string | undefined => {
    const config: MicroConfig | undefined = getGlobalData(MICRO_CONFIG_PREFIX);
    if(config && checkConfig(config)){
        return getMicroId(config, microId);
    }
}

/**
 * 根据传入的从属应用id 获取对应子应用的接入函数
 * @param {string} microId 父应用id
 * @returns {object} 返回SubAppFuncs接口类型
*/
const getFuncsByParentId = (microId: string): SubAppFuncs => ({
    getPath: () => getPath(microId),
    isInMicro: () => isInMicro(microId),
    getMountNode: () => getMountNode(microId),
    registerAppEnter: (callback) => registerAppEnter(callback, microId),
    registerAppLeave: (callback) => registerAppLeave(callback, microId),
    getBasename: () => getBasename()
})


/**
 * 在多级应用中 获取子应用的接入函数（在子应用中使用）
 * @param {string} microId 当前应用的microId
 * @returns {objtec} 返回SubAppFuncs接口类型
*/

export const getSubAppFuncs = (microId: string = '001'): SubAppFuncs => {
    const parentId = getParentId(microId);
    return getFuncsByParentId(parentId);
}
