const { sendError } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
    }

    next();
  };
};

module.exports = validate;
