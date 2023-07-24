import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiryDate: { type: Date, required: true },
});

RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + 86400); // Expiration après 24 heures

  let _token = uuidv4();
  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt,
  });

  let refreshToken = await _object.save();
  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

RefreshTokenSchema.statics.removeExpiredTokens = async function () {
  await this.deleteMany({ expiryDate: { $lt: new Date() } });
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
