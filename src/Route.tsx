import React, {FC} from 'react';
import { Route as ReactRoute, RouteProps as ReactRouteProps } from 'react-router-dom';
import AppLoader from './AppLoader';

export interface RouteProps extends ReactRouteProps {
    host?: string,
    path?: string
}

/**
 * Route组件
 * 
 * @param {string} RouteProps.host 子应用资源映射文件url的host，比如www.a.com/demo/${path}-manifest.json，则host传递www.a.com/demo。该属性非必填，如果传入该属性 则代表Route加载的是子应用，并且进行子应用资源的处理。如果不传入，Route为react-router-dom中的普通路由组件
 * 
 * @param {string} RouteProps.path 该属性必填，若传入了host属性，则path用来定义匹配子应用的路由前缀，否则参考react-router-dom的使用规则。如果使用host，例如传入www.a.com，path被设置为/demo，那么当访问www.a.com/demo时去加载www.a.com对应的子应用
*/

const Route: FC<RouteProps> = (props: RouteProps) => {
    const { host, path } = props;
    if(host) {
        // 如果存在host 则加载子应用 使用应用加载器 加载子应用
        const appProps = {host, path, key: `${host}${path}`}
        return <ReactRoute render={() => <AppLoader {...appProps} />} />
    }
    return <ReactRoute {...props}/>
}

export default Route;
