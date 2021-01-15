const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const pool = require('../db');
const chelpers = require('../lib/chelpers'); // Trae el método de encriptado

// Login
passport.use('local.inicio', new Strategy({
    usernameField: 'cuser',
    passwordField: 'cpass',
    passReqToCallback: true
}, async (req, cuser, cpass, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM cusers WHERE cuser = ?', [cuser]);
    if (rows.length > 0) {
        const cuser = rows[0];
        const validPassword = await chelpers.matchPassword(cpass, cuser.cpass);
        if (validPassword) {
            done(null, cuser, req.flash('success', 'Bienvenido', + cuser.cname));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no es correcto'));
    }
}));

// Registro
passport.use('local.registro', new Strategy({
    usernameField: 'cuser',
    passwordField: 'cpass',
    passReqToCallback: true
}, async (req, cuser, cpass, done) => {
    const { cname, cphone, cemail } = req.body;
    const newSuser = {
        cuser,
        cpass,
        cname,
        cphone,
        cemail
    };
    newSuser.cpass = await chelpers.encryptPassword(cpass);
    const result = await pool.query('INSERT INTO cusers SET ?', [newSuser]);
    newSuser.id = result.insertId;
    return done(null, newSuser); // Sesión
}));

passport.serializeUser((cuser, done) => {
    done(null, cuser.id);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM cusers WHERE id = ?', [id]);
    done(null, rows[0]);
});