const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const { STATUS_OK } = require('../utils/consts');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_OK).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(() => res.status(STATUS_OK).send(req.body))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав доступа');
      }
      return card.deleteOne()
        .then(() => {
          res.status(STATUS_OK).send({ message: 'карточка удалена' });
        });
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.status(STATUS_OK).send();
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.status(STATUS_OK).send();
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
