const Knowledge = require('../models/knowledge');
const KnowledgeType = require('../models/knowledgeType');
const Technology = require('../models/technology');

function findAllKnowledge(req, res) {
  const knowledgeTypeParams = {};

  if (req.query.type) {
    knowledgeTypeParams.name = req.query.type;
  }

  Knowledge.find((err, knowledge) => {
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

    return Technology.populate(knowledge, { path: 'technology' }, (
      err2,
      knowledge2,
    ) => {
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

      return KnowledgeType.populate(
        knowledge2,
        {
          path: 'type',
        },
        (err3, knowledge3) => {
          if (err3) {
            return res.status(400).send(
              JSON.stringify(
                {
                  message: err3,
                },
                null,
                4,
              ),
            );
          }

          if (knowledgeTypeParams.name) {
            // eslint-disable-next-line no-param-reassign
            knowledge3 = knowledge3.filter((item) => item.type.name === knowledgeTypeParams.name);
          }

          knowledge3.sort((a, b) => a.technology.name.localeCompare(
            b.technology.name,
          ));

          return res.status(200).send(JSON.stringify(knowledge3, null, 4));
        },
      );
    });
  });
}

module.exports = {
  index: findAllKnowledge,
};
