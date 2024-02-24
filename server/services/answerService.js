// services/answerService.js
const { Answer } = require("../db"); // Assurez-vous que le chemin est correct

class AnswerService {
  async findAll(criteria, { page = 1, itemsPerPage = 100, order = {} }) {
    return await Answer.findAll({
      where: criteria,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      order: Object.entries(order),
    });
  }

  async findOne(id) {
    return await Answer.findByPk(id);
  }

  async create(data) {
    return await Answer.create(data);
  }

  async updateOne(id, newData) {
    const [updated] = await Answer.update(newData, { where: { id } });
    if (updated) {
      return this.findOne(id);
    }
    return null;
  }

  async deleteOne(id) {
    const deleted = await Answer.destroy({ where: { id } });
    return deleted === 1;
  }
}

module.exports = AnswerService;
