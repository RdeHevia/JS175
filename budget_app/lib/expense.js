const nextId = require('./next-id');
const VALID_CATEGORIES = require('./categories').names;
// const VALID_CATEGORIES = [
//   "Groceries", "Restaurants", "Leisure", "Rent", "Bills", "Health"
// ];

class Expense {
  static validCategories = VALID_CATEGORIES;

  constructor(date, description, category, amount) {
    this.id = nextId();
    this.updateDate(date);
    this.updateDescription(description);
    this.updateCategory(category);
    this.updateAmount(amount);
  }

  updateDate(newDate) {
    this.fullDate = newDate;
    [this.year, this.month, this.day] = this.breakDownDate(newDate);
  }

  updateDescription(newDescription) {
    this.description = newDescription;
  }

  updateCategory(newCategory) {
    if (!this.isCategoryValid(newCategory)) {
      throw new TypeError("Invalid category");
    }
    this.category = this.formatCategory(newCategory);
  }

  updateAmount(newAmount) {
    this.amount = newAmount;
  }

  isCategoryValid(category) {
    return Expense.validCategories.includes(this.formatCategory(category));
  }

  formatCategory(category) {
    return category[0].toUpperCase() + category.slice(1);
  }

  getId() {
    return this.id;
  }

  breakDownDate(date) {
    let [year, month, day] = date.split('-').map(item => +item);
    return [year, month, day];
  }
}


// let expense1 = new Expense("2021-03-06","Spanish Table", "groceries", 30);
// let expense2 = new Expense("2021-03","Spanish Table", "groceries", 30);
// console.log(expense1.getId());
// console.log(expense2.getId());
// console.log(expense1);
// expense1.updateAmount(100);
// expense1.updateCategory("health");
// console.log(expense1);

module.exports = Expense;