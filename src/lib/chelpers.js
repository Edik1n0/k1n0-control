const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (cpass) => { // Registro
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(cpass, salt);
    return hash;
};

helpers.matchPassword = async (cpass, savedPassword) => { // Inicia sesión
    try {
        return await bcrypt.compare(cpass, savedPassword);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;