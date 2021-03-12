const express = require('express');
const morgan = require('morgan');
const app = express();

const COUNTRY_DATA = [
  {
    path: "/english",
    flag: "flag-of-United-States-of-America.png",
    alt: "US Flag",
    title: "Go to US English site",
  },
  {
    path: "/french",
    flag: "flag-of-France.png",
    alt: "Drapeau de la france",
    title: "Aller sur le site français",
  },
  {
    path: "/serbian",
    flag: "flag-of-Serbia.png",
    alt: "Застава Србије",
    title: "Идите на српски сајт",
  },
  {
    path: "/spanish",
    flag: "flag-of-Spain.png",
    alt: "Bandera de España",
    title: "Ve al sition en español"
  }
];

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(morgan("common"));

app.locals.currentPathClass = (path, currentPath) => {
  return path === currentPath ? "current" : "";
};

app.get('/', (req, res) => {
  res.redirect('/english');
});

app.get('/english', (req, res) => {
  res.render('hello-world-english', {
    countries: COUNTRY_DATA,
    currentPath: req.path,
    language: "en-US",
  });
});

app.get('/french', (req, res) => {
  res.render('hello-world-french', {
    countries: COUNTRY_DATA,
    currentpath: req.path,
    language: "fr-FR",
  });
});

app.get('/serbian', (req, res) => {
  res.render('hello-world-serbian', {
    countries: COUNTRY_DATA,
    currentpath: req.path,
    language: "sr-Cyrl-rs",
  });
});

app.get('/spanish', (req, res) => {
  res.render('hello-world-spanish', {
    countries: COUNTRY_DATA,
    currentpath: req.path,
    language: "es-ES",
  });
});

app.listen(3000, 'localhost', () => {
  console.log('Listening on port 3000...');
});