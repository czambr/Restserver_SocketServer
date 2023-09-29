// ------------------------------------------------
//  ===> Librerias
// ------------------------------------------------
const { Router } = require('express');
const { check } = require('express-validator');

// ------------------------------------------------
//  ===> Modulos + Controllers
// ------------------------------------------------
const { validarCampos, validarJWT } = require('../middlewares');
const { login, googleSigIn, renovarToken } = require('../controllers/auth');

// ------------------------------------------------
//   ===>            Inicio  Modulo            <===
// ------------------------------------------------
const router = Router();

router.get('/', validarJWT, renovarToken)


router.post(
   '/login',
   [
      check('correo', 'El correo es obligatorio').isEmail(),
      check('password', 'La contraseña no es obligatoria').not().isEmpty(),
      validarCampos,
   ],
   login
);

router.post(
   '/google',
   [check('id_token', 'id_token es necesario').not().isEmpty(), validarCampos],
   googleSigIn
);


module.exports = router;
