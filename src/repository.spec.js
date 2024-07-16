const EventRepository = require("./repository");
const { MongoClient } = require("mongodb");
const mongo = require("mongodb");

describe("EventRepository", () => {
  let client;
  let collection;
  let repository;

  beforeAll(async () => {
    const dsn =
      "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
    client = new MongoClient(dsn);
    collection = client.db("events_db").collection("events");
    repository = new EventRepository(collection);
    await client.connect();
  });

  afterAll(() => {
    client.close();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  test("Procurar por um evento", async () => {
    const insertResult = await collection.insertOne({
      name: "Rock in Rio",
      date: "2024-12-31",
    });

    const event = await repository.find(insertResult.insertedId.toString());

    expect(event).toStrictEqual(
      expect.objectContaining({ name: "Rock in Rio", date: "2024-12-31" })
    );
  });
  test("Listar todos os eventos", async () => {
    await collection.insertOne({
      name: "Rock in Rio",
      date: "2024-12-31",
    });

    const events = await repository.findAll();

    expect(events.length).toBe(1);

    expect(events[0]).toStrictEqual(
      expect.objectContaining({ name: "Rock in Rio", date: "2024-12-31" })
    );
  });
  test("Criar um novo evento", async () => {
    const event = await repository.create({
      name: "Rock in Rio",
      date: "2024-12-31",
    });

    expect(event).toStrictEqual(
      expect.objectContaining({ name: "Rock in Rio", date: "2024-12-31" })
    );
  });
  test("Atualizar um evento", async () => {
    const insertResult = await collection.insertOne({
      name: "Rock in Rio",
      date: "2024-12-31",
    });

    const eventId = insertResult.insertedId.toString();

    const updatedEvent = { name: "Rock in Rio 2024", date: "2024-12-31" };
    await repository.update(eventId, updatedEvent);

    const updatedDocument = await repository.find(eventId);

    expect(updatedDocument).toStrictEqual(
      expect.objectContaining(updatedEvent)
    );
  });

  test("Remover um evento", async () => {
    const insertResult = await collection.insertOne({
      name: "Rock in Rio",
      date: "2024-12-31",
    });

    const eventId = insertResult.insertedId.toString();

    await repository.delete(eventId);

    const deletedDocument = await repository.find(eventId);

    expect(deletedDocument).toBeNull();
  });
});
