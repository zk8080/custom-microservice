import React, { FC, useState, useEffect } from 'react';
import { BrowserRouterProps as ReactBrowserRouterProps } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';
import Router from './Router';
import { APP_BASENAME } from './utils/constant';
import { setGlobalData } from './utils/data';

export interface BrowserRouterProps extends ReactBrowserRouterProps {
    microId: string,
    isTop?: boolean,
    onAppEnter?: (path: string, history: History) => void,
    onAppRouteChange?: (lastApp: string) => void,
    // history: History
}


/**
 * BrowserRouter组件
 * @param {string} BrowserRouterProps.microId 主应用id，若主应用中不存在子应用嵌套 则不传，否则必传
 * @param {boolean} BrowserRouterProps.isTop 是否为顶层应用，在多层应用中，若存在多个vue子应用，则顶层应用需要传递isTop为true，其他应用不可传递
 * @param {function} BrowserRouterProps.onAppEnter 子应用渲染前回调函数
 * @param {function} BrowserRouterProps.onAppRouteChange 子应用间路由切换时的回调
*/
const BrowserRouter: FC<BrowserRouterProps> = (props: BrowserRouterProps) => {
    const [history] = useState<History>(createBrowserHistory(props));
    const {basename} = props;

    useEffect(() => {
        // 规范约束 只有顶层主应用才可以设置basename
        setGlobalData(APP_BASENAME, basename || '/')
    }, [])

    const routerProps = {
        history,
        ...props
    }

    return <Router {...routerProps}></Router>
}

export default BrowserRouter;