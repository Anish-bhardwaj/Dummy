const express=require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUsers = require('../controller/searchUsers');
const router=express.Router();


//create api for registration
router.post('/register',registerUser);

//create api for user validation
router.post('/email',checkEmail);

//create api for password validation
router.post('/password',checkPassword);

//create api to get user details
router.get('/userDetails',userDetails);

//create api for logout the user
router.get('/logout',logout);

//create api for update user details
router.post('/updateUserDetails',updateUserDetails);

//Create api for searching users
router.post('/searchUsers',searchUsers);

module.exports=router;