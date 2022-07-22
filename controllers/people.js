const personRouter = require('express').Router()

const Person = require('../models/person')
const User = require('../models/user')

personRouter.get('/', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

personRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(400).end()
      }
    })
    .catch((error) => next(error))
})

personRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findById(body.user)
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

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      return response.status(204).end()
    })
    .catch((error) => next(error))
})

personRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

module.exports = personRouter
