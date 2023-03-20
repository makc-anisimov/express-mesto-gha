const Card = require('../models/cards');
const {
  STATUS_OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/consts');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) res.status(STATUS_OK).send(cards);
      else res.status(NOT_FOUND).send({ message: 'Карточки не найдены' });
    })
    .catch(() => {
      res.stats(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(() => res.status(STATUS_OK).send(req.body))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((result) => {
      console.log('result', result);

      if (result !== null) {
        res.status(STATUS_OK).send({ message: 'карточка удалена' });
      } else res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      console.log('err catch del', err);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((result) => {
      if (result !== null) {
        res.status(STATUS_OK).send();
      } else res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((result) => {
      if (result !== null) {
        res.status(STATUS_OK).send();
      } else res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
