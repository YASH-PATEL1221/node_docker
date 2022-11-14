const express = require('express');
const protect = require('../middleware/authMiddleware');

const postController = require("../controllers/postController");

const Router = express.Router();

Router.route('/')
    .get(
        protect,
        postController.getAllPosts
    )
    .post(
        protect,
        postController.createPost
    );

Router.route("/:id")
    .get(
        protect,
        postController.getOnePost
    )
    .patch(
        protect,
        postController.updatePost
    )
    .delete(
        protect,
        postController.deletePost
    );

module.exports = Router;