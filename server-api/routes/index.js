const { validate } = require('express-validation');
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

const validationOptions = { statusCode: 422 };

module.exports = function index(router) {
  const apiRouter = express.Router();
  const curriculum = express.Router();

  apiRouter.route('/technologies').get(technologyController.index);

  apiRouter
    .route('/technologies/:technology_id')
    .get(
      validate(validationsTechnology.findTechnologyById, validationOptions),
      technologyController.show,
    );

  apiRouter.route('/companies').get(companyController.index);

  curriculum
    .route('/knowledge')
    .get(
      validate(validationsKnowledge.findAllKnowledge, validationOptions),
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
