
const methodNotFound = (req, res) => {
  res.status(405).send({ msg: 'Error: Method Not Allowed' });
};

const error400 = (err, req, res, next) => {
  if (err.code === '23502' || err.code === '42703') res.status(400).send({ msg: 'Error: Bad Request' });
  else next(err);
};

const routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Error: Route Not Found' });
};


const error422 = (err, req, res, next) => {
  if (err.code === '23505') res.status(422).send({ msg: 'Error: Unprocessible Entity' });

  else next(err);
};

const error500 = (err, req, res, next) => {
  res.status(500).send({ mag: 'Error: Internal Server Error' });
};

module.exports = {
  error400, routeNotFound, methodNotFound, error422, error500,
};
