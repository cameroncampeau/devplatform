const session = require('express-session');
const SESSION_SECRET = "secretive Secret";

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true }
}))
