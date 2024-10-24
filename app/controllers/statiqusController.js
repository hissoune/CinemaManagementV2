const statiqutiquesRoutes = require('../services/statiquesService');

exports.statiques = async (req, res) => {
    try {
        const statiques = await statiqutiquesRoutes.statiques();
        res.status(200).json(statiques);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};