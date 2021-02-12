const path = require('path');

const express = require('express');

const errorController = require('../controllers/error');

const router = express.Router();

router.use(errorController.pageNotFound);

exports.routes = router;