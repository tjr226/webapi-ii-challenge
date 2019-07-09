const express = require('express');
const router = express.Router();

const db = require('../data/db.js');

// POST blog post

// POST comment

// GET all blog posts

router.get('/', function (req, res) {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

// GET blog post by ID

router.get('/:id', function (req, res) {
    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(post);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
})

// GET comments

router.get('/:id/comments', function (req, res) {
    const { id } = req.params;

    db.findPostComments(id)
        .then(comments => {
            // note - the DB returns [] in both cases
            // no comments, or no original post
            if (comments.length === 0) {
                res.status(404).json({ message: "The post either does not exist or has zero comments." });
            } else {
                res.status(200).json(comments);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

// DELETE blog post

// PUT blog post


module.exports = router;