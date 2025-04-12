import express from 'express'
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})
const router = express.Router();
import { loginController, logoutController, profileController, registerController, resetPasswordController, updatePasswordController, updateProfileController, updateProfilePicController } from '../controller/userController.js'
import { isAuth } from '../middleware/authMiddelware.js';
import { singleUpload } from '../middleware/multer.js';


router.post('/register', limiter, registerController);
router.post('/login', limiter, loginController);
router.get('/profile', isAuth, profileController)
router.get("/logout", logoutController)
router.put('/update-profile', isAuth, updateProfileController)
router.put('/update-password', isAuth, updatePasswordController)
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)
router.post("/reset-password", resetPasswordController)

export default router;