// payslips.route.js
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import Payslip from "../model/payslip.model.js";
const r = Router();
r.use(requireAuth);
r.get("/", async (req, res) =>
  res.json({
    items: await Payslip.find({ user: req.user.id }).sort("-createdAt"),
  }),
);
r.post("/", async (req, res) => {
  const item = await Payslip.create({ ...req.body, user: req.user.id });
  res.json({ item });
});
r.delete("/:id", async (req, res) => {
  await Payslip.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ ok: true });
});
export default r;
