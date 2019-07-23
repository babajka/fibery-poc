import { getArticleData } from '../../services/fibery';

export default async (req, res) => {
    const article = await getArticleData('2');
    res.status(200).json(article);
};
