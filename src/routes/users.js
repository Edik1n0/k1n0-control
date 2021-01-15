const express = require('express');
const router = express.Router();

const pool = require('../db'); // Primero: conectar a la base de datos

router.get('/agregar', (req, res) => { // Añadir un usuario nuevo
    res.render('users/agregar'); // Segundo: en sitio/control/agregar (Ver index).
});

router.post('/agregar', async (req, res) => {
    const { fullname, username, password, phone, email } = req.body;
    const newCommonUser = {
        fullname,
        username,
        password,
        phone,
        email
    };
    // console.log(newCommonUser);  Comprueba que se están recibiendo los datos
    await pool.query('INSERT INTO users SET ?', [newCommonUser]) // Tercero: guarda en la db
    req.flash('success', 'Usuario registrado correctamente');
    res.redirect('/control/users');
});

router.get('/users', async (req, res) => {
   const users = await pool.query('SELECT * FROM users'); // Cinco: Consulta la db
   // console.log(users); // comprueba que se reciben los datos
   res.render('users/lista', {users}); // Llamar en html
});

router.get('/users/delete/:id', async (req, res) => {
    const { id } = req.params; // Eliminar usuario
    // console.log(id); // comprueba que se reciben los datos
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    req.flash('success', 'Usuario eliminado correctamente');
    res.redirect('/control/users');
});

// Editar usuario
router.get('/users/editar/:id', async (req, res) => {
    const { id } = req.params;
    // console.log(id); // comprueba que se reciben los datos
    const users = await pool.query('SELECT * FROM users WHERE id= ?', [id])
    console.log(users[0]);
    res.render('users/editar', {user: users[0]});
});

router.post('/users/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { fullname, username, password, phone, email } = req.body;
    const newCommonUser = {
        fullname,
        username,
        password,
        phone,
        email
    };
    await pool.query('UPDATE users SET ? WHERE id = ?', [newCommonUser, id]);
    req.flash('success', 'Usuario actualizado correctamente');
    res.redirect('/control/users');
});

module.exports = router;