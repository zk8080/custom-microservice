import React, { ComponentType, FC, useEffect, useState, createElement } from 'react';
import Route, {RouteProps} from './Route';

export interface AuthRouteProps extends RouteProps {
    authFunc: (props: RouteProps) => Promise<boolean>,
    unAuthorizedCom?: ComponentType,
    loadingCom?: ComponentType
}

const Auth: FC<AuthRouteProps> = ({authFunc, unAuthorizedCom, loadingCom, ...props}: AuthRouteProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        const callFunc = async () => {
            if(authFunc){
                let authorized: boolean = false;
                try {
                    authorized = await authFunc(props);
                }
                catch(e) {
                    setErrMsg(e.mssage);
                }
                setIsLoading(false);
                setIsAuthorized(authorized);
            }
        }   
        callFunc();
    }, [])

    if(isLoading) {
        const loadingComProps = {key: 'loadingCom', isLoading};
        return loadingCom ? createElement(loadingCom, loadingComProps) : null;
    }

    const unAuthorizedComProps = {key: 'unAuthorizedCom', errMsg, ...props};
    return isAuthorized ? <Route {...props}></Route> : unAuthorizedCom ? createElement(unAuthorizedCom, unAuthorizedComProps) : null;
}

/**
 * 路由鉴权组件
 * @param {function} AuthRouteProps.authFunc 路由鉴权函数，返回Promise，该函数resolve值为true时则表示鉴权成功。必填
 * @param {React.Component | React.StatelessComponent} AuthRouteProps.unAuthorizedCom 鉴权失败展示的组件
 * @param {React.Component | React.StatelessComponent} AuthRouteProps.loadingCom 加载效果组件
*/
const AuthRoute: FC<AuthRouteProps> = (props: AuthRouteProps) => {
    const {host, component, render, children, ...restProps} = props;
    const routeProps = {
        ...restProps,
        render: () => <Auth {...props} key={props.path}></Auth>
    }

    return <Route {...routeProps}></Route>
}

export default AuthRoute;
