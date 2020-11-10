const ExtraTraining = require('../models/extraTraining');

function findAllExtraTraining(req, res) {
  ExtraTraining.find((err, extraTraining) => {
    if (err) {
      return res.status(400).send(
        JSON.stringify(
          {
            message: err,
          },
          null,
          4,
        ),
      );
    }

    return res.status(200).send(JSON.stringify(extraTraining, null, 4));
  });
}

module.exports = {
  index: findAllExtraTraining,
};
