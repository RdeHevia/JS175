const Expense = require('./expense');

class ExpenseManager {
  constructor () {
    this.expenses = [];
  }

  add(...expenses) {
    expenses.forEach(expense => {
      if (!(expense instanceof Expense)) {
        throw new TypeError("can only add Expense objects");
      }
      this.expenses.push(expense);
    });
  }

  toArray() {
    return this.expenses.slice();
  }

  
}


// let expenseManager = new ExpenseManager();
// expenseManager.add(new Expense("2021-06","Spanish Table","Groceries",100));
// console.log(expenseManager.toArray());

module.exports = ExpenseManager;