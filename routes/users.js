const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Updated Successfully!!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account!!");
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Deleted Successfully!!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account!!");
  }
});

// Get a User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userID !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (!user.followers.includes(req.body.userID)) {
        await user.updateOne({ $push: { followers: req.body.userID } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User Followed");
      } else {
        res.status(403).json("Already Following");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself !");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userID !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (user.followers.includes(req.body.userID)) {
        await user.updateOne({ $pull: { followers: req.body.userID } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User Unfollowed");
      } else {
        res.status(403).json("Already Unfollowed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself !");
  }
});
module.exports = router;
