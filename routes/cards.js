const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createCardValidation,
  changeСardValidation,
} = require('../middlewares/validation');
const NOT_FOUND = require('../utils/consts');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, createCardValidation, createCard);
router.delete('/:cardId', auth, changeСardValidation, deleteCard);
router.put('/:cardId/likes', auth, changeСardValidation, addLike);
router.delete('/:cardId/likes', auth, changeСardValidation, deleteLike);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

module.exports = router;
