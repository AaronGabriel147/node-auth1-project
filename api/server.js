const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolate chip".

  The session can be persisted in memory (would not be adequate for production)
  or you can use a session store like `connect-session-knex`.
 */

const authRouter = require('./auth/auth-router')
const usersRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)




// Connected //  localhost:9000/  
server.get("/", (req, res) => {
  res.json({ api: "up" });
});



server.use('*', (req, res, next) => {
  console.log('this route does not exist')
  next({
    status: 404,
    message: 'not the route you are looking for',
  })
})

server.use((err, req, res, next) => { // eslint-disable-line
  // eslint-disable-line
  console.log(err.status, 'ERROR STATUS')
  res.status(err.status || 500).json({
    error: 'This is the error catch all',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server;
