const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const createOrganization = async (req, res) => {
    const { name, whatsapp_phone_id, whatsapp_token, openai_token, message_limit } = req.body;
    try {
        const org = await prisma.organization.create({
            data: {
                name,
                whatsapp_phone_id,
                whatsapp_token,
                openai_token,
                message_limit: parseInt(message_limit) || 1000
            }
        });
        res.status(201).json(org);
    } catch (err) {
        console.error('Error creating organization:', err);
        res.status(500).json({ error: 'Failed to create organization' });
    }
};

const updateOrganization = async (req, res) => {
    const { id } = req.params;
    const { name, whatsapp_phone_id, whatsapp_token, openai_token, message_limit } = req.body;
    try {
        const org = await prisma.organization.update({
            where: { id },
            data: {
                name,
                whatsapp_phone_id,
                whatsapp_token,
                openai_token,
                message_limit: parseInt(message_limit)
            }
        });
        res.status(200).json(org);
    } catch (err) {
        console.error('Error updating organization:', err);
        res.status(500).json({ error: 'Failed to update organization' });
    }
};

const createUser = async (req, res) => {
    const { email, password, name, organization_id, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                organization_id,
                role: role || 'USER'
            }
        });
        res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const getOrganizations = async (req, res) => {
    try {
        const orgs = await prisma.organization.findMany({
            include: { _count: { select: { contacts: true, messages: true } } }
        });
        res.status(200).json(orgs);
    } catch (err) {
        console.error('Error fetching organizations:', err);
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
};

module.exports = {
    createOrganization,
    updateOrganization,
    createUser,
    getOrganizations
};
