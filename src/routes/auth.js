const express = require('express');
const router = express.Router();
const passport = require('passport'); // importo el método
const { isLoggedIn, isNotLoggedIn } = require('../lib/auths');

router.get('/control/registro', isNotLoggedIn, (req, res) => {
    res.render('cauth/registro') // Renderiza el formulario
});

router.post('/control/registro', isNotLoggedIn, passport.authenticate('local.registro', {
    successRedirect: '/control/perfil',
    failureRedirect: '/control/registro',
    failureFlash: true
}));

router.get('/control/inicio', isNotLoggedIn, (req, res) => {
    res.render('cauth/inicio')
});

router.post('/control/inicio', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.inicio', {
        successRedirect: '/control/perfil',
        failureRedirect: '/control/inicio',
        failureFlash: true
    })(req, res, next);
}) // autenticación

router.get('/control/perfil', isLoggedIn, (req, res) => {
    res.render('perfil');
});

router.get('/control/cerrar', isLoggedIn, (req,res) => {
    req.logout();
    res.redirect('/control/inicio')
});

module.exports = router;