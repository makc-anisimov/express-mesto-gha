const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link })
    .then(() => res.status(200).send(req.body))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then(() => res.status(200).send({ message: 'TEST! карточка удалена' }));
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
};
