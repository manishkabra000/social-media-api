const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

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
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. Like/Dislike a Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userID)) {
      await post.updateOne({ $push: { likes: req.body.userID } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userID } });
      res.status(200).json("Post Disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. Get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 6. Get timeline Posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userID);
    const userPosts = await Post.find({ userID: currentUser._id });
    const friendsPosts = await Promise.all(
      currentUser.followings.map((friendID) => {
        return Post.find({ userID: friendID });
      })
    );
    res.status(200).json(userPosts.concat(...friendsPost));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
