const WaterSource = require("../models/WaterSource");

// ➕ Add new water source
exports.addSource = async (req, res) => {
  try {
    const {
      name,
      sourceType,
      latitude,
      longitude,
      ph,
      isPotable,
      seasonal,
      usersPerDay,
      condition,
      village,
      district,
      state,
      notes,
    } = req.body;


    if (!name || !sourceType || !latitude || !longitude) {
  return res.status(400).json({ error: "Missing required fields" });
}

    // 🔥 GeoJSON format: [longitude, latitude]
    const source = new WaterSource({
      name,
      sourceType,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      ph,
      isPotable,
      seasonal,
      usersPerDay,
      condition,
      village,
      district,
      state,
      notes,
    });

    await source.save();
    res.status(201).json(source);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get all sources
exports.getSources = async (req, res) => {
  try {
    const sources = await WaterSource.find().sort({ createdAt: -1 });
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};