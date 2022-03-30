const express = require("express");
const expressFileUpload = require("express-fileupload");
const { getUsers, createUser } = require("../controllers/user.controller");
const router = express.Router();

router.use(
    expressFileUpload({
        abortOnLimit: true,
        // limits: { fileSize: 5 * 1024 * 1024 },
    })
);

router.get("/users", getUsers);
router.post("/users", createUser);

module.exports = router;
