/*
 * @Author: your name
 * @Date: 2020-05-26 12:08:00
 * @LastEditTime: 2020-06-01 15:18:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-micro/src/index.ts
 */ 
export { default as BrowserRouter } from './BrowserRouter';
export { default as Router } from './Router';
export { default as Route } from './Route';
export { default as AuthRoute } from './AuthRoute';
export { default as event } from './Event';
export {
    HashRouter,
    MemoryRouter,
    StaticRouter,
    Link,
    NavLink,
    Prompt,
    Redirect,
    Switch,
    generatePath,
    matchPath,
    useHistory,
    useParams,
    useLocation,
    useRouteMatch,
    withRouter
} from 'react-router-dom';

export { getPath, getBasename, isInMicro, getMountNode, registerAppEnter, registerAppLeave, getSubAppFuncs } from './utils/subApp';
export { setMicroConfig } from './utils/mainApp';