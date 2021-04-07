/* eslint-disable no-unused-expressions */
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const {body, validationResult} = require("express-validator");
const store = require("connect-loki");

const TodoList = require("./lib/todolist");
const Todo = require("./lib/todo");
const {sortTodos, sortTodoLists} = require("./lib/sort");

const app = express();
const host = "localhost";
const port = 3000;
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false
  },

  name: "launch-school-todos-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});


// Set up persistent session data
app.use((req, res, next) => {
  let todoLists = [];
  if ("todoLists" in req.session) {
    req.session.todoLists.forEach(todoList => {
      todoLists.push(TodoList.makeTodoList(todoList));
    });
  }

  req.session.todoLists = todoLists;
  next();
});

const loadTodoList = (todoListId, todoLists) => {
  return todoLists.find(todoList => todoList.id === todoListId);
};

const dropTodoList = (todoListId, todoLists) => {
  todoLists = todoLists.filter(list => list.id !== todoListId);
};

app.get("/", (req, res) => {
  res.redirect("/lists");
});

app.get("/lists", (req, res) => {
  res.render("lists", {
    todoLists: sortTodoLists(req.session.todoLists),
  });
});

app.get("/lists/new", (req, res) => {
  res.render("new-list");
});

// eslint-disable-next-line max-lines-per-function
app.post("/lists",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom((title, {req}) => {
        let todoLists = req.session.todoLists;
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("new-list", {
        flash: req.flash(),
        todoListTitle: req.body.todoListTitle,
      });
    } else {
      req.session.todoLists.push(new TodoList(req.body.todoListTitle));
      req.flash("success", "The todo list has been created.");
      res.redirect("/lists");
    }
  }
);

app.get("/lists/:todoListId", (req,res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (todoList === undefined) {
    next(new Error("Not found"));
  } else {
    res.render("list", {
      todoList: todoList,
      todos: sortTodos(todoList),
    });
  }
});

app.post("/lists/:todoListId/todos/:todoId/toggle", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoId = req.params.todoId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (todoList === undefined || todoList.findById(+todoId === undefined)) {
    next(new Error("Not found"));
  } else {
    todoList.toogleById(+todoId);
    let title = todoList.findById(+todoId).title;
    req.flash("success", `"${title}" updated.`);
    res.redirect(`/lists/${todoListId}`);
  }
});

app.post("/lists/:todoListId/todos/:todoId/destroy", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoId = req.params.todoId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (todoList === undefined || todoList.findById(+todoId === undefined)) {
    next(new Error("Not found"));
  } else {
    let title = todoList.findById(+todoId).title;
    todoList.removeById(+todoId);
    req.flash("success", `The todo "${title}" has been deleted`);
    res.redirect(`/lists/${todoListId}`);
  }
});

app.post("/lists/:todoListId/complete_all", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (!todoList) {
    next(new Error("Not found"));
  } else {
    todoList.markAllDone();
    req.flash("success", "All todos marked as done.");
    res.redirect(`/lists/${todoListId}`);
  }
});

app.post("/lists/:todoListId/todos",
  [
    body("todoTitle")
      .trim()
      .isLength({min: 1})
      .withMessage("The todo title is required.")
      .isLength({max: 100})
      .withMessage("List title must be between 1 and 100 characters.")
  ],
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId, req.session.todoLists);
    if (!todoList) {
      next(new Error("Not found."));
    }
    let errors = validationResult(req);
    let todoTitle = req.body.todoTitle;
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.redirect(`/lists/${todoListId}`);
    } else {
      todoList.add(new Todo(todoTitle));
      res.redirect(`/lists/${todoListId}`);
    }
  });

app.get("/lists/:todoListId/edit", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (!todoList) {
    next(new Error("Not found"));
  }
  res.render("edit-list",{ todoList });
});

app.post("/lists/:todoListId/destroy", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (todoList === undefined) {
    next(new Error("Not found"));
  } else {
    let listTitle = todoList.title;
    dropTodoList(+todoListId, req.session.todoLists);
    req.flash("success", `The list "${listTitle}" has been deleted.`);
    res.redirect("/lists");
  }
});

app.post("/lists/:todoListId/edit",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom((title, {req}) => {
        let todoLists = req.session.todoLists;
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  // eslint-disable-next-line max-lines-per-function
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId, req.session.todoLists);
    if (!todoList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));
        res.render("edit-list", {
          flash: req.flash(),
          todoListTitle: req.body.todoListTitle,
          todoList: todoList
        });
      } else {
        todoList.setTitle(req.body.todoListTitle);
        req.flash("success", "Todo list updated.");
        res.redirect(`/lists/${todoListId}`);
      }

    }
  }
);

app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(port, host, () => {
  console.log(`Todo is listenting on port ${port} of ${host}!`);
});