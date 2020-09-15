import React, {FC, useEffect, useRef, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { generateAppName, getManifest, cacheManifest, fetchManifest, appendStylesAndScripts, removeStylesAndScripts } from './utils/handleAssets';
import { SCRIPT_ID_PREFIX, STYLE_ID_PREFIX, APP_ENTER_PREFIX, APP_LEAVE_PREFIX, APP_MOUNT_NODE, APP_PATH, APP_BASENAME } from './utils/constant';
import { getMicroData, setMicroData } from './utils/data';
import { RouterContext, RouterContextValue, routerData } from './utils/routersData';

interface RenderAppProps {
    microId: string,
    path: string,
    history: History,
    onAppEnter?: (path: string, history: History) => void,
    onAppRouteChange?: (lastApp: string) => void
}

export interface AppLoaderProps {
    host: string,
    path: string
}

/**
 * 渲染子应用
 * @param {Object} RenderAppProps
*/
const renderApp = ({microId, path, history, onAppEnter, onAppRouteChange}: RenderAppProps): void => {
    // 子应用挂载渲染函数
    const handleAppEnter: ((histroy: History) => void) | undefined = getMicroData(microId, APP_ENTER_PREFIX);
    try{
        // 调用主应用的onAppEnter回调函数 (该函数是在主应用中调用 并且在子应用挂载前执行的函数)
        onAppEnter && onAppEnter(path, history);
        // 调用主应用的onRouteChange回调函数
        if(routerData.lastApp && routerData.lastApp !== path){
            onAppRouteChange && onAppRouteChange(routerData.lastApp);
        }
        // 调用子应用挂载渲染函数
        handleAppEnter && handleAppEnter(history)
    }
    catch(e){
        console.log(`渲染${path}页面出错`, e)
    }
}

/**
 * 卸载子应用
 * @param {string} microId
 * @param {string} host
 * @param {string} path
*/
const destroy = (microId: string, host: string, path: string): void => {
    const appName: string = generateAppName(path);
    const scriptId: string = `${SCRIPT_ID_PREFIX}${appName}`;
    const styleId: string = `${STYLE_ID_PREFIX}${appName}`;

    // 记录lastApp
    routerData.lastApp = path;

    // 卸载子应用渲染的内容
    const handleAppLeave: (() => void) | undefined = getMicroData(microId, APP_LEAVE_PREFIX);
    handleAppLeave && handleAppLeave();

    // 清空子应用的渲染节点
    setMicroData(microId, APP_MOUNT_NODE, null);
    // 清空子应用path
    setMicroData(microId, APP_PATH, null);
    // 清空子应用basename
    // setMicroData(microId, APP_BASENAME, null);

    // 移除子应用相关资源
    removeStylesAndScripts(host, scriptId, styleId);
}

/**
 * 应用加载器
*/
const AppLoader: FC<AppLoaderProps> = function AppLoader({ host, path }: AppLoaderProps) {
    const history = useHistory<History>();

    const {microId, onAppEnter, onAppRouteChange} = useContext<RouterContextValue>(RouterContext);

    const appMountNode = useRef<HTMLDivElement>();

    useEffect(() => {
        const appName: string = generateAppName(path);
        const scriptId: string = `${SCRIPT_ID_PREFIX}${appName}`;
        const styleId: string = `${STYLE_ID_PREFIX}${appName}`;

        // 设置子应用mountNode
        setMicroData(microId, APP_MOUNT_NODE, appMountNode.current);
        // 设置子应用path
        setMicroData(microId, APP_PATH, path);
        // 设置子应用baseName
        // setMicroData(microId, APP_BASENAME, basename? `${basename}${path}`: path)

        // 判断页面是否已经存在资源
        if(document.getElementById(scriptId) && document.getElementById(styleId)){
            console.log('页面存在已渲染应用，重新渲染', scriptId, path, host);
            renderApp({microId, path, history, onAppEnter, onAppRouteChange})
            return;
        }

        // 处理静态资源
        const handleManifest = (manifest: Object | void): void => {
            if(manifest){
                // webpack-manifest-plugin在vue中生成的json入口key为app.js
                const scriptSrc: string = manifest['main.js'] || manifest['app.js'];
                const styleSrc: string = manifest['main.css'] || manifest['app.css'];

                // 插入静态资源
                appendStylesAndScripts({styleId, styleSrc, scriptId, scriptSrc})
                    .then(() => {
                        renderApp({microId, path, history, onAppEnter, onAppRouteChange})
                    })
            }
        }

        // 缓存的manifest
        const cachedManifestObject: Object | undefined = getMicroData(microId, appName);
        if(cachedManifestObject){
            // 已有静态资源 直接处理静态资源
            handleManifest(cachedManifestObject);
        }else{
            // 没有静态资源 则先获取静态资源
            fetchManifest(host)
                .then(manifest => {
                    // 缓存资源内容
                    cacheManifest(microId, appName, manifest);
                    // 处理资源
                    handleManifest(manifest);
                })
        }
        return () => {
            // 组件卸载
            destroy(microId, host, path);
        }
    }, [])

    return <div ref={appMountNode}></div>
}

export default AppLoader;