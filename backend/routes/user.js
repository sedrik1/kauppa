const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user');

const router = express.Router();

router.put('/changeUserEmail', [
  body('newEmail', 'Sähköpostiosoite on virheellinen')
  .isEmail()
  .normalizeEmail(),
  body('oldEmail', 'Sähköpostiosoite on virheellinen')
  .isEmail()
  .normalizeEmail()
], userController.changeUserEmail
);

router.put('/changeUserPassword', [
  body('email', 'Sähköpostiosoite on virheellinen')
  .isEmail()
  .normalizeEmail(),
  body('newPassword', 'Salasana ei täsmää')
  .not()
  .isEmpty()
  .trim()
  .escape()
], userController.changeUserPassword
);

router.post('/signup', [
  body('email', 'Sähköpostiosoite on virheellinen')
  .isEmail()
  .normalizeEmail(),
  body('pwd', 'Salasanat eivät täsmää')
  .not()
  .isEmpty()
  .trim()
  .escape()
  .custom((val, { req }) => {
    if (val !== req.body.confirmPwd) {
      throw new Error('Salasanat eivät täsmää');
    } else {
      return true;
    }
  })
], userController.createUser
);

router.post('/login', [
  body('email', 'Sähköpostiosoite on virheellinen')
  .isEmail()
  .normalizeEmail(),
  body('pwd', 'Salasanat eivät täsmää')
  .not()
  .isEmpty()
  .trim()
  .escape()
], userController.loginUser
);

router.get('/tokenForGuest', userController.tokenForGuest);

module.exports = router;
