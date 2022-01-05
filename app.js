const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.render("home");
})