const router = require("express").Router();
const Post = require("../models/Post");

// 1. Create a Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 2. Update a Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userID === req.body.userID) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(404).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// 3. Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userID === req.body.userID) {
      await post.deleteOne();
      res.status(200).json("Post Deleted");
    } else {
      res.status(404).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// 4. Like a Post
// 5. Get a Post
// 6. Get timeline Posts

module.exports = router;
