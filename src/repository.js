const { ObjectId } = require("mongodb");

class EventRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async find(id) {
    try {
      return await this.collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await this.collection.find({}).toArray();
      return result;
    } catch (error) {
      console.error("Erro ao buscar todos os documentos:", error);
      throw error;
    }
  }

  async create(event) {
    try {
      await this.collection.insertOne(event);
      return event;
    } catch (error) {
      console.error("Erro ao criar o documento:", error);
      throw error;
    }
  }

  async update(id, updatedEvent) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedEvent }
      );
      if (result.matchedCount === 0) {
        throw new Error("Nenhum documento encontrado com o ID fornecido");
      }
      return result;
    } catch (error) {
      console.error("Erro ao atualizar o documento:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        throw new Error("Nenhum documento encontrado com o ID fornecido");
      }
      return result;
    } catch (error) {
      console.error("Erro ao deletar o documento:", error);
      throw error;
    }
  }
}

module.exports = EventRepository;
