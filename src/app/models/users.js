const mongoose = require('../../database/database');
const { Schema } = require('../../database/database');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    nickname: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    telefone: {
      type: String,
      trim: true,
      minlength: 11,
    },
    dtNascimento: {
      type: String,
    },
    paciente: {
      type: Boolean,
    },
    password: {
      type: String,
      select: false,
    },
    grupoId: {
      type: Schema.Types.ObjectId,
      ref: 'Grupos',
    },
    grupo: {
      type: String,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now() - 3 * 60 * 60 * 1000,
    },
    updatedAt: {
      type: Date,
      default: Date.now() - 3 * 60 * 60 * 1000,
    },
  },
  { strict: false },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);

UserSchema.post('updateOne', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000)
    next(new Error('E-mail/Usuario já existe, por favor tente novamente'));
  else next(error);
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (user.password) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return next(new Error('Pass not found'));
      user.password = hash;

      next();
    });
  } else {
    next();
  }
});
UserSchema.pre('updateOne', function (next) {
  const user = this;
  if (user._update.$set.password) {
    bcrypt.hash(user._update.$set.password, 10, function (err, hash) {
      if (err) return next(new Error('Pass not found'));
      user._update.$set.password = hash;

      next();
    });
  } else {
    next();
  }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
