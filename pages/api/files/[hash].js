export default async (req, res) => {
    const {
        query: { hash },
    } = req;
    console.log('log: ', req.url, hash);
    res.writeHead(302, {
        Location: `https://wir.fibery.io/api/files/${hash}`,
    });
    res.end();
};
