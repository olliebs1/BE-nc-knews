
const endPoints = require('../endpoints.json');


const getApi = (req, res, next) => {
  res.status(200).send(endPoints).catch((err) => {
    next(err);
  });
};


module.exports = { getApi };
