const express = require('express');
const GenericController = require('../controllers/genericController');
const CategoryService = require('./../services/categoryService');

const CategoryController = GenericController(new CategoryService())
const quizzRouter = express.Router();
quizzRouter.get('/', CategoryController.getAll);
quizzRouter.get("/:category", CategoryController.getByName);
quizzRouter.get('/:id', CategoryController.getOne);
quizzRouter.put(
    '/:id',
    CategoryController.update
);

module.exports = quizzRouter;