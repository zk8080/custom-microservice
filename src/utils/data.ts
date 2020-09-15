/*
 * @Author: your name
 * @Date: 2020-05-27 09:58:32
 * @LastEditTime: 2020-05-27 10:09:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/utils/data.ts
 */ 
import { PREFIX } from './constant';

export const setGlobalData = (key: string, value: any): void => {
    if(!window[PREFIX]){
        window[PREFIX] = {};
    }
    window[PREFIX][key] = value;
}

export const getGlobalData = (key: string): any => window[PREFIX] && window[PREFIX][key];

export const setMicroData = (microId: string, key: string, value: any): void => {
    const microData: Object | undefined = getGlobalData(microId);
    if(!microData){
        setGlobalData(microId, {
            [key]: value
        })
        return;
    }
    microData[key] = value;
}

export const getMicroData = (microId: string, key: string): any => {
    const microData: Object | undefined = getGlobalData(microId);
    if(microData) {
        return microData[key];
    }
}