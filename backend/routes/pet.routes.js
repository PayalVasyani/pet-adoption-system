const router = require("express").Router();
const petController = require("../controllers/pet.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/", petController.getPets);
router.post("/", auth, role("admin"), petController.createPet);
router.put("/:id", auth, role("admin"), petController.updatePet);
router.delete("/:id", auth, role("admin"), petController.deletePet);

module.exports = router;
