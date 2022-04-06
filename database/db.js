const { Pool } = require("pg");

const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:root@localhost:5432/user_example_db";

const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: connectionString,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({ connectionString });

const getUsersDB = async () => {
    const client = await pool.connect();
    try {
        const respuesta = await client.query(
            "SELECT nombre, id, email, foto FROM users"
        );
        return {
            ok: true,
            users: respuesta.rows,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const createUserDB = async ({ nombre, email, hashPassword, pathFoto }) => {
    const client = await pool.connect();

    const query = {
        text: "INSERT INTO users (nombre, email, password, foto) VALUES ($1,$2,$3,$4) RETURNING *",
        values: [nombre, email, hashPassword, pathFoto],
    };

    try {
        const respuesta = await client.query(query);
        const { id } = respuesta.rows[0];
        return {
            ok: true,
            id,
        };
    } catch (error) {
        console.log(error);
        if (error.code === "23505") {
            return {
                ok: false,
                msg: "Ya existe el email registrado",
            };
        }
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const getUserID = async (id) => {
    const client = await pool.connect();

    const query = {
        text: "SELECT * FROM users WHERE id = $1",
        values: [id],
    };

    try {
        const respuesta = await client.query(query);
        return {
            ok: true,
            user: respuesta.rows[0],
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const getUserDB = async (email) => {
    const client = await pool.connect();

    const query = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
    };

    try {
        const respuesta = await client.query(query);
        return {
            ok: true,
            user: respuesta.rows[0],
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

module.exports = {
    getUsersDB,
    createUserDB,
    getUserDB,
    getUserID,
};
