const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur The beauty stats API");
});

app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port: ${PORT}`);
});
