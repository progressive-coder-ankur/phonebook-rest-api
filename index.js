require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001;
const Person = require('./models/person');
app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms ')
);

app.get('/info', (request, response) => {
  response.send(
    `<p className='info-title'>Phonebook has info about ${
      Person.length
    } people </p><p className='info-date'>${new Date()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person);
  });
});

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    // console.log(error);
    return response.status(400).json({ error: error });
  }
  next(error);
};

app.use(errorHandler);

app.get('/api/persons/:id', (request, response, next) => {
  const Id = request.params.id;
  Person.findById(Id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error.message));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(result => {
      return response.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
