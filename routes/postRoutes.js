const express = require('express');
const router = express.Router();

router.use(express.json());

const db = require('../data/db.js');

// POST blog post
router.post('/', (req, res) => {
    const postInfo = req.body;
    // NOTE - inserting w/o title or contents kicks to catch
    // this code is janky but will be fixed with middleware

    db.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            if (postInfo.title || postInfo.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            } else {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            }
        })
})

// POST comment
router.post('/:id/comments', (req, res) => {
    const text = req.body.text;
    const { id } = req.params;

    // NOTE: db does not return anything for missing post_id
    db.insertComment({ text, post_id: id })
        .then(comment => {
            res.status(201).json(comment);
        })
        .catch(error => {
            if (text === undefined) {
                res.status(404).json({ errorMessage: "Please provide text for the comment." })
            } else {
                res.status(500).json({ error: "Either there was an error, or the original post doesn't exist." })
            }
        })
})

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
router.delete('/:id', function (req, res) {
    const { id } = req.params;

    db.remove(id)
        .then(response => {
            if (response === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed" });
        })
})

// PUT blog post
router.put('/:id', function (req, res) {
    const { id } = req.params;
    const postInfo = req.body;

    db.update(id, postInfo)
        .then(response => {
            if (response === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else if (postInfo.title === undefined || postInfo.contents === undefined) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be modified." });
        })
})

module.exports = router;