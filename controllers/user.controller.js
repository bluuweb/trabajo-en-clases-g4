const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    getUsersDB,
    createUserDB,
    getUserDB,
    getUserID,
} = require("../database/db");
const path = require("path");

const getUsers = async (req, res) => {
    const respuesta = await getUsersDB();
    if (!respuesta.ok) {
        return res.status(500).json({ ok: false, msg: respuesta.msg });
    }
    return res.json({ ok: true, users: respuesta.users });
};

const getUser = async (req, res) => {
    console.log(req.id);
    const respuesta = await getUserID(req.id);
    console.log(respuesta);
    return res.json({
        ok: true,
        user: respuesta.user,
    });
};

const createUser = async (req, res) => {
    try {
        // validaciones
        const { nombre, email, password } = req.body;
        const { foto } = req.files;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const respuesta = await createUserDB({
            nombre,
            email,
            hashPassword,
            pathFoto: req.pathFoto,
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        // guardar img
        foto.mv(
            path.join(__dirname, "../public/avatars/", req.pathFoto),
            (err) => {
                if (err) throw new Error("No se puede guardar la img");
            }
        );

        const payload = { id: respuesta.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
            ok: true,
            token,
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validar campos del body
        if (!email?.trim() || !password?.trim()) {
            throw new Error("Algunos campos están vacios");
        }

        // ver si email existe en DB
        const respuesta = await getUserDB(email);
        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        if (!respuesta.user) {
            throw new Error("No existe el email registrado");
        }

        // ver si el password coincide con el pass del DB
        const { user } = respuesta;
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw new Error("Contraseña incorrecta");
        }

        // generar JWT
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // return res
        //     .cookie("token", token, {
        //         httpOnly: true,
        //         secure: process.env.NODE_ENV === "production",
        //     })
        //     .status(200)
        //     .json({ ok: true, token });

        return res.json({
            ok: true,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    getUser,
};
