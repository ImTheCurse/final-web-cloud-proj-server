const { Router } = require('express');
const { simController } = require('../controllers/simController.js');

const simRouter = new Router();

simRouter.post('/login', simController.userLogin);
simRouter.post('/simulations', simController.fetchSimList);
simRouter.get('/catalog', simController.fetchCatalog);



module.exports = { simRouter };

