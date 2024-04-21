const Post = require('../models/post')
const jwt = require('jsonwebtoken')
const secretKey = process.env.secretKey;
require('dotenv').config();




module.exports = {

  getAllPosts: (req, res) => {
    Post.find({}, 'title content image createdAt updatedAt') 
      .then((posts) => {
        // Vérifie si l'image existe et ajoute le chemin de l'image complet
        const postsWithImages = posts.map(post => ({
          ...post.toObject(),
          image: post.image ? `http://${req.headers.host}/uploads/${post.image}` : null
        }));
        res.json(postsWithImages);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
      });
  },
  getPost: (req, res) => {
    const postId = req.params.id;
    Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: error.message });
      });
  },
  
  createPost: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'secret');
  
      // Check if image is uploaded
      let imageUrl = null;
      if (req.file) {
        imageUrl = req.file.filename; // Store the filename of the uploaded image
      }
  
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        image: imageUrl, // Store the image filename
        author: decoded._id,
      });
  
      await post.save();
  
      res.status(201).json({ message: 'Post created successfully!', post: post });
    } catch (error) {
      // Capture and handle any errors
      console.error("Error creating post:", error);
      res.status(500).json({ error: error.message });
    }
  },
      
  updatePost: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, secretKey);
      const userId = decodedToken._id;
  
      const postId = req.params.id;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user is the author of the post
      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      // Update the post fields
      post.title = req.body.title;
      post.content = req.body.content;
      if (req.file) {
        post.image = req.file.filename; // Update the image filename
      }
      post.updatedAt = Date.now();
  
      await post.save();
  
      res.json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  deletePost: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, secretKey);
      const userId = decodedToken._id;
  
      const postId = req.params.id;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user is the author of the post
      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      // Delete the post
      await Post.findByIdAndDelete(postId);
  
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: error.message });
    }
  },
    
}
