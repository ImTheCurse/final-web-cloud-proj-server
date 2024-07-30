const { Router } = require('express');
const { simController } = require('../controllers/simController.js');
const { loginController } = require('../controllers/loginController.js');
const { messageController } = require('../controllers/messageController.js');
const { modelController } = require('../controllers/modelController.js');

const simRouter = new Router();

simRouter.post('/login', loginController.userLogin);
simRouter.post('/session/check', loginController.checkSessionID);
simRouter.post('/simulations', simController.fetchSimList);
simRouter.post('/messages/recieve', messageController.getMessage);
simRouter.post('/messages/send', messageController.postMessage);
simRouter.post('/simulations/duplicate', modelController.duplicateModel);
simRouter.post('/simulations/delete', modelController.deleteModel);
simRouter.post('/enviorment/update', simController.updateEnvInputs);
simRouter.get('/catalog', simController.fetchCatalog);
simRouter.get('/enviorment', simController.fetchEnviormentInputs);



module.exports = { simRouter };

