const ev = require('express-validation');
const express = require('express');

// Controllers
const technologyController = require('../controllers/technologyController');
const knowledgeController = require('../controllers/knowledgeController');
const personalProjectController = require('../controllers/personalProjectController');
const extraTrainingController = require('../controllers/extraTrainingController');
const companyController = require('../controllers/companyController');
const professionalExperienceController = require('../controllers/professionalExperienceController');

// Validations
const validationsTechnology = require('../validations/technologyValidations');
const validationsKnowledge = require('../validations/knowledgeValidations');

module.exports = function index(router) {
  ev.options({
    status: 422,
    statusText: 'Unprocessable Entity',
  });

  const apiRouter = express.Router();
  const curriculum = express.Router();

  apiRouter.route('/technologies').get(technologyController.index);

  apiRouter
    .route('/technologies/:technology_id')
    .get(
      ev(validationsTechnology.findTechnologyById),
      technologyController.show,
    );

  apiRouter.route('/companies').get(companyController.index);

  curriculum
    .route('/knowledge')
    .get(
      ev(validationsKnowledge.findAllKnowledge),
      knowledgeController.index,
    );

  curriculum.route('/personal-projects').get(personalProjectController.index);

  curriculum.route('/extra-training').get(extraTrainingController.index);

  curriculum
    .route('/professional-experiences')
    .get(professionalExperienceController.index);

  apiRouter.use('/cv', curriculum);

  router.use('/', apiRouter);
};
