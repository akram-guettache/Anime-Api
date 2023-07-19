const express = require("express");
const router = express.Router();
const {
  getAllEpisodes,
  getEpisode,
  addEpisode,
  updateEpisode,
  deleteEpisode,
} = require("../controllers/ep");
const authenticate = require("../middlewares/authentificate");

router
  .route("/:id")
  .get(getEpisode)
  .patch(authenticate, updateEpisode)
  .delete(authenticate, deleteEpisode);
router.route("/").post(authenticate, addEpisode).get(getAllEpisodes);
module.exports = router;
