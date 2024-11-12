const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const path = require('path');



module.exports.signUp = async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 10);

    const {
        username,
        phone,
        role,
        companyId,
    } = req.body;

    const validRoles = ['Admin', 'Seller'];
    if (!validRoles.includes(role)) {
        return res.status(400).send({
            message: `Le rôle doit être parmi les suivants : ${validRoles.join(', ')}`
        });
    }

    const numberExist = await User.findOne({ phone: phone });
    if (numberExist) {
        return res.status(400).send({ message: "Ce numéro de téléphone existe déjà" });
    }

    try {
        const user = new User({
            password,
            username,
            phone,
            role,
            companyId,
        });

        const result = await user.save();

        const token = jwt.sign(
            {
                nom: result.username,
                role: result.role,
                phone: result.phone,
                _id: result._id,
            },
            "RESTFULAPIs"
        );

        return res.status(201).send({
            message: "Inscription réussie",
            data: result,
            token: token
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de l'inscription",
            error: error.message
        });
    }
};

module.exports.login = async (req, res) => {
    const password = req.body.password;
    const phone = req.body.phone; 

    console.log(req.body);

    const checkUser = await User.findOne(phone).populate('companyId');

    console.log(checkUser);

    if (checkUser) {
        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (checkPassword) {
            return res.status(200).send({
                message: "User login Successfully",
                data: checkUser,
                token: jwt.sign(
                    { name: checkUser.username, role: checkUser.role, phone: checkUser.phone, _id: checkUser._id },
                    "RESTFULAPIs"
                ),
            });
        } else {
            return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrect" });
        }
    } else {
        return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrect" });
    }
};


// Récupérer tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('companyId');
        return res.status(200).send({
            message: "get all users",
            data: users,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors du get all users",
            error: error.message
        });
    }
};

module.exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).send({
                message: "Utilisateur non trouvé",
            });
        }

        return res.status(201).send({
            message: "Utilisateur mis à jour avec succès",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
            error: error.message,
        });
    }
};

module.exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send({
                message: "Utilisateur non trouvé",
            });
        }

        return res.status(200).send({
            message: "Utilisateur supprimé avec succès",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la suppression de l'utilisateur",
            error: error.message,
        });
    }
};


