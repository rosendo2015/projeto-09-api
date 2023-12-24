const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const { Router, request, response } = require("express");
const UsersController = require("../controller/UsersController")
const UserAvatarController = require("../controller/UserAvatarController")
const multer = require("multer")
const uploadConfig = require("../config/upload")
usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRoutes.get("/", usersController.index);
usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

usersRoutes.patch("/avatar", ensureAuthenticated,
  upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes;