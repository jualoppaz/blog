const Company = require('../models/company');

function findAllCompanies(req, res) {
  Company.find((err, companies) => {
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

    return res.status(200).send(JSON.stringify(companies, null, 4));
  });
}

module.exports = {
  index: findAllCompanies,
};
