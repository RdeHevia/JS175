// @ts-check
/*
APR=5%
INPUT:
loan amount: amount
loan duration (in months): duration
EQUATION:
monthlyPayment =
  loanAmount * (monthlyInterest / (1 - (1 + monthlyInterest)^duration))
OUTPUT: Amount, Duration, APR, Monthly payment
RULES:
  - localhost:3000
  - input passed as query strings
STEPS:
  1. Create HTTP server
  2. Add miscelanous functions for logic
  3. make the server to listen
--------
loanCalculator
INPUT: path
OUTPUT: Amount, Duration, APR, Monthly payment
ALGORITHM:
  1. Parse amount and duration in years and convert it to number format
  2. Calculate the monthly payment
  3. Generate the body of the HTTP message as a string.
  4. Return it
*/

const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

class Loan {
  static APR = 0.05;

  constructor (path) {
    this.path = path;
    this.parseAmountAndDurationFromPath();
    this.calculateMonthlyPayment();
  }

  parseAmountAndDurationFromPath() {
    this.amount = Number(this.parseFromPath('amount'));
    this.durationInYears = Number(this.parseFromPath('duration'));
  }

  parseFromPath(name) {
    let url = new URL (this.path, `http://localhost:${PORT}`);
    return url.searchParams.get(name);
  }

  calculateMonthlyPayment() {
    const MONTHS_IN_A_YEAR = 12;

    let monthlyInterest = Loan.APR / MONTHS_IN_A_YEAR;
    let amount = this.amount;
    let durationInMonths = this.durationInYears * MONTHS_IN_A_YEAR;

    this.monthlyPayment = (
      amount *
      (monthlyInterest / (1 - ((1 + monthlyInterest) ** (-durationInMonths))))
    );
  }

  generateOffer() {
    let body = '';
    body += `Amount: $${this.amount}\n`;
    body += `Duration: ${this.durationInYears} years\n`;
    body += `APR: ${Loan.APR * 100}%\n`;
    body += `Monthly payment: $${this.monthlyPayment.toFixed(2)}\n`;
    return body;
  }
}

const SERVER = HTTP.createServer((req,res) => {
  let path = req.url;
  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    let content = (new Loan(path)).generateOffer();
    res.write(content);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});