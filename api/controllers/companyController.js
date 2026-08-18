const companies = require('../data/companies.json');

function findAllCompanies(req, res) {
  return res.status(200).send(JSON.stringify(companies, null, 4));
}

module.exports = {
  index: findAllCompanies,
};
