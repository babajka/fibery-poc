import Fibery from 'fibery-unofficial';

import { DOC_SECRET_NAME, LOCALES, DOC_FORMAT } from './constants';
import {
    FIBERY_DEFAULT,
    ARTICLE_FIELDS,
    CONTENT_FIELDS,
    RELATED_ENTITIES,
} from './queries';
import { addAppName, appendLocale } from './utils';

const { FIBERY_HOST, FIBERY_TOKEN } = process.env;
const fibery = new Fibery({
    host: `${FIBERY_HOST}.fibery.io`,
    token: FIBERY_TOKEN,
});

const mapDocs = (article, docs, keyBySecret) =>
    docs.reduce((articleAcc, doc) => {
        if (!doc) {
            return articleAcc;
        }
        const { content, secret } = doc;
        const key = keyBySecret[secret];
        articleAcc[key] = content;
        return articleAcc;
    }, article);

export const getArticleData = async slug => {
    const [article] = await fibery.entity.query(
        {
            'q/from': addAppName('Article'),
            'q/select': [
                ...FIBERY_DEFAULT,
                ...ARTICLE_FIELDS,
                ...CONTENT_FIELDS,
                ...RELATED_ENTITIES,
                {
                    'fibery/files': {
                        'q/select': ['fibery/secret'],
                        'q/limit': 'q/no-limit',
                    },
                },
            ],
            'q/where': ['=', addAppName('Slug-be'), '$slug'],
            'q/limit': 1,
        },
        {
            $slug: slug,
        }
    );
    if (!article) {
        return null;
    }
    const contentKeyBySecret = {};
    const secrets = LOCALES.map(lang => {
        const key = appendLocale(addAppName('Text'))(lang);
        const secret = article[key][DOC_SECRET_NAME];
        contentKeyBySecret[secret] = key;
        return { secret };
    });
    const docs = await fibery.document.getBatch(secrets, DOC_FORMAT);
    return mapDocs(article, docs, contentKeyBySecret);
};

export default fibery;
