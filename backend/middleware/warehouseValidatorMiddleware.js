import { body, validationResult } from 'express-validator';

const warehouseValidationRules = () => {
  return [
    body('code')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Code must have more than 1 character'),
    body('name')
      .trim()
      .escape()
      .exists({ checkFalsy: true })
      .withMessage('Name must have more than 1 character'),
  ];
};

const warehouseValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export { warehouseValidate, warehouseValidationRules };
