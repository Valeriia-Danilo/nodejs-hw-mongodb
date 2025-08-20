import createHttpError from "http-errors";

export const validateQuery = (schema) => async (req, res, next) => {
    try {
       await schema.validateAsync(req.query, {
            abortEarly: false,
            allowUnknown: false,
           convert: true,
           errors: { wrap: { label: false } },
        });
        next();
    } catch (err) {
        const error = createHttpError(400, 'Bad request', {
        errors: err.details.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    });
        next(error);
    };
};
