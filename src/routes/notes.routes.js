const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const { Router } = require("express");
const NotesController = require("../controller/NotesController");
notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated)
notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;