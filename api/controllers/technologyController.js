const Technology = require('../models/technology');

function findAllTechnologies(req, res) {
  Technology.find((err, technologies) => {
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

    return res.status(200).send(JSON.stringify(technologies, null, 4));
  });
}

function findTechnologyById(req, res) {
  Technology.findById(req.params.technology_id, (err, technology) => {
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

    return res.status(200).send(JSON.stringify(technology, null, 4));
  });
}

module.exports = {
  index: findAllTechnologies,
  show: findTechnologyById,
};
