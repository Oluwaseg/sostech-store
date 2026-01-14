import 'express';

declare module 'express-serve-static-core' {
  interface Response {
    success: (
      payload?: any,
      message?: string,
      meta?: any,
      status?: number
    ) => Response;

    error: (
      message?: string,
      code?: string | null,
      status?: number,
      errors?: any
    ) => Response;
  }
}
