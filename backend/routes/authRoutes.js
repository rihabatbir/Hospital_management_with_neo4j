import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  getSessionUser // AJOUT
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getUserInfo);
router.get('/session', getSessionUser); // 

export default router;
