import Fibery from 'fibery-unofficial';

import { APP_NAME, DOC_SECRET_NAME, LOCALES, DOC_FORMAT } from './constants';
import {
    FIBERY_DEFAULT,
    ARTICLE_FIELDS,
    CONTENT_FIELDS,
    RELATED_ENTITIES,
} from './queries';
import { addAppName, appendLocale, toJson } from './utils';

const { FIBERY_HOST, FIBERY_TOKEN } = process.env;
const fibery = new Fibery({
    host: `${FIBERY_HOST}.fibery.io`,
    token: FIBERY_TOKEN,
});

const mapDocs = (article, docs, keyBySecret) =>
    docs.reduce((articleAcc, cur) => {
        const doc = JSON.parse(cur);
        if (!doc) {
            return articleAcc;
        }
        const { content, secret } = doc;
        const key = keyBySecret[secret];
        articleAcc[key] = content;
        return articleAcc;
    }, article);

export const getArticleData = async publicId => {
    const [article] = await fibery.entity.query(
        {
            'q/from': addAppName('Article'),
            'q/select': [
                ...FIBERY_DEFAULT,
                ...ARTICLE_FIELDS,
                ...CONTENT_FIELDS,
                ...RELATED_ENTITIES,
            ],
            'q/where': ['=', 'fibery/public-id', '$id'],
            'q/limit': 1,
        },
        {
            $id: publicId,
        }
    );
    const contentKeyBySecret = {};
    const docs = await Promise.all(
        LOCALES.map(lang => {
            const key = appendLocale(addAppName('Text'))(lang);
            const secret = article[key][DOC_SECRET_NAME];
            contentKeyBySecret[secret] = key;
            return fibery.document.get(secret, DOC_FORMAT);
        })
    );
    return mapDocs(article, docs, contentKeyBySecret);
};
