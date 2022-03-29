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

const getUserDB = async () => {
    const client = await pool.connect();
    try {
        const respuesta = await client.query("SELECT * FROM users");
        console.log(respuesta);
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

module.exports = {
    getUserDB,
};
