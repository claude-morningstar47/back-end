import { db } from "../models/index.js";
const User = db.user;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import RefreshToken from "../models/refreshToken.model.js";
import { _config } from "../config/global.config.js";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate("roles", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password",
      });
    }

    user.isActive = true;
    await user.save();

    const token = jwt.sign({ id: user.id }, _config.jwt_secret, {
      algorithm: "HS256",
      expiresIn: 10800,
      // expiresIn: 3600,
    });

    const refreshToken = await RefreshToken.createToken(user);

    const authorities = user.roles.map((role) => "ROLE_" + role.name.toUpperCase());

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2592000000,
    });

    const userlog = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(200).send({
      userlog,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to sign in", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
      return res.status(403).json({ message: "Refresh Token is required" });
    }

    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in database" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      return res.status(403).json({
        message: "Refresh token was expired. Please make a new sign-in request",
      });
    }

    const newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      _config.jwt_secret,
      {
        algorithm: "HS256",
        expiresIn: 3600,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to refresh token", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout", error: error.message });
  }
};

export default { signin, refreshToken, logout };
