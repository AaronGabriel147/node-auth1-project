const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');

// THings that need to exist:
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post('/register', async (req, res) => { //  no next

  const { username, password } = req.body;       // Take whatever the user types
  const hash = bcrypt.hashSync(password, 8);     // Encrypts the user's password
  const user = { username, password: hash }      // Create a user object with the username and hashed password

  try {
    const createdUser = await Users.add(user)  // add is a function in users-model.js ~~~ Knex = db('users').insert(user)
    console.log(createdUser)
    res.status(201).json(createdUser)          // 201 / json = Created
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', err });
  }
})






// __________________________________________________________________





/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [user] = await Users.findBy({ username })            // This is the user from the database.
    if (user && bcrypt.compareSync(password, user.password)) { // bcrypt line is testing the decrypted pw
      console.log(req.session)                               // user is being retrieved from db with decrypted password
      req.session.user = user // A cookie will be set on response. The session will be stored in the server. // In Insomnia click Headers to see set cookie.
      console.log('user ---->', user)
      return res.json({ message: `You are logged in ${username}, have a cookie!` })
    }
    next({ status: 401, message: 'Invalid Credentials from login' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', err });
  }
});





// __________________________________________________________________




/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


router.get('/logout', async (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.destroy(() => {                            // This is the session.destroy() method.
        res.status(200).json({ message: 'Logged Out' })
      })
    }
    next({ status: 401, message: 'Not logged in' })
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', err });
  }
})




module.exports = router;