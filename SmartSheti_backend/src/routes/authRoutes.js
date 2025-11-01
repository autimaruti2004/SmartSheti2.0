const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.get('/me', authMiddleware, me);
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await findUserById(req.user.sub);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;


