const { Router } = require('express');
const { simController } = require('../controllers/simController.js');
const { loginController } = require('../controllers/loginController.js');
const { messageController } = require('../controllers/messageController.js');

const simRouter = new Router();

simRouter.post('/login', loginController.userLogin);
simRouter.post('/simulations', simController.fetchSimList);
simRouter.post('/messages/recieve', messageController.getMessage);
simRouter.post('/messages/send', messageController.postMessage);
simRouter.get('/catalog', simController.fetchCatalog);
simRouter.get('/enviorment', simController.updateEnviormentInputs);



module.exports = { simRouter };

