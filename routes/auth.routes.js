const {Router} = require('express');
const {workWithDB} = require('../db');
const config = require('config')
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const {email, password} = req.body;
            const candidate = await workWithDB.find('email', 'email', email, config.get('usersTable'));

            if (candidate.length > 0) {
                return res.status(400).json({message: 'Такой пользователь уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            await workWithDB.insertData(['NULL', `'${email}'`, `'${hashedPassword}'`], config.get('usersTable'));

            res.status(201).json({message: 'Пользователь создан'});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    });

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                });
            }

            const {email, password} = req.body;

            const user = (await workWithDB.find('id, email, password', 'email', email, config.get('usersTable')))[0];

            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова'});
            }

            const token = jwt.sign(
                { userID: user.id },
                String(config.get('jwtSecret')),
                { expiresIn: '1h' }
            );

            res.json({ token, userID: user.id })
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    });

module.exports = router;