const path = require("path");

const express = require("express");

const errorController = require("../controllers/error");

const router = express.Router();

router.get('/500', errorController.internalServerError);
router.use(errorController.pageNotFound);

exports.routes = router;
