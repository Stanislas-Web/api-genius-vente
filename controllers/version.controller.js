const { Version } = require("../models/version.model");

// Créer une nouvelle version
module.exports.createVersion = async (req, res) => {
    const {
        android,
        ios,
        description
    } = req.body;

    try {
        const version = new Version({
            android,
            ios,
            description
        });

        const result = await version.save();

        return res.status(201).send({
            message: "Version créée avec succès",
            data: result
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la création de la version",
            error: error.message
        });
    }
};

// Récupérer toutes les versions
module.exports.getAllVersions = async (req, res) => {
    try {
        const versions = await Version.find().sort({ createdAt: -1 });
        return res.status(200).send({
            message: "Versions récupérées avec succès",
            data: versions
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la récupération des versions",
            error: error.message
        });
    }
};

// Récupérer une version par ID
module.exports.getVersionById = async (req, res) => {
    const versionId = req.params.id;

    try {
        const version = await Version.findById(versionId);

        if (!version) {
            return res.status(404).send({
                message: "Version non trouvée"
            });
        }

        return res.status(200).send({
            message: "Version récupérée avec succès",
            data: version
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la récupération de la version",
            error: error.message
        });
    }
};

// Récupérer la dernière version
module.exports.getLatestVersion = async (req, res) => {
    try {
        const latestVersion = await Version.findOne().sort({ createdAt: -1 });

        if (!latestVersion) {
            return res.status(404).send({
                message: "Aucune version trouvée"
            });
        }

        return res.status(200).send({
            message: "Dernière version récupérée avec succès",
            data: latestVersion
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la récupération de la dernière version",
            error: error.message
        });
    }
};

// Mettre à jour une version
module.exports.updateVersion = async (req, res) => {
    const versionId = req.params.id;
    const updateData = req.body;

    try {
        const updatedVersion = await Version.findByIdAndUpdate(versionId, updateData, { new: true });

        if (!updatedVersion) {
            return res.status(404).send({
                message: "Version non trouvée"
            });
        }

        return res.status(200).send({
            message: "Version mise à jour avec succès",
            data: updatedVersion
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la mise à jour de la version",
            error: error.message
        });
    }
};

// Supprimer une version
module.exports.deleteVersion = async (req, res) => {
    const versionId = req.params.id;

    try {
        const deletedVersion = await Version.findByIdAndDelete(versionId);

        if (!deletedVersion) {
            return res.status(404).send({
                message: "Version non trouvée"
            });
        }

        return res.status(200).send({
            message: "Version supprimée avec succès"
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la suppression de la version",
            error: error.message
        });
    }
}; 