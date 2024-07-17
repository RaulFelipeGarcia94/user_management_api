const express = require("express");
const EventRepository = require("./repository");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    exposedHeaders: "X-Total-count",
  })
);

let client;

const createRepository = () => {
  const dsn =
    "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
  client = new MongoClient(dsn);
  const collection = client.db("events_db").collection("events");

  return new EventRepository(collection);
};

const normalizeEvent = (event) => {
  event.id = event._id;
  delete event._id;
  return event;
};

app.get("/events", async (req, res) => {
  const repository = createRepository();
  await client.connect();
  const events = await repository.findAll();
  res.setHeader("X-Total-Count", events.length);
  res.json(events.map(normalizeEvent));
  client.close();
});

app.get("/events/:id", async (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
  } else {
    const repository = createRepository();
    await client.connect();
    const event = await repository.find(req.params.id);
    res.json(normalizeEvent(event));
    client.close();
  }
});

app.post("/events", async (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send({
      error: 400,
      message: "ContentTypeNotSupported",
    });
    return;
  }

  const repository = createRepository();
  await client.connect();
  const event = await repository.create(req.body);
  res.status(201).json(normalizeEvent(event));
  client.close();
});

app.put("/events/:id", async (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
    return;
  }

  const repository = createRepository();
  await client.connect();
  const event = await repository.update(req.params.id, req.body);
  res.json(normalizeEvent(event));
  client.close();
});

app.delete("/events/:id", async (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
    return;
  }
  const repository = createRepository();
  await client.connect();
  await repository.delete(req.params.id);
  res.status(204).send({});
  client.close();
});

module.exports = app;
