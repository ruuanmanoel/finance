const express = require("express");
const publicRoutes = require("./routes/public");

const app = express();

app.use(express.json());
app.use("/", publicRoutes);

app.listen(process.env.PORT, () => {
  console.log("está rodando localhost:" + process.env.PORT);
});
