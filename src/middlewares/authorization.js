const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bookModel = require("../models/bookModel");


//======================================(authorizetion by body)================================================///

const authorizetionByBody = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.body;

        if (mongoose.Types.ObjectId.isValid(data.userId) == false) {
            return res.status(400).send({ status: false, message: "userId is not valid" });
        }
        if (data.userId != Id) {
            return res.status(403).send({ status: false, msg: "unauthorized person is not allowed" });
        }
        req.let = Id
        next()

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


//========================================(authorizetion by query)==============================================///

const authorizetionByQuery = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.query

        if (data.userId && data.userId != Id) {
            return res.status(400).send({ status: false, msg: "userId is not valid." })
        }
        next()


    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}




//========================================(authorizetion by params)==============================================///

const authorizetionByParams = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.params.bookId;
        if (!data) {
            return res.status(400).send({ status: false, msg: "Invalide params" })
        }
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "bookId is not valid" });
        }

        const BookId = await bookModel.findOne({_id: data, isDeleted: false})
        if (!BookId) {
            return res.status(404).send({ status: false, message: `no book found by ${data}` });
        }

        if (Id != BookId.userId) {
            return res.status(403).send({ status: false, message: `unauthorized access` });
        }
        req.let = BookId
        req.Data = BookId.reviews
        next()
        // res.send(blogId)

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


//======================================================================================///

module.exports = { authorizetionByBody, authorizetionByQuery, authorizetionByParams }