const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware');
const postController = require('../controllers/postController')
const auth = require('../middlewares/auth')

router.get('/', upload.single('image'),postController.getAllPosts);
router.get('/:id', upload.single('image'),postController.getPost);
// router.post('/',auth, postController.createPost);
router.post('/',auth, upload.single('image'), postController.createPost);
router.put('/:id',auth,upload.single('image'), postController.updatePost);
router.delete('/:id',auth, upload.single('image'),postController.deletePost);


module.exports = router;

