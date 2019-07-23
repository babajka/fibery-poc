import { DOC_SECRET_NAME } from './constants';
import {
    addAppName,
    mapAppName,
    flatMap,
    mapLocales,
    mapAppNameLocales,
} from './utils';

export const FIBERY_DEFAULT = ['fibery/id', 'fibery/public-id'];

const LOCALIZED_FIELDS = flatMap(['Title', 'Subtitle', 'Slug'], mapLocales);

export const ARTICLE_FIELDS = mapAppName([
    'name',
    'Color',
    ...LOCALIZED_FIELDS,
]);

export const CONTENT_FIELDS = mapLocales(addAppName('Text')).reduce(
    (acc, key) => {
        acc.push({
            [key]: [DOC_SECRET_NAME],
        });
        return acc;
    },
    []
);

const SUBQUERIES = {
    Authors: {
        'q/select': [
            ...FIBERY_DEFAULT,
            addAppName('name'),
            ...mapAppNameLocales(['FirstName', 'LastName', 'Bio']),
        ],
        'q/limit': 'q/no-limit',
    },
    Collection: [...FIBERY_DEFAULT, 'Content~Marketing/name'],
    Personalities: {
        'q/select': [
            ...FIBERY_DEFAULT,
            ...mapAppName(['name', 'Color']),
            ...mapAppNameLocales(['Name', 'Subtitle', 'Description']),
        ],
        'q/limit': 'q/no-limit',
    },
};

export const RELATED_ENTITIES = [
    'Authors',
    'Collection',
    'Personalities',
].reduce((acc, key) => {
    acc.push({
        [`user/${key}`]: SUBQUERIES[key],
    });
    return acc;
}, []);
