const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateProfileValidation,
  updateAvatarValidation,
  getUserValidation,
} = require('../middlewares/validation');
const {
  getUserMe,
  getUser,
  getUsers,
  updateProfile,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getUserMe);
router.get('/:userId', auth, getUserValidation, getUser);

router.patch('/me', auth, updateProfileValidation, updateProfile);
router.patch('/me/avatar', auth, updateAvatarValidation, updateProfile);

module.exports = router;
