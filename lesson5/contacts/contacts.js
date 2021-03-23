/* eslint-disable no-unused-vars */
const express = require("express");
const morgan = require("morgan");
const app = express();

let contactData = [
  {
    firstName: "Mike",
    lastName: "Jones",
    phoneNumber: "281-330-8004",
  },
  {
    firstName: "Jenny",
    lastName: "Keys",
    phoneNumber: "768-867-5309",
  },
  {
    firstName: "Max",
    lastName: "Entiger",
    phoneNumber: "214-748-3647",
  },
  {
    firstName: "Alicia",
    lastName: "Keys",
    phoneNumber: "515-489-4608",
  },
];

const sortContacts = contacts => {
  return contacts.slice().sort((contactA, contactB) => {
    if (contactA.lastName < contactB.lastName) {
      return -1;
    } else if (contactA.lastName > contactB.lastName) {
      return 1;
    } else if (contactA.firstName < contactB.firstName) {
      return -1;
    } else if (contactA.firstName > contactB.firstName) {
      return 1;
    } else {
      return 0;
    }
  });
};
/*
trim leading & trailing spaces
all input fields are required
first & last name:
  max length = 25 chars
  alphabetic chars
  full name must be unique
phone number: match ###-###-#### format
ALGORITHM:
  1. Remove leading and trailing spaces
  2. Check input is not missing
    - missing -> display error
    - not missing -> continue
  3. check first name is correct
  4. check last name is correct
  5. check full name is unique
  6. check phone number is in the correct format
*/

function trimLeadingAndEndSpaces(req, res, next) {
  res.locals.firstName = req.body.firstName.trim();
  res.locals.lastName = req.body.lastName.trim();
  res.locals.phoneNumber = req.body.phoneNumber.trim();

  next();
}

function nameIsCorrect(name) {
  return name.match(/^[a-z]+$/i) && name.length <= 25;
}

function firstNameValidation(req, res, next) {
  let firstName = res.locals.firstName;
  if (!nameIsCorrect(firstName)) {
    res.locals.errorMessages.push(
      "First name must use alphabetic characters (25 max)."
    );
  }

  next();
}

function lastNameValidation(req, res, next) {
  let lastName = res.locals.lastName;
  if (!nameIsCorrect(lastName)) {
    res.locals.errorMessages.push(
      "Last name must use alphabetic characters (25 max)."
    );
  }

  next();
}

function fullNameIsUniqueValidation(req, res, next) {
  let firstName = res.locals.firstName;
  let lastName = res.locals.lastName;
  let fullName = `${firstName} ${lastName}`;

  if (contactsFullNames(contactData).includes(fullName)) {
    res.locals.errorMessages.push(`The contact ${fullName} already exists`);
  }

  next();
}

function contactsFullNames(contacts) {
  let fullNames = [];
  contacts.forEach(contact => {
    fullNames.push(`${contact.firstName} ${contact.lastName}`);
  });
  console.log(fullNames);
  return fullNames;
}

function phoneValidation(req, res, next) {
  let phoneFormat = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
  let phone = res.locals.phoneNumber;

  if (!phone.match(phoneFormat)) {
    res.locals.errorMessages.push(
      `The phone number must have the ###-###-#### format`
    );
  }

  next();
}

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.redirect("/contacts");
});

app.get("/contacts", (req, res) => {
  res.render("contacts", {
    contacts: sortContacts(contactData),
  });
});

app.get("/contacts/new", (req, res) => {
  res.render("new-contact");
});

app.post("/contacts/new",
  (req, res, next) => trimLeadingAndEndSpaces(req, res, next),

  (req, res, next) => {
    res.locals.errorMessages = [];
    next();
  },

  (req, res, next) => {
    if (res.locals.firstName.length === 0) {
      res.locals.errorMessages.push("First name is required.");
    }

    next();
  },

  (req, res, next) => {
    if (res.locals.lastName.length === 0) {
      res.locals.errorMessages.push("Last name is required.");
    }

    next();
  },

  (req, res, next) => {
    if (res.locals.phoneNumber.length === 0) {
      res.locals.errorMessages.push("Phone number is required.");
    }

    next();
  },

  (req, res, next) => firstNameValidation(req, res, next),
  (req, res, next) => lastNameValidation(req, res, next),
  (req, res, next) => fullNameIsUniqueValidation(req, res, next),
  (req, res, next) => phoneValidation(req, res, next),

  (req, res, next) => {
    if (res.locals.errorMessages.length > 0) {
      res.render("new-contact", {
        errorMessages: res.locals.errorMessages,
        firstName: res.locals.firstName,
        lastName: res.locals.lastName,
        phoneNumber: res.locals.phoneNumber,
      });
    } else {
      next();
    }
  },

  (req, res, next) => {
    contactData.push({
      firstName: res.locals.firstName,
      lastName: res.locals.lastName,
      phoneNumber: res.locals.phoneNumber,
    });
    res.redirect("/contacts");
  }
);

app.listen(3000, "localhost", () => {
  console.log("Listening on port 3000...");
});