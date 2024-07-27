const { Router } = require('express');
const { simController } = require('../controllers/simController.js');

const simRouter = new Router();

simRouter.post('/login', simController.userLogin);






module.exports = { simRouter };

