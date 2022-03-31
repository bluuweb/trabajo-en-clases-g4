const express = require("express");
const expressFileUpload = require("express-fileupload");
const {
    getUsers,
    createUser,
    loginUser,
} = require("../controllers/user.controller");
const { requireDatos } = require("../middlewares/requireDatos");
const router = express.Router();

router.use(
    expressFileUpload({
        abortOnLimit: true,
        // limits: { fileSize: 5 * 1024 * 1024 },
    })
);

router.get("/users", getUsers);
router.post("/users", requireDatos, createUser);
router.post("/login", loginUser);

module.exports = router;
