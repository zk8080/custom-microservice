/*
 * @Author: your name
 * @Date: 2020-05-27 16:25:44
 * @LastEditTime: 2020-05-28 09:33:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/utils/routerData.ts
 */ 
import { createContext, ReactNode } from 'react';
import { History } from 'history';

export interface RouterContextValue {
    onAppEnter?: (path: string, history: History) => void,
    onAppRouteChange?: (lastApp: string) => void,
    microId?: string
}

export const RouterContext = createContext({});

export const routerData: {
    lastApp: string | null
} = {
    lastApp: null
}
