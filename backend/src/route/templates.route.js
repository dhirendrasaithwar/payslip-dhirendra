import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import Template from "../model/template.model.js";

const r = Router();

r.use(requireAuth);

// GET all templates
r.get("/", async (req, res) => {
  try {
    console.log(`[Templates] Fetching templates for user: ${req.user.id}`);

    const items = await Template.find({ user: req.user.id }).sort("-createdAt");

    console.log(`[Templates] Found ${items.length} templates`);
    res.json({ items });
  } catch (err) {
    console.error("[Templates] Error fetching templates:", err);
    res.status(500).json({
      message: "Failed to fetch templates",
      error: err.message,
    });
  }
});

// CREATE template (SAFE VERSION)
r.post("/", async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({
        message: "name and data are required",
      });
    }

    console.log(
      `[Templates] Creating template: ${name} for user: ${req.user.id}`,
    );

    const item = await Template.create({
      user: req.user.id,
      name,
      data,
    });

    console.log(`[Templates] Template created with ID: ${item._id}`);
    res.json({ item });
  } catch (err) {
    console.error("[Templates] Error creating template:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE template
r.delete("/:id", async (req, res) => {
  try {
    console.log(
      `[Templates] Deleting template: ${req.params.id} for user: ${req.user.id}`,
    );

    const result = await Template.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Template not found" });
    }

    console.log(`[Templates] Template deleted successfully`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[Templates] Error deleting template:", err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE template (optional - for reuse)
r.put("/:id", async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({
        message: "name and data are required",
      });
    }

    console.log(`[Templates] Updating template: ${req.params.id}`);

    const item = await Template.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, data },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Template not found" });
    }

    console.log(`[Templates] Template updated successfully`);
    res.json({ item });
  } catch (err) {
    console.error("[Templates] Error updating template:", err);
    res.status(500).json({ message: err.message });
  }
});

export default r;
