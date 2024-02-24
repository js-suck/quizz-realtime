// routes/answerRouter.js
const express = require("express");
const AnswerService = require("../services/answerService");
const GenericController = require("../controllers/genericController");

const answerService = new AnswerService();
const answerController = GenericController(answerService);

const answerRouter = express.Router();

answerRouter.post("/", answerController.create);
answerRouter.get("/", answerController.getAll);
answerRouter.get("/:id", answerController.getOne);
answerRouter.put("/:id", answerController.update);
answerRouter.delete("/:id", answerController.deleteOne);

module.exports = answerRouter;
