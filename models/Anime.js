const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  story: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  episodes: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Episode",
  },
});
module.exports = mongoose.model("Anime", AnimeSchema);
