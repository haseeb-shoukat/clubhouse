const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 60 },
  text: { type: String, required: true, maxLength: 280 },
  timestamp: { type: Date, required: true, default: Date.now() },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("formatted_date_of_death").get(function () {
  return this.date_created
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
