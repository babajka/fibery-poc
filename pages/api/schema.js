import fibery from '../../services/fibery';

export default async (req, res) => {
    const schema = await fibery.getSchema();
    res.json(schema);
};
