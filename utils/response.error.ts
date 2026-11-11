import { NextResponse } from "next/server";

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Not Found") {
    return new ApiError(404, message);
  }

  static conflict(message: string = "Conflict") {
    return new ApiError(409, message);
  }

  static serverError(message: string = "Internal Server Error") {
    return new ApiError(500, message);
  }
  static handleResponse(error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export default ApiError;
