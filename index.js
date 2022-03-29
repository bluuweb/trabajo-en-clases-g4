const express = require("express");
const app = express();

app.use("/api/v1/", require("./routes/users.route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("🔥🔥🔥 andando en http://localhost:5000"));
