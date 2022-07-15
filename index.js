const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(express.static('build'));

app.use(express.json());

app.use(cors());

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms ')
);

const PORT = process.env.PORT || 3001;
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
  return maxId + 1;
};

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info about ${
      persons.length
    } people </p><p>${new Date()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const Id = Number(request.params.id);
  const Person = persons.find(p => p.id === Id);

  Person ? response.json(Person) : response.status(404).end();
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const filterPerson = persons.filter(p => p.name === body.name);
  const filterNumber = persons.filter(p => p.number === body.number);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `person ${!body.name ? 'name' : 'number'} is missing`,
    });
  } else if (filterPerson.length > 0 || filterNumber.length > 0) {
    return response.status(400).json({
      error: `person ${
        filterPerson.length > 0 ? 'name' : 'number'
      } must be unique`,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

// app.patch('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const body = request.body;
//   const person = persons.find(p => p.id === id);
//   const newPerson = { ...person, name: body.name };
//   persons = persons.map(p => (p.id !== id ? person : newPerson));
//   response.json(newPerson);
// });

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
