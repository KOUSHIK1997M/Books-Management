const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")

const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")

//------------------------------------------> (This is test api ) <--------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


// ===========================================> ( User APIs ) <================================================///

//When Create a user, call this api

router.post("/register", userController.createUser)

//When Login a user,  call this api

router.post("/login", userController.loginUser)




// =======================================> ( Books API )  <===================================================///

//When Create a book, call this api

router.post("/books", authentication.authentication, authorization.authorizetionByBody,bookController.createBooks)

//When get books,  call this api

router.get("/books",authentication.authentication, authorization.authorizetionByQuery, bookController.getBooks)

//When Get book by bookId, call this api

router.get("/books/:bookId",authentication.authentication, authorization.authorizetionByParams , bookController.getBookById)

//When Update book by Id,  call this api

router.put("/books/:bookId",authentication.authentication, authorization.authorizetionByParams , bookController.updateBookById)

//When Delete a book by id, call this api

router.delete("/books/:bookId",authentication.authentication, authorization.authorizetionByParams , bookController.deleteBookById)



// ===========================================> ( Review APIs ) <============================================///

//When Book review by id, call this api

router.post("/books/:bookId/review", reviewController.createReviewById)

//When Update book review by id,  call this api

router.put("/books/:bookId/review/:reviewId" , reviewController.updateReviewById)

//When Delete book review by id,  call this api

router.delete("/books/:bookId/review/:reviewId" , reviewController.deleteReviewById)





//====================================> >( END ALL APIS ) <===================================================//





module.exports = router;
