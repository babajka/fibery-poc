import { getArticleData } from '../../../services/fibery';

export default async (req, res) => {
    const {
        query: { slug },
    } = req;
    const article = await getArticleData(slug);
    if (!article) {
        return res.status(404);
    }
    res.status(200).json({ article });
};
