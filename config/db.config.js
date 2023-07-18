import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopogy: true,
  });
};
export default connectDB;
