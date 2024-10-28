const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.thing);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
       ...bookObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
 
   book.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
}

exports.updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }))
}

exports.getTheBestOnes = (req, res, next) => {

}

exports.ratingOne = (req, res, next) => {

}