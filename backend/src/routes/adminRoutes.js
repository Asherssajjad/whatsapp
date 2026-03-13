const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../utils/authMiddleware');
const { 
    createOrganization, 
    updateOrganization, 
    createUser, 
    getOrganizations 
} = require('../controllers/adminController');

// All routes here require admin privileges
router.use(authenticateToken);
router.use(authorizeAdmin);

router.post('/organizations', createOrganization);
router.put('/organizations/:id', updateOrganization);
router.get('/organizations', getOrganizations);
router.post('/users', createUser);

module.exports = router;
