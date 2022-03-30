const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const { getUserDB } = require("../database/db");
const path = require("path");

const getUsers = async (req, res) => {
    const respuesta = await getUserDB();
    if (!respuesta.ok) {
        return res.status(500).json({ msg: respuesta.msg });
    }
    return res.json({ users: respuesta.users });
};

const createUser = async (req, res) => {
    try {
        // validaciones
        if (
            !req.body?.nombre ||
            !req.body?.email ||
            !req.body?.password ||
            !req.files?.foto
        ) {
            throw new Error("Todos los campos son obligatorios");
        }

        const { nombre, email, password } = req.body;
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            throw new Error("Algunos campos están vacios");
        }

        // validaciones de las fotos
        const { foto } = req.files;
        const mimeTypes = ["image/jpeg", "image/png"];
        if (!mimeTypes.includes(foto.mimetype)) {
            throw new Error("Solo archivos png o jpg");
        }
        if (foto.size > 5 * 1024 * 1024) {
            throw new Error("Máximo 5MB");
        }

        const pathFoto = `${nanoid()}.${foto.mimetype.split("/")[1]}`;
        console.log(password);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // guardar img
        foto.mv(path.join(__dirname, "../public/avatars/", pathFoto), (err) => {
            if (err) throw new Error("No se puede guardar la img");
        });

        return res.json(req.body);
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

module.exports = {
    getUsers,
    createUser,
};
