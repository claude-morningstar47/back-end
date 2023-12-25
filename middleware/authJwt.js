import jwt from "jsonwebtoken";
import { db } from "../models/index.js";
import { _config } from "../config/global.config.js";
const User = db.user;
const Role = db.role;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token has expired" });
  }
  return res.status(401).send({ message: "Unauthorized" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, _config.jwt_secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return catchError(err, res);
  }
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: "User not found" });
      }
      Role.findOne({ name: "admin" })
        .exec()
        .then((role) => {
          if (!role) {
            return res.status(500).send({ message: "Admin role not found" });
          }
          if (!user.roles.includes(role._id)) {
            return res.status(403).send({ message: "Require Admin Role" });
          }
          next();
        })
        .catch((err) => {
          return res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: "User not found" });
      }
      Role.findOne({ name: "moderator" })
        .exec()
        .then((role) => {
          if (!role) {
            return res.status(500).send({ message: "Moderator role not found" });
          }
          if (!user.roles.includes(role._id)) {
            return res.status(403).send({ message: "Require Moderator Role" });
          }
          next();
        })
        .catch((err) => {
          return res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

const isAdminOrModerator = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).send({ message: "User not found!" });
      }
      Role.find({ name: { $in: ["admin", "moderator"] } })
        .exec()
        .then((roles) => {
          const userRoles = user.roles.map((role) => role.toString());
          const authorizedRoles = roles.map((role) => role._id.toString());
          const isAuthorized = authorizedRoles.some((role) =>
            userRoles.includes(role)
          );
          if (!isAuthorized) {
            return res
              .status(403)
              .send({ message: "Require Admin or Moderator Role!" });
          }
          next();
        })
        .catch((err) => {
          return res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};


const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminOrModerator
};

export default authJwt;
