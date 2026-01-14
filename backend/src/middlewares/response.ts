import { NextFunction, Request, RequestHandler, Response } from 'express';

const apiResponse: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (res as any).success = (
    payload: any = null,
    message = 'Success',
    meta: any = null,
    status = 200
  ) => {
    return res.status(status).json({
      status: 'success',
      message,
      payload,
      meta,
    });
  };

  (res as any).error = (
    message = 'Something went wrong',
    code: string | null = null,
    status = 500,
    errors: any = null
  ) => {
    return res.status(status).json({
      status: 'error',
      statusCode: status,
      message,
      code,
      errors,
    });
  };

  next();
};

export default apiResponse;
