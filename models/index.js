import mongoose from "mongoose";
import User from "./user.model.js";
import Role from "./role.model.js";
import Appointment from "./appointment.model.js";
import RefreshToken from "./refreshToken.model.js";
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.role = Role;
db.refreshToken = RefreshToken;
db.appointment = Appointment;

db.ROLES = ["user", "admin", "moderator"];

export { db };
