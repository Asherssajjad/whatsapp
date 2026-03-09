const express = require('express');
const { verifyWebhook, handleIncomingMessage } = require('../controllers/webhookController');
const router = express.Router();

router.get('/', verifyWebhook);
router.post('/', handleIncomingMessage);

module.exports = router;
