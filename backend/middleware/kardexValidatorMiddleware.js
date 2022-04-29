import { body, validationResult } from 'express-validator';

const kardexValidationRules = () => {
  return [
    body('insertedDate')
      .trim()
      .isISO8601()
      .toDate()
      .withMessage('InsertedDate must be a date'),
    body('warehouseId')
      .exists({ checkFalsy: true })
      .trim()
      .isMongoId()
      .withMessage('WarehouseId is required'),
    body('productId')
      .exists({ checkFalsy: true })
      .trim()
      .isMongoId()
      .withMessage('ProductId is required'),
    body('quantity')
      .exists({ checkFalsy: true })
      .isFloat({ gt: 0.0 })
      .withMessage('Quantity must be greater than zero'),
    body('cost')
      .exists({ checkFalsy: true })
      .isFloat({ min: 0.0 })
      .withMessage('Cost must be greater or equal than zero'),
    body('movementTypeId')
      .exists({ checkFalsy: true })
      .trim()
      .isMongoId()
      .withMessage('MovementTypeId is required'),
  ];
};

const kardexValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export { kardexValidationRules, kardexValidate };
