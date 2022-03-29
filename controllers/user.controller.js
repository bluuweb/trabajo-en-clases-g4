const { getUserDB } = require("../database/db");

const getUsers = async (req, res) => {
    const respuesta = await getUserDB();
    if (!respuesta.ok) {
        return res.status(500).json({ msg: respuesta.msg });
    }
    return res.json({ users: respuesta.users });
};

module.exports = {
    getUsers,
};
