import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true,
            convert: false,
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
