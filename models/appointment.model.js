import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  name: { type: String, required: true },
  phone_1: { type: String },
  phone_2: { type: String },
  address: { type: String },
  commercial: { type: String },
  comment: { type: String },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "cancelled",
      "not-interested",
      "to-be-reminded",
      "longest-date",
    ],
    default: "pending",
  },
  version: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

appointmentSchema.plugin(mongoosePaginate);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
