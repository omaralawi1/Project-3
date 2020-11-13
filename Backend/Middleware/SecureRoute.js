const jwt = require('jsonwebtoken')
const { secret } = require('../Config/Environment')
const User = require('../Models/User')

function secureRoute(req, res, next) {
  const authToken = req.headers.authorization
  console.log('in the secure route')
  console.log(authtoken)

  if (!authToken || authToken.startsWith('Bearer')) {
    return res.status(401)({ message: 'Unauthorised 1' })
  }
  const token = authToken.replace('Bearer ', '')

  jwt.verify(token, secret, (err, payload) => {
    if (err) return res.status(401).send({ message: 'Unauthorised 2' })

    const userId = payload.sub
    User
      .findById(userId)
      .then(user => {
        if (!user) return res.status(401).send({ message: 'Unauthorised 3' })

        req.currentUser = user

        next()
      })
      .catch(()=> res.status(401).send({ message: 'Unauthorised 4' }))
  })
}

module.exports = secureRoute