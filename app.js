// app.js 
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mainRoute = require('./routes/main');
const gamesRouter = require('./routes/games'); 

const PORT = 3000;
const app = express();

app.use(
  cors, // Добавляем CORS самым первым
  bodyParser.json(),
  express.static(path.join(__dirname, 'public')),
  mainRoute,
  gamesRouter
)

app.use(
  bodyParser.json(),
  express.static(path.join(__dirname, 'public')),
  mainRoute,
  gamesRouter
); 

// Теперь клиент имеет доступ только к публичным файлам
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(mainRoute, gamesRouter); 

app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
})


// Объявили middleware-функцию nameMiddleware
function nameMiddleware(req, res, next) {
  const name = 'Aski';
  console.log(`Меня зовут ${name}`)
  req.name = name
  next();
}

// Объявили middleware-функцию greetingMiddleware
function greetingMiddleware(req, res, next) {
  if (req.name === undefined) {
    console.log(`А как тебя зовут?`);
  } else {
    console.log(`Привет! ${req.name}`);
  }
  next();
}

// Объявили middleware-функцию для проверки авторизации
function authMiddleware(req, res, next) {
  console.log(`Пользователь ${req.name} авторизован!`);
  req.isAuth = true;
  next()
}

// Объявили контроллер для маршрута /
function homeController(req, res) {
  if (req.isAuth) {
    res.send(`${req.name} home page`);
  } else {
    res.send("Home Page");
  }
}

// Объявили контроллер для маршрута /users
function usersController(req, res) {
  res.send("Users Page");
}

// Глобально подключили middleware-функцию greetingMiddleware
app.use(greetingMiddleware);
// Глобально подключили middleware-функцию nameMiddleware
app.use(nameMiddleware);

// Обрабатываем запросы методом GET по маршруту "/"
app.get("/", authMiddleware, homeController);
// Обрабатываем запросы методом GET по маршруту "/users"
app.get("/users", usersController);
app.listen(3000, () => console.log("Server Started"));