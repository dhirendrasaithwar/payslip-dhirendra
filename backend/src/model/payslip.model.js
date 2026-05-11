import mongoose from "mongoose";
const PayslipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    gross: Number,
    net: Number,
  },
  { timestamps: true },
);
export default mongoose.models.Payslip ||
  mongoose.model("Payslip", PayslipSchema);
