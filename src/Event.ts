/*
 * @Author: your name
 * @Date: 2020-05-29 15:15:00
 * @LastEditTime: 2020-05-29 16:01:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/Event.ts
 */ 
import { getGlobalData, setGlobalData } from './utils/data';
import { EVENT_PREFIX } from './utils/constant';

interface Callback {
    (...cbParams: any[]): void
}

interface EventHooks {
    emit(key: string, ...cbParams: any[]): void,
    on(key: string, ...cbParams: any[]): void,
    off(key: string, ...cbParams: any[]): void,
    has(key: string): boolean
}

interface EventEmitter {
    [propName: string]: Callback[]
}

/**
 * 事件对象
*/
class Event implements EventHooks {
    private eventEmitter: EventEmitter;

    constructor(){
        this.eventEmitter = {};
    }

    /**
     * 触发已经注册的事件回调函数
     * @param {string} key 事件名称
     * @param {function[]} cbParams 注册回调函数调用时入参
    */
    emit = (key, ...cbParams) => {
        const callbacks: Callback[] | undefined = this.eventEmitter[key];
        if(!Array.isArray(callbacks) || (Array.isArray(callbacks) && callbacks.length === 0)){
            console.warn(`event.emit: no callback is called for ${key}`)
            return;
        }
        callbacks.forEach(cb => {
            cb(...cbParams)
        })
    }

    /**
     * 注册事件回调函数
     * @param {string} key 事件名称
     * @param {function} callback 绑定的事件回调函数
    */
    on = (key, callback) => {
        if(typeof key !== 'string'){
            console.warn('event.on: key should be string');
            return;
        }
        if(callback === undefined || typeof callback !== 'function') {
            console.warn('event.on: callback is required, should be function');
            return;
        }
        if(!this.eventEmitter[key]){
            this.eventEmitter[key] = [];
        }
        this.eventEmitter[key].push(callback)
    }

    /**
     * 删除注册的回调函数
     * @param {string} key 事件名称
     * @param {function} callback 需要删除的事件回调函数，不传则清空该事件所有回调函数，否则只清空当前函数
    */
    off = (key, callback) => {
        if(typeof key !== 'string'){
            console.warn('event.on: key should be string');
            return;
        }
        // 不传递函数 则清空所有回调函数
        if(callback === undefined){
            this.eventEmitter[key] = [];
            return;
        }
        this.eventEmitter[key] = this.eventEmitter[key].filter(cb => cb !== callback)
    }

    /**
     * 查看事件是否已经注册回调
     * @param {string} key 事件名称
    */
    has = (key) => {
        const keyEmitter: Callback[] | undefined = this.eventEmitter[key];
        return Array.isArray(keyEmitter) && keyEmitter.length > 0;
    }
}

let event: Event | undefined = getGlobalData(EVENT_PREFIX);
if(!event){
    event = new Event();
    setGlobalData(EVENT_PREFIX, event);
}

export default event;
