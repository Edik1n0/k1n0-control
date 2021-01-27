const express = require('express');
const router = express.Router();
const flash = require('connect-flash');

const pool = require('../db');
const { isLoggedIn } = require('../lib/auths');

router.get('/control/tareas', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links'); // Cinco: Consulta la db
    //console.log(links); // comprueba que se reciben los datos
    res.render('tareas/tareas', {links}); // Llamar en html
 });

 router.get('/control/tareas/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; // Eliminar usuario
    // console.log(id); // comprueba que se reciben los datos
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Tarea eliminada correctamente');
    res.redirect('/control/tareas');
});

module.exports = router;