import { body, validationResult } from 'express-validator';

const categoryValidationRules = () => {
  return [
    body('code')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Code must have more than 1 characters'),
    body('description').trim().escape(),
  ];
};

const categoryValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export { categoryValidationRules, categoryValidate };
