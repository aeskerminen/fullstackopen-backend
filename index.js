const dotnev = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Entry = require("./modules/entry");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("dist"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body["content"]);
});
const FORMAT =
  ":method :url :status :res[content-length] - :response-time ms :content";

app.use(morgan(FORMAT));

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
  Entry.find({}).then((result) => {
    resp.json(result);
  });
});

app.get("/api/persons/:id", (req, resp, next) => {
  const id = (req.params.id);
  const person = persons.find((p) => p.id === id);

  Entry.findById(id).then(entry => {
    if(entry) {
      resp.json(entry)
    } else {
      resp.status(404).end()
    }
  }).catch(error => next(error))
});

app.delete("/api/persons/:id", (req, resp, next) => {
  const id = (req.params.id);
  persons = persons.filter((p) => p.id !== id);

  Entry.findByIdAndDelete(id).then((result) => {
    resp.status(204).end()
  }).catch(error => next(error))

  resp.sendStatus(204).end();
});

app.post("/api/persons", (req, resp) => {
  const content = req.body;

  console.log(content);

  const _name = content.name;
  const _number = content.number;

  if (_name === undefined || _name === "") {
    return resp.status(404).json({
      "error": "name is not defined",
    });
  }

  if (persons.find((p) => p.name === _name)) {
    return resp.status(403).json({
      "error": "name must be unique",
    });
  }

  if (_number === undefined || _number == "") {
    return resp.status(404).json({
      "error": "number is not defined",
    });
  }

  const newEntry = new Entry(
    {
      name: _name,
      number: _number,
    },
  );

  persons = persons.concat(newEntry);

  newEntry.save().then((person) => {
    resp.json(person)
  })
});

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
