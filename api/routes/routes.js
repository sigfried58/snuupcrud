
module.exports = function(app) {
  var controller = require('../controllers/controller');

  // controller Routes
  app.get('/', controller.list);
  app.post('/login', controller.login);
  app.post('/add', controller.save);
  app.delete('/delete/:id', controller.delete);
  app.put('/put/:id', controller.edit);

  app.use(function(req, res) {
  	res.status(404).send({url: req.originalUrl + ' not found'})
	});
};