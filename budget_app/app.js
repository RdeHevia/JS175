const express = require("express");
const morgan = require("morgan");

// const ExpenseManager = require("./lib/expense-manager");
// const Expense = require("./lib/expense");
const Dates = require("./lib/date");
const expenseManager = require("./lib/seed-data");

const app = express();
const host = "localhost";
const port = 3000;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

const parseYearMonth = (yearMonthQuery) => {
  let [year, month] = yearMonthQuery.split('-').map(item => +item);
  return [year, month];
};

app.get("/", (req, res) => {
  res.redirect("/summary");
});

app.get("/summary", (req, res) => {
  let [year, month] = [2021, 4];
  if (req.query.yearMonth) {
    [year, month] = parseYearMonth(req.query.yearMonth);
  }

  res.render("summary", {
    expenseList: expenseManager.expensesMonth(year, month, 10),
    total: expenseManager.total(year,month),
    categoriesTotal: expenseManager.categoriesTotal(year, month),
    yearMonth: req.query.yearMonth,
    monthYearTitle: Dates.longMonthYear(month,year),
  });
});

app.listen(port, host, () => {
  console.log(`Expense manager is listening on port ${port} of ${host}!`);
});