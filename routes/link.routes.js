const {Router} = require('express');
const config = require("config");
const {workWithDB} = require('../db');
const auth = require('../middleware/auth.middleware');
const shortid = require('shortid');

const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;

        const code = shortid.generate();

        const existing = (await workWithDB.find('*', '\`from\`', from, config.get('linksTable')))[0];

        if (existing) {
            return res.json({link: existing});
        }

        const to = baseUrl + '/t/' + code;
        const data = ['NULL', `'${from}'`, `'${to}'`, `'${code}'`, 'NOW()', 0, req.user.userID];

        await workWithDB.insertData(data, config.get('linksTable'));

        const returnData = (await workWithDB.find('*', 'code', [code], config.get('linksTable')))[0];

        res.status(201).json({link: returnData});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const links = await workWithDB.find('*', 'owner', [req.user.userID], config.get('linksTable'));
        res.json(links);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const link = (await workWithDB.find('*', 'id', [req.params.id], config.get('linksTable')))[0];
        res.json(link);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
    }
});

module.exports = router;