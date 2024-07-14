const express = require("express");

const app = express();
app.use(express.json());

app.get("/events", (req, res) => {
  res.json([
    {
      name: "Rock in Rio",
      date: "2024-01-01",
    },
  ]);
});

app.get("/events/:id", (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
  } else {
    res.json({
      name: "Rock in Rio",
      date: "2024-01-01",
    });
  }
});

app.post("/events", (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send({
      error: 400,
      message: "ContentTypeNotSupported",
    });
    return;
  }

  const event = req.body;

  event._id = "123456789";

  res.status(201).json(event);
});

app.put("/events/:id", (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
    return;
  }
  const event = req.body;
  event._id = req.params.id;
  res.status(200).json(event);
});

app.delete("/events/:id", (req, res) => {
  if (req.params.id === "0") {
    res.status(404).json({
      error: 404,
      message: "EventNotFound",
    });
    return;
  }
  res.status(204).send({});
});

module.exports = app;
