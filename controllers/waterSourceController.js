const WaterSource = require("../models/WaterSource");

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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


    if (
      !name ||
      !sourceType ||
      latitude === undefined ||
      longitude === undefined
    ) {
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
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await source.save();
    res.status(201).json(source);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSource = async (req, res) => {
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

    if (
      !name ||
      !sourceType ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const source = await WaterSource.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: "Source not found" });
    }

    source.name = name;
    source.sourceType = sourceType;
    source.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    source.ph = ph;
    source.isPotable = isPotable;
    source.seasonal = seasonal;
    source.usersPerDay = usersPerDay;
    source.condition = condition;
    source.village = village;
    source.district = district;
    source.state = state;
    source.notes = notes;
    source.updatedBy = req.user?._id;

    await source.save();
    res.json(source);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get all sources
exports.getSources = async (req, res) => {
  try {
    const { state, district } = req.query;
    const filter = {};

    if (typeof state === "string" && state.trim()) {
      filter.state = { $regex: `^${escapeRegex(state.trim())}$`, $options: "i" };
    }

    if (typeof district === "string" && district.trim()) {
      filter.district = {
        $regex: `^${escapeRegex(district.trim())}$`,
        $options: "i",
      };
    }

    const sources = await WaterSource.find(filter).sort({ createdAt: -1 });
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
