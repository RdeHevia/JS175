const Expense = require('./expense');
const VALID_CATEGORIES = require('./categories').names;

class ExpenseManager {
  static validCategories = VALID_CATEGORIES;

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

  expensesMonth(year, month, limit = undefined) {
    if (limit === undefined) {
      limit = this.expenses.length;
    }
    return this.filterExpenses(year, month).slice(0,limit);
  }

  filterExpenses(year, month, category = null) {
    let expenses =
      this.expenses.filter(expense => {
        return expense.month === month && expense.year === year;
      });
    if (category) {
      expenses = expenses.filter(expense => expense.category === category);
    }

    return this.sortByDate(expenses);
  }

  sortByDate(expenses) {
    return expenses.slice().sort((a,b) => {
      if (a.fullDate > b.fullDate) {
        return -1;
      } else if (a.fullDate < b.fullDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // lastExpenses(limit) {
  //   if (limit === undefined) {
  //     limit = this.expenses.length;
  //   }
  //   return this.expenses.slice()
  //     .sort((a,b) => {
  //       if (a.fullDate > b.fullDate) {
  //         return -1;
  //       } else if (a.fullDate < b.fullDate) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     })
  //     .slice(0,limit);
  // }


  total(year, month) {
    return this.expenses
      .filter(expense => expense.month === month && expense.year === year)
      .reduce(((total, expense) => total + expense.amount), 0);
  }

  categoriesTotal(year, month) {
    return ExpenseManager.validCategories.map(category => {
      return {
        name: category,
        total: this.totalByCategory(year,month,category)
      };
    }).sort((a,b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  totalByCategory(year, month, category) {
    return this.expenses
      .filter(expense => {
        return expense.month === month &&
          expense.year === year &&
          expense.category === category;
      }).reduce(((total, expense) => total + expense.amount), 0);
  }
}


// let expenseManager = new ExpenseManager();
console.log(ExpenseManager.validCategories);
// expenseManager.add(new Expense("2021-06","Spanish Table","Groceries",100));
// console.log(expenseManager.toArray());

module.exports = ExpenseManager;