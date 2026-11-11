import { NextResponse } from "next/server";

class ApiResponse {
  static ok(message: string, data: any = null) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 200 }
    );
  }
  static created(message: string, data: any = null) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 201 }
    );
  }
}

export default ApiResponse;