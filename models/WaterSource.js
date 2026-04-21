const mongoose = require("mongoose");

const objectId = mongoose.Schema.Types.ObjectId;

const waterSourceSchema = new mongoose.Schema(
  {
    // 📍 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ["well", "borewell", "river", "pond", "spring", "tap"],
      required: true,
    },

    // 🌍 Location (GeoJSON for map support)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    village: String,
    district: String,
    state: String,

    // 💧 Water Quality (basic for now)
    ph: Number,
    isPotable: {
      type: Boolean,
      default: false,
    },
    lastTestedAt: Date,

    // 🚰 Usage & Accessibility
    seasonal: {
      type: Boolean,
      default: false,
    },
    usersPerDay: Number,
    distanceFromVillage: Number, // in km

    // ⚙️ Condition & Maintenance
    condition: {
      type: String,
      enum: ["good", "moderate", "poor"],
      default: "good",
    },
    lastMaintenanceAt: Date,

    // 📝 Metadata
    notes: String,
    verified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: objectId,
      ref: "User",
    },
    updatedBy: {
      type: objectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 🌍 Enable geospatial queries (VERY important for maps)
waterSourceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("WaterSource", waterSourceSchema);
