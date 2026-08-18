const personalProjects = require('../data/personalProjects.json');

function findAllPersonalProjects(req, res) {
  const result = [...personalProjects].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate),
  );

  return res.status(200).send(JSON.stringify(result, null, 4));
}

module.exports = {
  index: findAllPersonalProjects,
};
