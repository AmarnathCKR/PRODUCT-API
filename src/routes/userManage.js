const router = require("express").Router();

const { userValidate, vaidateEdit, vaidatePassword } = require("../middlewares/userValidater");
const userAuth = require("../middlewares/userAuth");
const { changePassword, editUser, fetchUser, login, signup,  } = require("../controller/user/userController");


router.post("/signup", userValidate, signup);

router.post("/login", login)

router.get("/fetch-user", userAuth, fetchUser)

router.post("/edit", userAuth, vaidateEdit,editUser)

router.post("/change-pass", userAuth, vaidatePassword, changePassword)



module.exports = router;
