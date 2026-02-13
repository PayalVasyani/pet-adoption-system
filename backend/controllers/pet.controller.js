const Pet = require("../models/pet.model");

exports.getPets = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, species, breed } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const query = { status: "available" };
    if (search) query.name = { $regex: search, $options: "i" };
    if (species) query.species = species;
    if (breed) query.breed = breed;

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      data: pets,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPet = async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json(pet);
};

exports.updatePet = async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(pet);
};

exports.deletePet = async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: "Pet deleted" });
};
