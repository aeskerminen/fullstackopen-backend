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
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body["content"]);
});
const FORMAT =
  ":method :url :status :res[content-length] - :response-time ms :content";

app.use(morgan(FORMAT));

app.use(errorHandler);

const PORT = 9999;

app.get("/api/persons", (req, resp) => {
  Entry.find({}).then((result) => {
    resp.json(result);
  });
});

app.get("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;

  Entry.findById(id).then((entry) => {
    if (entry) {
      resp.json(entry);
    } else {
      resp.status(404).end();
    }
  }).catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;

  Entry.findByIdAndDelete(id).then((result) => {
    resp.status(204).end();
  }).catch((error) => next(error));
});

app.put("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;
  const content = req.body;

  const _name = content.name;
  const _number = content.number;

  const newEntry = {
    name: _name,
    number: _number,
  };

  console.log("hello?")

  Entry.findByIdAndUpdate(id, newEntry, {new: true}).then(updatedEntry => {
    resp.json(updatedEntry)
  }).catch(error => next(error))
});

app.post("/api/persons", (req, resp, next) => {
  const content = req.body;

  console.log(content);

  const _name = content.name;
  const _number = content.number;

  if (_name === undefined || _name === "") {
    return resp.status(404).json({
      "error": "name is not defined",
    });
  }

  /*
  if (persons.find((p) => p.name === _name)) {
    return resp.status(403).json({
      "error": "name must be unique",
    });
  }
  */

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

  newEntry.save().then((person) => {
    resp.json(person);
  }).catch((error) => next(error));
});

app.get("/info", async (req, resp) => {
  const body = `<div><p>Phonebook has info for ${await Entry.countDocuments()
    .then((res) => {
      return res;
    })} people</p><p>${
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
