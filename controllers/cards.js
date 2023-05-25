const Card = require('../models/cards');
const {
  STATUS_OK,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
} = require('../utils/consts');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) res.status(STATUS_OK).send(cards);
      else res.status(NOT_FOUND).send({ message: 'Карточки не найдены' });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(() => res.status(STATUS_OK).send(req.body))
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (card !== null) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndDelete(cardId)
            .then(() => {
              res.status(STATUS_OK).send({ message: 'карточка удалена' });
            });
        } else res.status(FORBIDDEN).send({ message: 'Недостаточно прав доступа' });
      } else res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      next(err);
    });
};

const addLike = (req, res, next) => {
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
      next(err);
    });
};

const deleteLike = (req, res, next) => {
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
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
