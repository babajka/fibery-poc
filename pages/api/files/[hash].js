const { FIBERY_HOST } = process.env;

const FILES_PATH = `https://${FIBERY_HOST}.fibery.io/api/files`;

export default async (req, res) => {
    const {
        query: { hash },
    } = req;
    res.writeHead(302, { Location: `${FILES_PATH}/${hash}` });
    res.end();
};
