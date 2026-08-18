const knowledge = require('../data/knowledge.json');

function findAllKnowledge(req, res) {
  let result = knowledge;

  if (req.query.type) {
    result = result.filter((item) => item.type.name === req.query.type);
  }

  result = [...result].sort(
    (a, b) => a.technology.name.localeCompare(b.technology.name),
  );

  return res.status(200).send(JSON.stringify(result, null, 4));
}

module.exports = {
  index: findAllKnowledge,
};
