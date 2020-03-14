const express = require("express");

const router = express.Router();

const UserCotroller = require("../controllers/users");

router.post("/signup", UserCotroller.createUser);
router.post("/login", UserCotroller.userLogin);

module.exports = router;