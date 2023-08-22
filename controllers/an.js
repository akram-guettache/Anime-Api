const Anime = require("../models/Anime");
const Episode = require("../models/Episode");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const getAllAnimes = async (req, res) => {
  const { title, category, status } = req.query;
  const anime = {};
  if (title) {
    anime.title = { $regex: title, $options: "i" };
  }
  if (category) {
    anime.category = category;
  }
  if (status) {
    anime.status = status;
  }
  const animes = await Anime.find(anime);
  res.status(StatusCodes.OK).json({
    animes,
  });
};
const getAnime = async (req, res) => {
  const { id } = req.params;
  const anime = await Anime.findOne({ _id: id });
  if (!anime) {
    throw new NotFoundError(`No Anime With The Following id ${id}`);
  }
  const episodes = await Episode.find({ anime: id });

  res
    .status(StatusCodes.OK)
    .json({ anime, episodes, TotalEpisodes: episodes.length });
};
const addAnime = async (req, res) => {
  const { role } = req.user;
  if (role === "user") {
    throw new BadRequestError(
      "Not Allowed,Only Admins are Allowed To Such Operation"
    );
  }

  const anime = await Anime.create(req.body);
  res.status(StatusCodes.CREATED).json(anime);
};
const updateAnime = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role === "user") {
    throw new BadRequestError(
      "Not Allowed,Only Admins are Allowed To Such Operation"
    );
  }
  const anime = await Anime.findByIdAndUpdate({ _id: id }, { ...req.body });
  if (!anime) {
    throw new NotFoundError(`No Anime with the following id ${id}`);
  }
  res.status(200).json(anime);
};
const deleteAnime = async (req, res) => {
  const { role } = req.user;
  if (role === "user") {
    throw new BadRequestError(
      "Not Allowed,Only Admins are Allowed To Such Operation"
    );
  }
  const { id } = req.params;
  const anime = await Anime.findByIdAndRemove({ _id: id });
  if (!anime) {
    throw new NotFoundError(`No Anime with the following id ${id}`);
  }
  res.status(StatusCodes.OK).send("Anime Deleted Succeffully");
};

const addToFavourites = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });

  const { id: animeId } = req.params;
  const { favourites } = user;
  const tempuser = await User.findOne({ _id: userId, favourites: animeId });
  if (tempuser) {
    throw new BadRequestError(
      "The Selected Anime Is Already Set As A Favourite  "
    );
  }
  user.favourites = [...favourites, animeId];
  await user.save();
  res
    .status(StatusCodes.CREATED)
    .json({
      msg: `Successfully Added To Your Favourites The Following Anime With Id OF ${animeId} `,
    });
};

const RemoveFromFavourites = async (req, res) => {
  const { userId } = req.user;
  const { id: animeId } = req.params;
  const user = await User.findOne({ _id: userId });
  let array = user.favourites;

  if (array.includes(animeId) === true) {
    const tobedeleted = array.indexOf(animeId);
    array.splice(tobedeleted, 1);
    user.favourites = array;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Deleted From Your Favourites Successfully" });
  } else {
    throw new BadRequestError("Failed...");
  }
};

const getFavourites = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId }).populate(
    "favourites",
    "_id title status releaseDate"
  );
  if (!user) {
    throw new NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json({ favourites: user.favourites });
};
module.exports = {
  getAllAnimes,
  getAnime,
  updateAnime,
  deleteAnime,
  addAnime,
  addToFavourites,
  RemoveFromFavourites,
  getFavourites,
};
