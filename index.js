const express = require("express");
const morgan = require("morgan")
const cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json());

app.use(express.static('dist'))

morgan.token('content', function (req, res) { return JSON.stringify(req.body['content']) })
const FORMAT = ":method :url :status :res[content-length] - :response-time ms :content"

app.use(morgan(FORMAT))

const PORT = 9999;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323532",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, resp) => {
  resp.send(persons);
});

app.get("/api/persons/:id", (req, resp) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    resp.send(person);
  } else {
    resp.sendStatus(404).end();
  }
});

app.delete("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    resp.sendStatus(204).end()
})

app.post("/api/persons", (req, resp) => {
    const id = Math.round(Math.random() * 10000)
    const content = req.body

    console.log(content)

    const _name = content.name
    const _number = content.number

    if(_name === undefined || _name === "") {
      return resp.status(404).json({
        'error': 'name is not defined'
      })
    }

    if(persons.find(p => p.name === _name)) {
      return resp.status(403).json({
        'error': 'name must be unique'
      })
    }

    if(_number === undefined || _number == "") {
      return resp.status(404).json({
        'error': 'number is not defined'
      })
    }

    const person = {
        id: id,
        name: _name,
        number: _number
    }

    persons = persons.concat(person)

    resp.send(person)
})

app.get("/info", (req, resp) => {
  const body = `<div><p>Phonebook has info for ${persons.length} people</p><p>${
    new Date().toLocaleDateString("fi-FI", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })
  }</p></div>`;
  resp.send(
    body,
  );
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
