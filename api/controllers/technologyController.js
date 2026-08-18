const technologies = require('../data/technologies.json');

function findAllTechnologies(req, res) {
  return res.status(200).send(JSON.stringify(technologies, null, 4));
}

function findTechnologyById(req, res) {
  const technology = technologies.find(
    // eslint-disable-next-line no-underscore-dangle
    (item) => item._id === req.params.technology_id,
  ) || null;

  return res.status(200).send(JSON.stringify(technology, null, 4));
}

module.exports = {
  index: findAllTechnologies,
  show: findTechnologyById,
};
