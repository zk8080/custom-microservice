import React, { FC, useEffect } from 'react';
import { RouteProps as ReactRouterProps } from 'react-router';
import { Router as ReactRouter } from 'react-router-dom';
import {History} from 'history';
import { RouterContext } from './utils/routersData';
import { VueMicroData, findVueMicroData } from './utils/mainApp';
import { VUE_ROUTER_PREFIX } from './utils/constant';

export interface RouteProps extends ReactRouterProps {
    microId: string,
    isTop?: boolean,
    onAppEnter?: (path: string, history: History) => void,
    onAppRouteChange?: (lastApp: string) => void,
    history: History
}

const Router: FC<RouteProps> = ({microId, isTop, onAppEnter, onAppRouteChange, ...props}: RouteProps) => {
    const contextValue = {
        microId,
        onAppEnter,
        onAppRouteChange
    }

    useEffect(() => {
        isTop && props.history.listen(({pathname, search}) => {
            const vueMicroData: VueMicroData | undefined = findVueMicroData(pathname);
            vueMicroData && vueMicroData[VUE_ROUTER_PREFIX].push(`${pathname}${search}`)
        })
    }, [])

    return (
        <RouterContext.Provider value={contextValue}>
            <ReactRouter {...props}/>
        </RouterContext.Provider>    
    )
}

export default Router;
