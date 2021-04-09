const ExpenseManager = require('./expense-manager');
const Expense = require('./expense');

const expenseManager = new ExpenseManager();
const expense1 = new Expense("2020-03-21","Ruta segura","Groceries",100);
const expense2 = new Expense("2021-01-01","CVS","Health", 20);
const expense3 = new Expense("2021-03-26","Giorgios 2", "Restaurants", 40);
const expense4 = new Expense("2021-01-01", "Clinton", "Rent", 3000);
const expense5 = new Expense("2020-03-22","Movies","Leisure",15);
const expense6 = new Expense("2021-01-12", "Rent movie", "Leisure", 5);
const expense7 = new Expense("2021-01-11", "Ibuprofene", "Health", 12);
const expense8 = new Expense("2021-01-25", "Xfinity", "Bills", 70);
const expense9 = new Expense("2021-01-02", "Car loan", "Bills", 300);
const expense10 = new Expense("2021-01-16", "PGE", "Bills", 100);
const expense11 = new Expense("2021-01-19", "Whole foods", "Groceries", 120);
const expense12 = new Expense("2021-01-07", "Safeway", "Groceries", 150);

expenseManager.add(
  expense1, expense2, expense3, expense4, expense5, expense6, expense7,
  expense8, expense9, expense10, expense11, expense12);
// console.log(expenseManager.lastExpenses(2).map(expense => expense.fullDate));
// console.log(expenseManager.total(2021, 1));
// console.log(expenseManager.totalByCategory(2021,1,'Health'));
// console.log(expenseManager.categoriesTotal(2021,1));

console.log(expenseManager.filterExpenses(2021, 1, 'Bills'));
module.exports = expenseManager;
