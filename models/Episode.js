const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  episodetitle: {
    type: String,
    required: true,
  },
  episodenumber: {
    type: Number,
    required: true,
  },
  episodelinks: {
    type: [String],
    required: true,
  },
  anime: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Anime",
    required: true,
  },
});

module.exports = mongoose.model("Episode", EpisodeSchema);
