/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

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
const QUERYSTRING = require('querystring');
const HANDLEBARS = require('handlebars');
const PATH = require('path');
const FS = require('fs');
const PORT = 3000;
const MIME_TYPES = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const LOAN_OFFER_SOURCE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>
              <a href='/loan-offer?amount={{amountDecrement}}&duration={{duration}}'>- $100</a>
            </td>
            <td>$ {{amount}}</td>
            <td>
              <a href='/loan-offer?amount={{amountIncrement}}&duration={{duration}}'>+ $100</a>
            </td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>
              <a href='/loan-offer?amount={{amount}}&duration={{durationDecrement}}'>- 1 year</a>
            </td>
            <td>{{duration}} years</td>
            <td>
              <a href='/loan-offer?amount={{amount}}&duration={{durationIncrement}}'>+ 1 year</a>
            </td>
          </tr>
          <tr>
            <th>APR:</th>
            <td colspan='3'>{{apr}}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td colspan='3'>$ {{monthlyPayment}}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </body>
</html>
`;

const LOAN_FORM_SOURCE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <form action="/loan-offer" method="POST">
        <p>All loans are offered at an APR of {{apr}}%</p>
        <label for="amout">How much money ($) do you want to borrow?</label>
        <input type="number" name="amount" value="">
        
        <label for="duration">How many years do you want to pay back your loan?</label>
        <input type="number" name="duration" value="">
        <input type="submit" name="" value="Get loan offer!">
      </form>
    </article>
  </body>
</html>
`;

const LOAN_OFFER_TEMPLATE = HANDLEBARS.compile(LOAN_OFFER_SOURCE);
const LOAN_FORM_TEMPLATE = HANDLEBARS.compile(LOAN_FORM_SOURCE);

function render(template, data) {
  let html = template(data);
  return html;
}
// Refactor parsePathName and Loan.prototype.parseFromPath into a class

function parsePathName(path) {
  let url = new URL(path, `http://localhost:${PORT}`);
  return url.pathname;
}

function getParams(path) {
  let data = {};
  data.amount = Number(parseFromPath(path, 'amount'));
  data.duration = Number(parseFromPath(path, 'duration'));
  return data;
}

function parseFromPath(path, name) {
  let url = new URL (path, `http://localhost:${PORT}`);
  return url.searchParams.get(name);
}

function parseFormData(request, callback) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end',() => {
    let data = QUERYSTRING.parse(body);
    data.amount = Number(data.amount);
    data.duration = Number(data.duration);
    callback(data);
  });
}


// class Parser {
//   constructor (path) {
//     this.path = path;
//   }
//   pathName() {}
//   getParams() {}
//   fromPath(name) {}
//   formData(request, callbac) {}
// }

class Loan {
  static APR = 0.05;

  constructor (data) {
    this.amount = data.amount;
    this.duration = data.duration;
    this.calculateMonthlyPayment();
  }

  calculateMonthlyPayment() {
    const MONTHS_IN_A_YEAR = 12;

    let monthlyInterest = Loan.APR / MONTHS_IN_A_YEAR;
    let amount = this.amount;
    let durationInMonths = this.duration * MONTHS_IN_A_YEAR;

    this.monthlyPayment = (
      amount *
      (monthlyInterest / (1 - ((1 + monthlyInterest) ** (-durationInMonths))))
    ).toFixed(2);
  }

  getOfferData() {
    let offerData = Object.assign({},this);
    offerData.amountIncrement = offerData.amount + 100;
    offerData.amountDecrement = offerData.amount - 100;
    offerData.durationIncrement = offerData.duration + 1;
    offerData.durationDecrement = offerData.duration - 1;
    offerData.apr = Loan.APR * 100;

    return offerData;
  }
}

function getMainPage(res) {
  res.statusCode = 200;
  res.setHeader('Content-Type','text/html');

  let content = render(LOAN_FORM_TEMPLATE,{apr: 5});
  res.write(content);
  res.end();
}

function getLoanOffer(res, path) {
  res.statusCode = 200;
  res.setHeader('Content-Type','text/html');

  let data = (new Loan(getParams(path))).getOfferData();
  let content = render(LOAN_OFFER_TEMPLATE, data);
  res.write(content);
  res.end();
}

function postLoanOffer(req, res) {
  parseFormData(req, parsedData => {
    let data = (new Loan(parsedData)).getOfferData();
    let content = render(LOAN_OFFER_TEMPLATE, data);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`${content}\n`);
    res.end();
  });
}

const SERVER = HTTP.createServer((req,res) => {
  let method = req.method;
  let path = req.url;
  let pathName = parsePathName(path);
  let fileExtension = PATH.extname(pathName);
  // DELETE console.logs
  console.log(`path: ${path}`);
  console.log(`pathname: ${pathName}`);
  console.log(`fileExtension: ${fileExtension}`);

  FS.readFile(`./public/${pathName}`, (err, data) => {
    if (data) {
      res.statusCode = 200;
      res.setHeader('Content-Type', `${MIME_TYPES[fileExtension]}`);

      res.write(`${data}\n`);
      res.end();
    } else if (method === 'GET' && pathName === '/') {
      getMainPage(res);
    } else if (method === 'GET' && pathName === '/loan-offer') {
      getLoanOffer(res,path);
    } else if (method === 'POST' && pathName === '/loan-offer') {
      postLoanOffer(req, res);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

