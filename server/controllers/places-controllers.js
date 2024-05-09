const Place = require("../models/place");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const fs = require("fs"); // import the fs module to work with the file system
const path = require("path"); // import the path module to work with file paths

//get all places

const getPlaces = async (req, res) => {
  let places;
  try {
    places = await Place.find(); //query the database to get all places
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching places failed, please try again later." });
  }

  if (!places || places.length === 0) {
    return res.status(404).json({ message: "Could not find places." });
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//get a place by id

const getPlaceById = async (req, res) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId); //query the database to get a place by id
  } catch (err) {
    return res
      .status(500)

      .json({ message: "Fetching place failed, please try again later." });
  }

  if (!place) {
    return res
      .status(404)
      .json({ message: "Could not find a place for the provided id." });
  }

  res.json({ place: place.toObject({ getters: true }) });
};

//get all places for a specific user

const getPlacesByUserId = async (req, res) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId }); //query the database to get all places for a specific user
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching places failed, please try again later." });
  }

  if (!places || places.length === 0) {
    return res
      .status(404)
      .json({ message: "Could not find places for the provided user id." });
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//create a new place

const createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, address } = req.body;

  const place = new Place({
    title,
    description,
    image: req.file.path,
    address,
    creator: req.userData.userId,
  });

  try {
    await place.save(); //save the place in the database
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Creating placce failed, please try again." });
  }

  try {
    const user = await User.findById(req.userData.userId); //query the database to find the user
    user.places.push(place); //add the place to the user's places
    await user.save(); //save the user in the database
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Creating place failed, please try again." });
  }

  res.status(201).json({ place: place });
};

//update a place

const updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, address } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId); //query the database to find the place
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Updating place failed, please try again later." });
  }

  if (place.creator.toString() !== req.userData.userId) {
    return res
      .status(403)
      .json({ message: "You are not allllowed to edit this place." });
  }

  place.title = title;
  place.description = description;
  place.address = address;

  try {
    await place.save(); //save the updated place in the database
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Updating place failed, please try again." });
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

//delete a place

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const place = await Place.findByIdAndDelete(placeId);
    if (!place) {
      return res
        .status(404)
        .json({ message: "Could not find place for this id." });
    }
    const imageUrl = place.image; // Assuming this holds the correct path

    // Construct the full path to the image file
    const imagePath = path.join(__dirname, "..", imageUrl);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(imagePath)) {
      // Use synchronous deletion for better error handling
      fs.unlinkSync(imagePath);
      console.log("Image deleted successfully.");
    } else {
      console.log("Image does not exist.");
    }

    res.status(200).json({ message: "Deleted place." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong, could not delete place." });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
