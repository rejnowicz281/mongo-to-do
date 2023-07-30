import debug from "debug";

const logger = debug("app:asyncHandler");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        logger(err);
        next();
    });
};

export default asyncHandler;
