const express = require('express');
const path = require('node:path')
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/routes.js');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/pool');
require('dotenv').config();


const app = express();
require('./config/passport')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(session({
  store: new pgSession({
    pool: pool,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use((req, res, next)=>{
  console.log(res.locals);
  next();
})

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));