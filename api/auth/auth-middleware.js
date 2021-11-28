const Users = require('../users/users-model');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!" })
  }
}




/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  const { username } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user) {
        next({ status: 422, message: "Username taken" })
      } else {
        next()
      }
    })
    .catch(next)
}



// async function checkUsernameFree(req, res, next) {
//   // console.log(req.body);
//   try {
//     const users = await Users.findBy({ username: req.body.username })
//     if (!users.length) {
//       next()
//     } else {
//       next({ status: 422, message: "Username taken" })
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering user', err });
//   }
// }















/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength };

