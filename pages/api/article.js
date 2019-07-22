require('dotenv').config();

const { FIBERY_HOST, FIBERY_TOKEN } = process.env;

const Fibery = require('fibery-unofficial');
const fibery = new Fibery({
    host: `${FIBERY_HOST}.fibery.io`,
    token: FIBERY_TOKEN,
});

const APP_NAME = 'Content~Marketing';
const LOCALES = ['be', 'en', 'ru'];
const LOCALIZED_FIELDS = ['Title', 'Subtitle', 'Slug'];
const FIELDS = ['name', 'Color'].concat(
    LOCALIZED_FIELDS.reduce(
        (acc, cur) => acc.concat(LOCALES.map(lang => `${cur}-${lang}`)),
        []
    )
);
const SECRET_NAME = 'Collaboration~Documents/secret';

const mapDocBySecret = (acc, cur) => {
    if (cur) {
        const { secret, content } = cur;
        acc[secret] = content;
    }
    return acc;
};

export default async (req, res) => {
    const [article] = await fibery.entity.query(
        {
            'q/from': `${APP_NAME}/Article`,
            'q/select': [
                'fibery/id',
                'fibery/public-id',
                { 'user/Authors': ['fibery/id', 'Content~Marketing/name'] },
                { 'user/Collection': ['fibery/id', 'Content~Marketing/name'] },
                {
                    'user/Personalities': [
                        'fibery/id',
                        'Content~Marketing/name',
                    ],
                },
                {
                    [`${APP_NAME}/Text-be`]: [SECRET_NAME],
                },
                {
                    [`${APP_NAME}/Text-en`]: [SECRET_NAME],
                },
                {
                    [`${APP_NAME}/Text-ru`]: [SECRET_NAME],
                },
            ].concat(FIELDS.map(key => `${APP_NAME}/${key}`)),
            'q/where': ['=', 'fibery/public-id', '$id'],
            'q/limit': 1,
        },
        {
            $id: '2',
        }
    );
    const rawContent = await Promise.all(
        LOCALES.map(lang => {
            const secret = article[`${APP_NAME}/Text-${lang}`][SECRET_NAME];
            return fibery.document.get(secret, 'html');
        })
    );
    const content = rawContent
        .map(r => JSON.parse(r))
        .reduce(mapDocBySecret, {});
    res.status(200).json({ article, content });
};
