import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

export default function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500

    return sendResponse(res, statusCode, err.message, null)
}