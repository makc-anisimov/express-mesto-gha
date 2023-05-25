const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateProfileValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');
const {
  NOT_FOUND,
} = require('../utils/consts');
const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getUser);

router.patch('/me', auth, updateProfileValidation, updateProfile);
router.patch('/me/avatar', auth, updateAvatarValidation, updateAvatar);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

module.exports = router;
