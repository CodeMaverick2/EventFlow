const mongoose = require("mongoose");

const flowLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
});

module.exports = mongoose.model("FlowLog", flowLogSchema);
