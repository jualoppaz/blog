const extraTraining = require('../data/extraTraining.json');

function findAllExtraTraining(req, res) {
  return res.status(200).send(JSON.stringify(extraTraining, null, 4));
}

module.exports = {
  index: findAllExtraTraining,
};
