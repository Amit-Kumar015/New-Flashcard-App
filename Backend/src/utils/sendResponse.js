export default function sendResponse(res, statusCode, message, data = null){
    return res.status(statusCode).json({
        status: statusCode < 400 ? "success" : "fail",
        message,
        data
    })
}