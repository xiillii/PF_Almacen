import { body, validationResult } from 'express-validator';

const userValidationRules = () => {
  return [
    body('email')
      .trim()
      .escape()
      .normalizeEmail()
      .isEmail({ checkFalsy: true })
      .withMessage('Must be a valid email'),
    body('name')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Name is mandatory'),
    body('password')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Password is mandatory'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export { userValidationRules, validate };
