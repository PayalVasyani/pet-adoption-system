const Adoption = require("../models/adoption.model");
const Pet = require("../models/pet.model");

exports.applyAdoption = async (req, res) => {
  const pet = await Pet.findById(req.params.petId);

  if (!pet || pet.status !== "available") {
    return res.status(400).json({ message: "Pet not available" });
  }

  const existing = await Adoption.findOne({
    user: req.user.id,
    pet: pet._id,
  });

  if (existing) {
    return res.status(400).json({ message: "Already applied" });
  }

  const adoption = await Adoption.create({
    user: req.user.id,
    pet: pet._id,
  });

  res.status(201).json(adoption);
};

exports.updateStatus = async (req, res) => {
  const adoption = await Adoption.findById(req.params.id);

  adoption.status = req.body.status;
  await adoption.save();

  if (req.body.status === "approved") {
    await Pet.findByIdAndUpdate(adoption.pet, {
      status: "adopted",
    });
  }

  res.json(adoption);
};

exports.getAllAdoptions = async (req, res) => {
  const adoptions = await Adoption.find()
    .populate("user", "name email")
    .populate("pet", "name breed image");

  res.json(adoptions);
};

exports.getMyAdoptions = async (req, res) => {
  const adoptions = await Adoption.find({ user: req.user.id })
    .populate("pet", "name breed status image");

  res.json(adoptions);
};
