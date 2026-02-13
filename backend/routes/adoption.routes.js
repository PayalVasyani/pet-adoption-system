const router = require("express").Router();
const adoptionController = require("../controllers/adoption.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/:petId", auth, adoptionController.applyAdoption);
router.get("/my", auth, adoptionController.getMyAdoptions);

router.get("/", auth, role("admin"), adoptionController.getAllAdoptions);
router.put("/:id", auth, role("admin"), adoptionController.updateStatus);

module.exports = router;
