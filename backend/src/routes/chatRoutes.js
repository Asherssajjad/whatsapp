const express = require('express');
const { getContacts, getMessages, sendManualMessage } = require('../controllers/chatController');
const { authenticateToken } = require('../utils/authMiddleware');
const router = express.Router();

router.use(authenticateToken);

router.get('/contacts', getContacts);
router.get('/messages/:phone_number', getMessages);
router.post('/send', sendManualMessage);


module.exports = router;
