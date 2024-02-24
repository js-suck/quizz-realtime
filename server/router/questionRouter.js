const express = require('express');
const GenericController = require('../controllers/genericController');
const QuestionService = require('./../services/QuestionsService');

const QuestionController = GenericController(new QuestionService())
const questionRouter = express.Router();
questionRouter.post('/', QuestionController.create);
questionRouter.get('/', QuestionController.getAll);
questionRouter.get("/:category", QuestionController.getByName);
questionRouter.get('/:id', QuestionController.getOne);
questionRouter.put(
    '/:id',
    QuestionController.update
);

module.exports = questionRouter;