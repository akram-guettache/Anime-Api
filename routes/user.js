const express = require("express");
const router = express.Router();
const {
  addToFavourites,
  RemoveFromFavourites,
  getFavourites,
} = require("../controllers/an");
router.route("/favourites").get(getFavourites);
router.route("/favourites/:animeId").post(addToFavourites);
router.route("/favourites/:id").delete(RemoveFromFavourites);
module.exports = router;
