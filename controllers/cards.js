const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(() => res.status(200).send(req.body))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then(() => res.status(200).send({ message: 'TEST! карточка удалена' }))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(() => res.status(200).send())
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: ' Переданы некорректные данные для постановки лайка' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(() => res.status(200).send())
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: ' Переданы некорректные данные для снятия лайка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
