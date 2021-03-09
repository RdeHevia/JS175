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

  // eslint-disable-next-line max-lines-per-function
  generateOffer() {
    const RESPONSE = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Loan Calculator</title>
        <style type="text/css">
          ${this.generateStyle()}
        </style>
      </head>
      <body>
        ${this.generateContent()}
      </body>
    </html>`;
    return RESPONSE;
  }

  // eslint-disable-next-line max-lines-per-function
  generateContent() {
    const CONTENT = `
      <article>
      <h1>Your personalized loan:</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>$${this.amount}</td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>${this.durationInYears} years</td>
          </tr>
          <tr>
            <th>APR:</th>
            <td>${Loan.APR * 100}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td>$${this.monthlyPayment.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </article>`;
    return CONTENT;
  }

  // eslint-disable-next-line max-lines-per-function
  generateStyle() {
    const STYLE = `
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }`;
    return STYLE;
  }
}

const SERVER = HTTP.createServer((req,res) => {
  let path = req.url;
  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    let content = (new Loan(path)).generateOffer();
    res.write(content);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});