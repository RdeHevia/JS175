const express = require("express");
const morgan = require("morgan");

const expenseManager = require("./lib/seed-data");
console.log(expenseManager);
const app = express();
const host = "localhost";
const port = 3000;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.redirect("/summary");
});

app.get("/summary", (req, res) => {
  res.render("summary", {
    expenseList: expenseManager.toArray(),
  });
});

app.listen(port, host, () => {
  console.log(`Expense manager is listening on port ${port} of ${host}!`);
});