const PersonalProject = require('../models/personalProject');
const Technology = require('../models/technology');

function findAllPersonalProjects(req, res) {
  PersonalProject.find((err, personalProjects) => {
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

    return Technology.populate(
      personalProjects,
      {
        path: 'technologies',
        options: {
          collation: {
            locale: 'en',
          },
          sort: {
            name: 1,
          },
        },
      },
      (err2, personalProjects2) => {
        if (err2) {
          return res.status(400).send(
            JSON.stringify(
              {
                message: err2,
              },
              null,
              4,
            ),
          );
        }

        personalProjects2.sort((a, b) => b.startDate - a.startDate);

        return res.status(200).send(JSON.stringify(personalProjects2, null, 4));
      },
    );
  });
}

module.exports = {
  index: findAllPersonalProjects,
};
