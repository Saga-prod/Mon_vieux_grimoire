const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


router.get('/', bookCtrl.getAllBook);

router.get('/:id', bookCtrl.getOneBook)

router.get('/bestrating', bookCtrl.getTheBestOnes)

router.post('/', auth, multer, bookCtrl.createBook)

router.put('/:id', auth, bookCtrl.updateBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.ratingOne)

module.exports = router