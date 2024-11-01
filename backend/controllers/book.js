const Book = require('../models/Book')
const fs = require('fs')

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    if (!req.file) {
        return res.status(404).json({ message: 'Image manquante'})
    }

    const book = new Book ({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    averageRating: bookObject.ratings[0].grade,
    })

    // const book = new Book({
    //     userId,
    //     title,
    //     author,
    //     year,
    //     genre,
    //     ratings: ratings || [],
    //     averageRating: averageRating || 0,
    //     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // });
 
   book.save()
   .then(() => {res.status(201).json({message: 'Livre enregistré !'})})
   .catch(error => {res.status(400).json({ error })})
}

exports.updateBook = (req, res, next) => {
  const bookObject = req.file ? {
       ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete bookObject._userId;
   Book.findOne({_id: req.params.id})
       .then(( book ) => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
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

exports.getTheBestOnes = (res) => {
    Book.find()
        // .sort((a, b) => b.averageRating - a.averageRating)
        .sort({averageRating: -1})
        .limit(3)    
        .then((books) => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: 'Une erreur est survenue lors de la récupération des 3 meilleurs livres.', error }))                
}

exports.ratingOne = (req, res, next) => {
    const updatedRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    };
    
    if (updatedRating.grade < 0 || updatedRating.grade > 5) {
        return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    Book.findOne({ _id: req.params.id }) 
        .then((book) => {
            if (book.ratings.find(rating => rating.userId === req.auth.userId)) { 
                return res.status(400).json({ message: 'You have already rated this book' })
            } else {
                book.ratings.push(updatedRating)

                book.averageRating = (book.averageRating * (book.ratings.length - 1) + updatedRating.grade) / book.ratings.length

                return book.save(); 
            }
        })
        .then((updatedBook) => res.status(201).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
}