const app = require("./app");
const request = require("supertest")(app);

describe("Event API", () => {
  test("Listar os eventos", async () => {
    const response = await request
      .get("/events")
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toStrictEqual([
      {
        name: "Rock in Rio",
        date: "2024-01-01",
      },
    ]);
  });
  test("Detalhar um evento", async () => {
    const response = await request
      .get("/events/123456789")
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      name: "Rock in Rio",
      date: "2024-01-01",
    });
  });
  test("Detalhar um evento que não existe retorna 404", async () => {
    const response = await request
      .get("/events/0")
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      error: 404,
      message: "EventNotFound",
    });
  });
  test("Cadastrar um novo evento em xml deve retornar 400", async () => {
    const response = await request
      .post("/events")
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      error: 400,
      message: "ContentTypeNotSupported",
    });
  });
  test("Cadastrar um novo evento", async () => {
    const response = await request
      .post("/events")
      .send({ name: "Rock in Rio", date: "2024-01-01" })
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        name: "Rock in Rio",
        date: "2024-01-01",
      })
    );
    expect(response.body._id).not.toBe(undefined);
  });
  test("Editar um evento existente", async () => {
    const response = await request
      .put("/events/123456789")
      .send({ name: "Rock in Rio", date: "2024-02-01" })
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      _id: "123456789",
      name: "Rock in Rio",
      date: "2024-02-01",
    });
  });
  test("Editar um evento inexistente", async () => {
    const response = await request
      .put("/events/0")
      .send({ name: "Rock in Rio", date: "2024-02-01" })
      .expect("Content-Type", /application\/json/);

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      error: 404,
      message: "EventNotFound",
    });
  });
  test("Remover um evento existente", async () => {
    const response = await request.delete("/events/123456789");
    expect(response.statusCode).toBe(204);
    expect(response.body).toStrictEqual({});
  });
  test("Remover um evento inexistente", async () => {
    const response = await request
      .delete("/events/0")
      .expect("Content-Type", /application\/json/);
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      error: 404,
      message: "EventNotFound",
    });
    expect(response.clientError).toBe(true);
  });
});
