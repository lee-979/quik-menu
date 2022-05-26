const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const storeValidation = require('../../validations/store.validation');
const storeController = require('../../controllers/store.controller');

const router = express.Router();

router.route('/').post(auth(), validate(storeValidation.createStore), storeController.createStore);

router
  .route('/virtual-accounts')
  .post(auth(), validate(storeValidation.generateVirtualAccount), storeController.addVirtualAccount);

module.exports = router;
