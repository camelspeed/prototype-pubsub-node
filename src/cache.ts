import * as NodeCache from 'node-cache';
const userCache = new NodeCache();
const historyCache = new NodeCache();
const dataProductCache = new NodeCache();

export { userCache, historyCache, dataProductCache };