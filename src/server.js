const app = require("./app");

app.get("/", (req, res) => {
  res.redirect("/api");
});
app.listen(process.env.PORT || 3001);
