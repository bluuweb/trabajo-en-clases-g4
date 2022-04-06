const express = require("express");
const expressFileUpload = require("express-fileupload");
const {
    getUsers,
    createUser,
    loginUser,
    getUser,
} = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/requireAuth");
const { requireDatos } = require("../middlewares/requireDatos");
const router = express.Router();

router.use(
    expressFileUpload({
        abortOnLimit: true,
        // limits: { fileSize: 5 * 1024 * 1024 },
    })
);

router.get("/users", requireAuth, getUsers);
router.post("/users", requireDatos, createUser);
router.post("/login", loginUser);
router.get("/perfil", requireAuth, getUser);
// router.put("/users/:id", requireAuth, updateUser);
// router.delete("/users/:id", requireAuth, deleteUser);

module.exports = router;
