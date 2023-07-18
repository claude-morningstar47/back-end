import dotenv from "dotenv";

dotenv.config();

export const _config = {
  mongo_url : process.env.MONGO_URL,
  cookie_secret: process.env.COOKIE_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  jwt_lifetime_refresh: process.env.JWT_LIFETIME_REFRESH,
  jwt_lifetime_access: process.env.JWT_LIFETIME_ACCESS,
  port_number: process.env.PORT || 8089,
  cookie_max_age: process.env.COOKIE_MAX_AGE,
};


