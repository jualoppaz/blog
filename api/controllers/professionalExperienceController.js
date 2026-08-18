const professionalExperiences = require('../data/professionalExperiences.json');

function sortTechnologiesByName(technologies) {
  return [...technologies].sort((a, b) => a.name.localeCompare(b.name));
}

function sortProjectsByStartDate(projects) {
  return [...projects].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
}

function mapProject(project) {
  return {
    ...project,
    technologies: sortTechnologiesByName(project.technologies),
  };
}

function mapClient(client) {
  return {
    ...client,
    projects: sortProjectsByStartDate(client.projects.map(mapProject)),
  };
}

function findAllProfessionalExperiences(req, res) {
  const result = professionalExperiences.map((experience) => {
    const clone = { ...experience };

    if (clone.projects && clone.projects.length) {
      clone.projects = sortProjectsByStartDate(clone.projects.map(mapProject));
    }

    if (clone.clients && clone.clients.length) {
      clone.clients = clone.clients.map(mapClient);
    }

    return clone;
  });

  result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return res.status(200).send(JSON.stringify(result, null, 4));
}

module.exports = {
  index: findAllProfessionalExperiences,
};
