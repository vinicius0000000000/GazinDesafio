const express = require('express');
const router = express.Router();
const niveisController = require('../controllers/niveisController')

router.get('/', niveisController.getNiveis);
router.post('/', niveisController.createNivel);
router.put('/:id', niveisController.updateNivel);
router.delete('/:id', niveisController.deleteNivel);

module.exports = router;