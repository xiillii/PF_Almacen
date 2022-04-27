import { body, validationResult } from 'express-validator';

const movementTypeValidationRules = () => {
  return [
    body('code')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Code must have more than 1 characters'),
    body('name')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Name must have more than 1 characters'),
    body('operation')
      // .exists({ checkFalsy: true })
      .isInt({ min: -1, max: 1 })
      .withMessage('Operation must be -1 or 1'),
  ];
};

const movementTypeValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export { movementTypeValidationRules, movementTypeValidate };
