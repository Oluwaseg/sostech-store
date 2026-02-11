export interface SuccessResponse<T = any> {
  status: 'success';
  message: string;
  payload: T;
  meta: any | null;
}

export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  code: string | null;
  errors: any | null;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export const isSuccessResponse = <T = any>(
  response: ApiResponse<T>
): response is SuccessResponse<T> => {
  return response.status === 'success';
};

export const isErrorResponse = (
  response: ApiResponse
): response is ErrorResponse => {
  return response.status === 'error';
};
