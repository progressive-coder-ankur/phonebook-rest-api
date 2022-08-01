const personRouter = require('express').Router()

const Person = require('../models/person')
const User = require('../models/user')

personRouter.get('/', async (request, response) => {
  const people = await Person.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(people)
})

personRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findById(body.userId)
  const person = new Person({
    name: body.name,
    number: body.number,
    user: user._id,
  })

  const savedPerson = await person.save()
  user.people = user.people.concat(savedPerson._id)
  await user.save()

  response.json(savedPerson)
})

module.exports = personRouter
