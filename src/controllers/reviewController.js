const isValidUserData = require('../dataValidation/inputDataValidation')
const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const moment = require("moment")
const mongoose = require('mongoose')
//========================================>  (( create Review By Id, api call )) <=========================================//

const createReviewById = async (req, res) => {
    try {
        let data = req.params.bookId;
        // using destructuring of body data.
        const { bookId, reviewedBy, rating, review } = req.body;

        if (data != bookId) {
            return res.status(400).send({ status: false, message: "Make sure path params bookId and body bookId are same" })
        }

        //book id validation
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "bookId is not valid" });
        }

        const BookId = await bookModel.findOne({ _id: data, isDeleted: false })
        if (!BookId) {
            return res.status(404).send({ status: false, message: `no book found by ${data}` });
        }

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        let msgReviewedByData = isValidUserData.isValidName(reviewedBy)
        if (msgReviewedByData) {
            return res.status(400).send({ status: false, message: msgReviewedByData })
        }

        let msgRatingData = isValidUserData.isValidRating(rating)
        if (msgRatingData) {
            return res.status(400).send({ status: false, message: msgRatingData })
        }

        let msgReviewData = isValidUserData.isValidNameData(review)
        if (msgReviewData) {
            return res.status(400).send({ status: false, message: msgReviewData })
        }
        //Create book data after format //bookId, reviewedBy, rating, review
        let reviewedAt = new Date()
        const bookData = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: reviewedAt,
            rating: rating,
            review: review,
        };

        const createreview = await reviewModel.create(bookData);
        await bookModel.findByIdAndUpdate({ _id: data }, { $set: { reviews: BookId.reviews + 1 }, }, { new: true });
        return res.status(201).send({ status: true, message: "review send successfully", data: createreview });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//========================================>  (( update Review By Id, api call )) <=========================================//

const updateReviewById = async (req, res) => {
    try {
        let data = req.params.bookId;
        let reviewId = req.params.reviewId
        // using destructuring of body data. //review, rating, reviewer's
        const { reviewedBy, rating, review } = req.body;

        //book id validation
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "bookId is not valid" });
        }

        const BookId = await bookModel.findOne({ _id: data, isDeleted: false })
        if (!BookId) {
            return res.status(404).send({ status: false, message: `no book found by ${data}` });
        }

        //review id validation
        if (mongoose.Types.ObjectId.isValid(reviewId) == false) {
            return res.status(400).send({ status: false, message: "reviewId is not valid" });
        }

        const ReviewId = await reviewModel.findOne({ _id: reviewId, bookId: data, isDeleted: false });
        if (!ReviewId) {
            return res.status(404).send({ status: false, message: `no review found by ${reviewId}`  });
        }

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(req)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (reviewedBy) {
            let msgReviewedByData = isValidUserData.isValidName(reviewedBy)
            if (msgReviewedByData) {
                return res.status(400).send({ status: false, message: msgReviewedByData })
            }
        }

        if (rating) {
            let msgRatingData = isValidUserData.isValidRating(rating)
            if (msgRatingData) {
                return res.status(400).send({ status: false, message: msgRatingData })
            }
        }

        if (review) {
            let msgReviewData = isValidUserData.isValidNameData(review)
            if (msgReviewData) {
                return res.status(400).send({ status: false, message: msgReviewData })
            }
        }

        const reviewData = await reviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: req.body }, { new: true })
        return res.status(200).send({ status: true, message: 'review data update successfully', data: reviewData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//========================================>  (( delete Review By Id, api call )) <=========================================//

const deleteReviewById = async (req, res) => {
    try {
        let data = req.params.bookId;
        let reviewId = req.params.reviewId

        //book id validation
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "bookId is not valid" });
        }

        const BookId = await bookModel.findOne({ _id: data, isDeleted: false })
        if (!BookId) {
            return res.status(404).send({ status: false, message: `no book found by ${data}` });
        }

        //review id validation
        if (mongoose.Types.ObjectId.isValid(reviewId) == false) {
            return res.status(400).send({ status: false, message: "reviewId is not valid" });
        }

        const ReviewId = await reviewModel.findOne({ _id: reviewId, bookId: data, isDeleted: false });
        if (!ReviewId) {
            return res.status(404).send({ status: false, message: `no review found by ${reviewId}`  });
        }

        await reviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true })
        await bookModel.findByIdAndUpdate({ _id: data }, { $set: { reviews: BookId.reviews - 1 }, }, { new: true });
        return res.status(200).send({ status: true, message: 'your review deleted successfully', })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createReviewById, updateReviewById, deleteReviewById }