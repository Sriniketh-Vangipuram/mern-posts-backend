const express = require("express");

const router = express.Router();

const Post = require("../models/Post");

const upload=require("../middleware/upload");

const cloudinary=require("../config/cloudinary");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


router.post("/", upload.single("image"),async (req, res) => {
  try {
    const { title, content } = req.body;

    let imageUrl="";

    if(req.file){
      const base64=Buffer.from(req.file.buffer).toString("base64");

      const dataURI=`data:${req.file.mimetype};base64,${base64}`;

      const uploadedImage=await cloudinary.uploader.upload(dataURI);

      imageUrl=uploadedImage.secure_url;
    }

    const newPost = await Post.create({
      title,
      content,
      imageUrl
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedPost =
      await Post.findByIdAndDelete(
        req.params.id
      );

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json({
      message: "Post deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;