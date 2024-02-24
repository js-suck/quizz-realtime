const {database : {Category, Question, Answer}} = require('../db');
const { Op } = require("sequelize");

class QuestionsService {
    async findAll(criteria, { page = null, itemsPerPage = null, order = {} }) {
        const questions = await Question.findAll({
            where: criteria,
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            order: Object.entries(order),
            include: { model: Answer, as: 'answers' }
        });

        return questions;
    }

    async create(data) {
        try {
            const question = await Question.create(data);
            return question;
        } catch (error) {

            throw error;
        }
    }

    async findOne(id) {
        const question = await Question.findByPk(id, {
            include: { model: Answer, as: 'answers' }
        });

        if (!question) {
            return null;
        }

        const nextQuestion = await Question.findOne({
            where: { quizzId: question.quizzId, id: { [Op.gt]: question.id } },
            order: [['id', 'ASC']],
            include: { model: Answer, as: 'answers' }
        });

        return { question, nextQuestion };
    }

    async replaceOne(id, newData) {
        try {
            const deleted = await this.deleteOne(id);
            const question = await this.create({ ...newData, id });

            return [question, !deleted];
        } catch (error) {
            throw error;
        }
    }

    async updateOne(id, newData) {
        try {
            const [nbUpdated, newValues] = await Question.update(newData, {
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
        const nbDeleted = await Question.destroy({ where: { id } });
        return nbDeleted === 1;
    }
    async findByName(categoryName, { page = null, itemsPerPage = null, order = {
        id: 'ASC'
    } }) {

        const category = await Category.findOne({
            where: { name: categoryName },
            attributes: ["id"],
        })

        if (!category) {
            throw new Error("Category not found");
        }

        const categoryId = category.id;

        const questions = await Question.findAll({
            attributes: ["id", "label"],
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            order: Object.entries(order),
            include: [
                {
                    model: Category,
                    attributes: ["name", "description", "image_url"],
                    where: {
                        id: categoryId
                    },
                    as: 'category'
                },
                {
                    model: Answer,
                    as: 'answers'
                },
            ],
        });

        console.log(questions, 'questions ici')
        const transformedArray = questions.map(item => ({
            "id": item.id,
            "label": item.label,
            "name": item.category.name,
            "description": item.category.description,
            "image_url": item.category.image_url,
            "answers": item.answers.map(answer => ({
                "id": answer.id,
                "label": answer.label,
                "isCorrect": answer.isCorrect
            }))

        }));
        return transformedArray;
    }
}


module.exports = QuestionsService