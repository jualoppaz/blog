const ProfessionalExperience = require('../models/professionalExperience');

function findAllProfessionalExperiences(req, res) {
  ProfessionalExperience.find()
    .populate({
      path: 'company',
    })
    .populate({
      path: 'projects.technologies',
    })
    .populate({
      path: 'clients.company',
    })
    .populate({
      path: 'clients.projects.technologies',
    })
    .exec((err, professionalExperiences) => {
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

      professionalExperiences.forEach((professionalExperience) => {
        if (
          professionalExperience.projects
                    && professionalExperience.projects.length
        ) {
          professionalExperience.projects.forEach((project) => {
            project.technologies.sort((a, b) => a.name.localeCompare(b.name));
          });

          professionalExperience.projects.sort((a, b) => b.startDate - a.startDate);
        }

        if (
          professionalExperience.clients
                    && professionalExperience.clients.length
        ) {
          professionalExperience.clients.forEach((client) => {
            client.projects.forEach((project) => {
              project.technologies.sort((a, b) => a.name.localeCompare(b.name));
            });

            client.projects.sort((a, b) => b.startDate - a.startDate);
          });
        }
      });

      professionalExperiences.sort((a, b) => b.startDate - a.startDate);

      return res
        .status(200)
        .send(JSON.stringify(professionalExperiences, null, 4));
    });
}

module.exports = {
  index: findAllProfessionalExperiences,
};
