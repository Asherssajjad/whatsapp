const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../utils/authMiddleware');
const { 
    createOrganization, 
    updateOrganization, 
    createUser, 
    getOrganizations,
    getAdminContacts,
    getAdminMessages
} = require('../controllers/adminController');

// All routes here require admin privileges
router.use(authenticateToken);
router.use(authorizeAdmin);

router.post('/organizations', createOrganization);
router.put('/organizations/:id', updateOrganization);
router.get('/organizations', getOrganizations);
router.post('/users', createUser);
router.get('/contacts', getAdminContacts);
router.get('/messages/:phone_number', getAdminMessages);

module.exports = router;

