const passValidation = require('./passwordValidation')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment')

/** 
 * @param {string} value: bodyData validation function.
 */

const isValid = (value)=> {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValids = (value)=> {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "number") return true;
};

const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};

// All input data validation

/**
 * @param {string} value: bodyData
 */

const isValidRequest = (value) => {
    // if body empty
    if (!isValidRequestBody(value)) {
        return "data is required";
    }
}


/**
 * @param {string} value: titleValue
 */

const isValidTitle = (value) => {
    if (!isValid(value)) {
        return `title is required and should be valid format like: Mr/Mrs/Miss`;
    }

    if (!["Mr", "Mrs", "Miss"].includes(value.trim())) {
        return `title must be provided from these values: Mr/Mrs/Miss`;
    }
}


/**
 * @param {string} value: nameValue
 */

const isValidName = (value) => {

    if (!isValid(value)) {
        return `Data is required`;
    }

    let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/

    if (!regex.test(value)) {
        return `${value} should be in valid format`;
    }
}

/**
 * @param {string} value: phoneValue
 */


const isValidPhone = (value) => {
    if (!isValid(value)) {
        return "Phone number is required" ;
    }

    const regexForMobile = /^((0091)|(\+91)|0?)[6789]{1}\d{9}$/;
    if (!regexForMobile.test(value)) {
        return "mobile should be of 10 digits.";
    }

}

/**
 * @param {string} value: emailValue
 */


const isValidEmail = (value) => {
    if (!isValid(value)) {
        return "email is required and should be a string";
    }
    const regexForEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (!regexForEmail.test(value)) {
        return  `${value} should be in valid format`;
    }
}

/**
 * @param {string} value: passwordValue
 */

const isValidpass = (value) => {
    if (!isValid(value)) {
        return "password is required.";
    }

    let message = passValidation.checkPasswordValidity(value);
    if (message) {
        return message;
    }
}

/**
 * @param {string} value: addressValue
 */


const isValidAddress = (value) => {

    if (!isValidRequestBody(value)) {
        return "address data is required to create a new user";
    }

    if (typeof value.street != "string") {
        return "street is name string";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.street)) {
        return "Invalid street name.";
    }

    if (!isValid(value.city)) {
        return "city is required and should be a string";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.city)) {
        return "city should be a letter.";
    }
    
    if (! /^\+?([1-9]{1})\)?([0-9]{5})$/.test(value.pincode)) {
        return "invalid pin"
    }
}


/**
 * @param {string} value: titleValue & Excerpt
 */

 const isValidNameData = (value) => {
    if (!isValid(value)) {
        return `data is required and should be string.`;
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value)) {
        return `${value} should be a letter.`;
    }
}


/**
 * @param {string} value: emailValue
 */


const isValidISBNData = (value) => {
    if (!isValid(value)) {
        return "ISBN number is required and should be a string";
    }
    if (!value.trim().length > 0) {
        return "ISBN number is required and should be a string";
    }
    const regex = /^(?:ISBN(?:-1[03])?:?\ *((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX]))$/i
    if (!regex.test(value)) {
        return "ISBN number should be in valid format (like:- ISBN 1561616161)";
    }
}


/**
 * @param {string} value: Valid Rating
 */

 const isValidRating = (value) => {
    if (!isValids(value)) {
        return "Rating is required and should be a number";
    }

    if(value < 1 || 5 < value){
        return "Rating must be between 1 and 5"
    }
}

/**
 * @param {string} value: passwordValue
 */

 const isValidReleasedAt = (value) => {
    if (!isValid(value)) {
        return "Date is required.";
    }
    let date = moment(value, 'YYYY-MM-DD',true).isValid()
    if (!date) {
        return "Please enter valid date";
    }
}



module.exports = {
     isValidRequest, isValidTitle, isValidName, isValidPhone, isValidEmail , isValidpass, isValidAddress ,
     isValidRequest, isValidNameData, isValidISBNData , isValidRating , isValidReleasedAt }