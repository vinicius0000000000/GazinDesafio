const express = require('express');
const router = express.Router();
const devsController = require('../controllers/devsController')

router.get('/', devsController.getDevs);
router.post('/', devsController.createDev);
router.put('/:id', devsController.updateDev);
router.delete('/:id', devsController.deleteDev);

module.exports = router;