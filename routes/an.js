const express = require("express");
const {
  getAllAnimes,
  getAnime,
  updateAnime,
  deleteAnime,
  addAnime,
} = require("../controllers/an.js");
const authenticate = require("../middlewares/authentificate");
const router = express.Router();

router.route("/").get(getAllAnimes).post(authenticate, addAnime);
router
  .route("/:id")
  .get(getAnime)
  .delete(authenticate, deleteAnime)
  .patch(authenticate, updateAnime);
module.exports = router;
