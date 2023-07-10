//express
import express from 'express'
//controllers
import {register, login, updateUser} from '../controllers/authController.js'
//middleware
import authenticateUser from '../middleware/auth.js';
import rateLimiter from 'express-rate-limit';

const router = express.Router()

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authenticateUser, updateUser);

export default router