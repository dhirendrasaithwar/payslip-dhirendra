import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employeeName: { type: String, required: true },
    cadence: { type: String, enum: ["monthly"], default: "monthly" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    nextRunAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Schedule ||
  mongoose.model("Schedule", ScheduleSchema);
