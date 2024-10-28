const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const processImage = require('../middleware/sharp-config')


router.get('/', bookCtrl.getAllBook);

router.get('/:id', bookCtrl.getOneBook)

router.get('/bestrating', bookCtrl.getTheBestOnes)

router.post('/', auth, multer, processImage, bookCtrl.createBook)

router.post('/:id/rating', auth, bookCtrl.ratingOne)

router.put('/:id', auth, multer, processImage, bookCtrl.updateBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router