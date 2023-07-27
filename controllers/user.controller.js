import { db } from "../models/index.js";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;

const createUser = async (req, res) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });

      user.roles = roles.map((role) => role._id);
      await user.save();
    } else {
      const role = await Role.findOne({ name: "user" });

      user.roles = [role._id];
      await user.save();
    }

    res.status(201).send({ message: "User was registered successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to create user", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles", "-__v").exec();
    const formattedUsers = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const authorities = [];

      for (let j = 0; j < user.roles.length; j++) {
        authorities.push("ROLE_" + user.roles[j].name.toUpperCase());
      }

      formattedUsers.push({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: authorities,
        isActive: user.isActive,
      });
    }

    res.status(200).send(formattedUsers);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to retrieve users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("roles", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const authorities = [];

    for (let j = 0; j < user.roles.length; j++) {
      authorities.push("ROLE_" + user.roles[j].name.toUpperCase());
    }

    res.status(200).send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to retrieve user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, roles } = req.body;

    const updatedRoles = [];

    if (roles) {
      for (let roleName of roles) {
        const role = await Role.findOne({ name: roleName });
        if (role) {
          updatedRoles.push(role._id);
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 8),
        roles: updatedRoles,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User was updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to update user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to delete user", error: error.message });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
