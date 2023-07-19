const { BadRequestError, NotFoundError } = require("../errors");
const Episode = require("../models/Episode");
const { StatusCodes } = require("http-status-codes");
const getAllEpisodes = async (req, res) => {
  const episodes = await Episode.find({});
  res.status(StatusCodes.OK).json(episodes);
};

const getEpisode = async (req, res) => {
  const { id } = req.params;
  const episode = await Episode.findOne({ _id: id }).populate("anime");
  if (!episode) {
    throw new NotFoundError(`No Anime With The Following ID: ${episode}`);
  }
  res.status(StatusCodes.OK).json({ episode });
};

const updateEpisode = async (req, res) => {
  const { role } = req.user;
  if (role === "user") {
    throw new BadRequestError("You Are Not Allowed To Make This Task");
  }
  const { id } = req.params;
  const episode = await Episode.findByIdAndUpdate(
    { _id: id },
    { ...req.body }
  ).populate("anime");
  if (!episode) {
    throw new NotFoundError(`No Anime With The Following ID : ${id}`);
  }
  res.status(StatusCodes.OK).status(StatusCodes.OK).json(episode);
};

const addEpisode = async (req, res) => {
  const { role } = req.user;

  if (role === "user") {
    throw new BadRequestError("You Are Not Allowed To Make This Task");
  }
  const episode = await (await Episode.create(req.body)).populate("anime");
  res.status(StatusCodes.CREATED).json(episode);
};

const deleteEpisode = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role === "user") {
    throw new BadRequestError("You Are Not Allowed To Make This Task");
  }
  await Episode.findByIdAndRemove({ _id: id });
  res
    .status(StatusCodes.OK)
    .send(`Successfully deleted Episode With The Following ID: ${id}`);
};

module.exports = {
  getAllEpisodes,
  getEpisode,
  addEpisode,
  updateEpisode,
  deleteEpisode,
};
