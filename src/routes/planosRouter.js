const planos = require('express').Router();
const planosController = require('../app/controllers/planosController');

planos.get('/api/planos', planosController.index);
planos.post('/api/planos', planosController.store);
planos.delete('/api/planos/:_id', planosController.delete);
planos.put('/api/planos/:_id', planosController.updatePlano);

module.exports = planos;
