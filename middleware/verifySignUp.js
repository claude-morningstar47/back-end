import { db } from "../models/index.js";

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUserOrEmail = async (req, res, next) => {
  try {
    // Vérification de l'utilisateur
    const existingUser = await User.findOne({
      firstName: req.body.firstName,
    }).exec();
    if (existingUser) {
      return res.status(400).send({ message: "User is already in use" });
    }

    // Vérification de l'e-mail
    const existingEmail = await User.findOne({ email: req.body.email }).exec();
    if (existingEmail) {
      return res.status(400).send({ message: "Email is already in use" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: "Failed to check duplicate user or email", error: error.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({ message: `Role ${req.body.roles[i]} does not exist` });
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUserOrEmail,
  checkRolesExisted,
};

export default verifySignUp;
