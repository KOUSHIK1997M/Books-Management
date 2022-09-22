const isValidUserData = require('../dataValidation/inputDataValidation')
const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel')
const mongoose = require('mongoose')

//========================================>  (( Create a book, api call )) <=========================================//

const createBooks = async (req, res) => {
    try {
        // using destructuring of body data.
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(req)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        let msgTitleData = isValidUserData.isValidNameData(title)
        if (msgTitleData) {
            return res.status(400).send({ status: false, message: msgTitleData })
        }

        const isTitleUnique = await bookModel.findOne({ title });
        if (isTitleUnique) {
            return res.status(400).send({ status: false, message: `title: ${title} already exist` });
        }

        let msgExcerptData = isValidUserData.isValidNameData(excerpt)
        if (msgExcerptData) {
            return res.status(400).send({ status: false, message: msgExcerptData })
        }

        let msgISBNData = isValidUserData.isValidISBNData(ISBN)
        if (msgISBNData) {
            return res.status(400).send({ status: false, message: msgISBNData })
        }

        const isISBNUnique = await bookModel.findOne({ ISBN });
        if (isISBNUnique) {
            return res.status(400).send({ status: false, message: `ISBN: ${ISBN} already exist` });
        }

        let msgcategoryData = isValidUserData.isValidNameData(category)
        if (msgcategoryData) {
            return res.status(400).send({ status: false, message: msgcategoryData })
        }

        let msgSubCategoryData = isValidUserData.isValidNameData(subcategory)
        if (msgSubCategoryData) {
            return res.status(400).send({ status: false, message: msgSubCategoryData })
        }

        let msgReleasedAtData = isValidUserData.isValidReleasedAt(releasedAt)
        if (msgReleasedAtData) {
            return res.status(400).send({ status: false, message: msgReleasedAtData })
        }

        //Create book data after format //title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt
        const bookData = {
            title: title,
            excerpt: excerpt,
            userId: userId,
            ISBN: ISBN,
            category: category,
            subcategory: subcategory,
            releasedAt: releasedAt
        };

        const createBook = await bookModel.create(bookData);
        return res.status(201).send({ status: true, message: "new book create successfully", data: createBook });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//========================================>  (( Get books, api call )) <=========================================//

const getBooks = async (req, res) => {
    try {
        let data = req.query;
        let Id = req.Id
        data["isDeleted"] = false
        data["userId"] = Id
        let bookData = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (bookData.length < 1) {
            return res.status(403).send({ status: false, message: `unauthorized access` })
        }
        return res.status(200).send({ status: true, message: 'Books list', data: bookData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//========================================>  (( Get a book by Id, api call )) <=========================================//

const getBookById = async (req, res) => {
    try {
        let data = req.params.bookId;

        // using destructuring of req.let data.
        const { _id, title, excerpt, userId, ISBN, category, subcategory,
            reviews, deletedAt, isDeleted, releasedAt, createdAt, updatedAt } = req.let;

        const BookId = await reviewModel.find({ bookId: data, isDeleted: false }).select({
            _id: 1, bookId: 1,
            reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1
        });

        if (!BookId) {
            return res.status(404).send({ status: false, message: `no book found by ${data}` });
        }
        //send book data after format
        let saveData = {
            _id: _id, title: title, excerpt: excerpt, userId: userId,
            ISBN: ISBN, category: category, subcategory: subcategory,
            reviews: reviews, deletedAt: deletedAt, isDeleted: isDeleted,
            releasedAt: releasedAt, createdAt: createdAt, updatedAt: updatedAt,
            reviewsData: BookId
        }
        return res.status(200).send({ status: true, message: 'Books list', data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//========================================>  (( Update Book By Id, api call )) <=========================================//

const updateBookById = async (req, res) => {
    try {
        let saveData = req.body;
        let data = req.params.bookId;

        // using destructuring of req.let data.
        let { title, excerpt, releasedAt, ISBN } = saveData

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(saveData)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (title || title.trim().length == 0) {
            let msgTitleData = isValidUserData.isValidNameData(title)
            if (msgTitleData) {
                return res.status(400).send({ status: false, message: msgTitleData })
            }

            const isTitleUnique = await bookModel.findOne({ title });
            if (isTitleUnique) {
                return res.status(400).send({ status: false, message: `title: ${title} already exist` });
            }
        }

        if (excerpt || excerpt.trim().length == 0) {
            let msgExcerptData = isValidUserData.isValidNameData(excerpt)
            if (msgExcerptData) {
                return res.status(400).send({ status: false, message: msgExcerptData })
            }
        }

        if (ISBN || ISBN.trim().length == 0) {
            let msgISBNData = isValidUserData.isValidISBNData(ISBN)
            if (msgISBNData) {
                return res.status(400).send({ status: false, message: msgISBNData })
            }

            const isISBNUnique = await bookModel.findOne({ ISBN });
            if (isISBNUnique) {
                return res.status(400).send({ status: false, message: `ISBN: ${ISBN} already exist` });
            }
        }
        
        if (releasedAt || releasedAt.trim().length == 0) {
            let msgReleasedAtData = isValidUserData.isValidReleasedAt(releasedAt)
            if (msgReleasedAtData) {
                return res.status(400).send({ status: false, message: msgReleasedAtData })
            }
        }

        const bookData = await bookModel.findByIdAndUpdate({ _id: data }, { $set: saveData }, { new: true })
        return res.status(200).send({ status: true, message: 'book data update successfully', data: bookData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//========================================>  (( Delete Book By Id, api call )) <=========================================//

const deleteBookById = async (req, res) => {
    try {
        let data = req.params.bookId;
        let bookDeleteAt = new Date()
        await bookModel.findByIdAndUpdate({ _id: data }, { $set: { isDeleted: true, deletedAt: bookDeleteAt} }, { new: true })
        return res.status(200).send({ status: true, message: 'book data deleted successfully', })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}





module.exports = { createBooks, getBooks, getBookById, updateBookById, deleteBookById }