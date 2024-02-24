const SequelizeDb = require("sequelize");
const {database} = require("../db")


const Category = database.Category;
class CategoryService {
    async findAll(criteria, { page = null, itemsPerPage = null, order = {} }) {
        return await Category.findAll({
            where: criteria,
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            order: Object.entries(order),
        });
    }

    async create(data) {
        try {
            const category = await Category.create(data);
            return category;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        return await Category.findByPk(id);
    }

    async findByName(name) {
        return await Category.findOne({
            where: { name: name }
        });
    }

    async replaceOne(id, newData) {
        try {
            const deleted = await this.deleteOne(id);
            const category = await this.create({ ...newData, id });

            return [category, !deleted];
        } catch (error) {

            throw error;
        }
    }

    async updateOne(id, newData) {
        try {
            const [nbUpdated, newValues] = await Category.update(newData, {
                where: { id },
                returning: true,
            });
            if (nbUpdated === 0) {
                return null;
            }
            return newValues[0];
        } catch (error) {
            throw error;
        }
    }
    async deleteOne(id) {
        const nbDeleted = await Category.destroy({ where: { id } });
        return nbDeleted === 1;
    }
}


module.exports = CategoryService;