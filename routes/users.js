const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUser,
  getUsers,
  // createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', auth, getUsers); // router.get('/', getUsers);
router.get('/me', auth, getUser); // router.get('/:userId', getUser);

// router.post('/', createUser);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
