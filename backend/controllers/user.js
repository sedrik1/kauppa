const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.changeUserEmail = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    User.findOne({ email: req.body.newEmail })
    .then(user => {
      if(!user) {
        User.updateOne(
          { email: req.body.oldEmail },
          { $set: { email: req.body.newEmail } }
        )
        .then(() => {
          return res.status(200).json({
          message: 'Sähköposti vaihdettu',
          updatedEmail: req.body.newEmail
        });
        });
      } else {
        return res.status(200).json({
          message: 'Sähköposti käytössä',
          updatedEmail: req.body.oldEmail
        });
      }
    })
    .catch(err => { return res.status(201).json({ message: 'virhe' }); });
  }
};

exports.changeUserPassword = (req, res, next) => {
  let hashedPassword;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    bcrypt.hash(req.body.newPassword, 10)
    .then(hash => {
      hashedPassword = hash;
    })
    .then(() => {
      User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      )
      .then(() => {
        return res.status(201).json({ message: 'Salasana vaihdettu' });
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
  }
};

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    bcrypt.hash(req.body.pwd, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        authLevel: req.body.authLevel
      });
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'Rekisteröityminen onnistui'
        });
      })
      .catch(err => {
        console.log(err);
      });
    });
  }
};

exports.loginUser = (req, res, next) => {
  const errors = validationResult(req);
  let fetchedUser;
  if(!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(200).json({ message: 'Tarkasta syötetty sähköposti ja salasana' });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.pwd, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(200).json({ message: 'Tarkasta syötetty sähköposti ja salasana' });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser.userId },
        'secret_key_for_development_purposes_only',
        { expiresIn: '2h' }
      );
      res.status(201).json({
        email: fetchedUser.email,
        authLevel: fetchedUser.authLevel,
        userId: fetchedUser._id,
        token: token,
        expiresIn: 7200
      });
    })
    .catch(err => {
      return res.status(200).json({ message: 'Tapahtui virhe' });
    });
  }
};

exports.tokenForGuest = (req, res, next) => {

  let _id = 'guest-' + (new Date()).getTime() + Math.floor((Math.random() * 123456) + 1);

  const token = jwt.sign(
    { email: undefined, userId: _id },
    'secret_key_for_development_purposes_only',
    { expiresIn: '2h' }
  );

  res.status(201).json({
    authLevel: 'guest',
    guestId: _id,
    token: token,
    expiresIn: 7200
  });

};
