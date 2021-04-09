const ExpenseManager = require('./expense-manager');
const Expense = require('./expense');

const expenseManager = new ExpenseManager();
const expense1 = new Expense("2020-03-21","Ruta segura","Groceries",100);
const expense2 = new Expense("2021-01-01","CVS","Health", 20);
const expense3 = new Expense("2021-01-01", "Clinton", "Rent", 3000);
const expense4 = new Expense("2021-03-26","Giorgios 2", "Restaurants", 40);

expenseManager.add(expense1, expense2, expense3, expense4);


module.exports = expenseManager;
