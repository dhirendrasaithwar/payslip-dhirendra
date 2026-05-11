// Schedule.route.js
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import Schedule from "../model/schedule.model.js";

const r = Router();

// DIAGNOSTIC TEST ENDPOINT (NO AUTH - testing only)
r.get("/test/health", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Schedules route is working",
    timestamp: new Date().toISOString()
  });
});

// Protect all routes below this point
r.use(requireAuth);

// GET all schedules for logged-in user
r.get("/", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log(`[Schedules] Fetching schedules for user: ${req.user.id}`);

    const items = await Schedule.find({ user: req.user.id })
      .sort("-createdAt")
      .lean();

    console.log(`[Schedules] Found ${items.length} schedules`);
    res.json({ items });
  } catch (err) {
    console.error("[Schedules] Error fetching schedules:", err);
    res.status(500).json({
      message: "Failed to fetch schedules",
      error: err.message,
    });
  }
});

// CREATE new schedule (MONTHLY)
r.post("/", async (req, res) => {
  try {
    const { employeeName, data, cadence } = req.body;

    if (!employeeName || !data) {
      return res.status(400).json({
        message: "employeeName and data are required",
      });
    }

    console.log(
      `[Schedules] Creating schedule for employee: ${employeeName}, user: ${req.user.id}`,
    );

    const now = new Date();

    // First day of next month at 00:00
    const nextRunAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const item = await Schedule.create({
      user: req.user.id,
      employeeName,
      data,
      cadence: cadence || "monthly",
      nextRunAt,
      active: true,
    });

    console.log(`[Schedules] Schedule created with ID: ${item._id}`);
    res.json({ item });
  } catch (err) {
    console.error("[Schedules] Error creating schedule:", err);
    res.status(500).json({
      message: "Failed to create schedule",
      error: err.message,
    });
  }
});

// UPDATE schedule
r.put("/:id", async (req, res) => {
  try {
    const { employeeName, data, active } = req.body;

    console.log(`[Schedules] Updating schedule: ${req.params.id}`);

    const item = await Schedule.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        ...(employeeName && { employeeName }),
        ...(data && { data }),
        ...(active !== undefined && { active }),
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    console.log(`[Schedules] Schedule updated successfully`);
    res.json({ item });
  } catch (err) {
    console.error("[Schedules] Error updating schedule:", err);
    res.status(500).json({
      message: "Failed to update schedule",
      error: err.message,
    });
  }
});

// DELETE schedule
r.delete("/:id", async (req, res) => {
  try {
    console.log(
      `[Schedules] Deleting schedule: ${req.params.id} for user: ${req.user.id}`,
    );

    const result = await Schedule.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    console.log(`[Schedules] Schedule deleted successfully`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[Schedules] Error deleting schedule:", err);
    res.status(500).json({
      message: "Failed to delete schedule",
      error: err.message,
    });
  }
});

// GET single schedule
r.get("/:id", async (req, res) => {
  try {
    console.log(`[Schedules] Fetching schedule: ${req.params.id}`);

    const item = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ item });
  } catch (err) {
    console.error("[Schedules] Error fetching schedule:", err);
    res.status(500).json({
      message: "Failed to fetch schedule",
      error: err.message,
    });
  }
});

export default r;
