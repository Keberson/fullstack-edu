const {Router} = require('express');
const {workWithDB} = require('../db');
const config = require("config");

const router = Router();

router.get('/:code', async (req, res) => {
    try {
        let link = (await workWithDB.find('*', 'code', [req.params.code], config.get('linksTable')))[0];
        if (link) {
            link.clicks++;
        }

        await workWithDB.editData([
            'clicks'
        ], [
            link.clicks
        ], config.get('linksTable'), `code='${link.code}'`);

        return res.redirect(link.from);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
    }
});

module.exports = router;