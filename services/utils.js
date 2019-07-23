import { APP_NAME, LOCALES } from './constants';

export const flatMap = (arr, f) =>
    arr.reduce((acc, cur) => acc.concat(f(cur)), []);

export const addAppName = key => `${APP_NAME}/${key}`;
export const mapAppName = fields => fields.map(addAppName);

export const appendLocale = key => lang => `${key}-${lang}`;
export const mapLocales = key => LOCALES.map(appendLocale(key));

export const mapAppNameLocales = arr => flatMap(mapAppName(arr), mapLocales);
