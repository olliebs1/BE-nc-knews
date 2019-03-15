
const endPoints = require('../endpoints.json');


const getApi = (req, res, next) => {
  console.log('reaching here')
  res.status(200).send(endPoints).catch(err => {
    next(err)
  })
}


module.exports = { getApi }