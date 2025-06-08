const express = require("express");
const publicRoutes = require("./routes/public");
const privateRoutes = require("./routes/private");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);

app.listen(process.env.PORT, () => {
  console.log("está rodando localhost:" + process.env.PORT);
});
