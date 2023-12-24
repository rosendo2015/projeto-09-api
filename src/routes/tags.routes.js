const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const { Router } = require("express");
const TagsController = require("../controller/TagsController");
tagsRoutes = Router();
const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;