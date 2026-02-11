import { ApiResponse, isErrorResponse } from '@/types/api-response';

export class ApiErrorException extends Error {
  constructor(
    public statusCode: number,
    public code: string | null,
    public errors: any | null,
    message: string
  ) {
    super(message);
    this.name = 'ApiErrorException';
  }
}

/**
 * Unwrap API response and throw error if response is an error
 * @param response - The API response
 * @returns The payload from success response
 * @throws ApiErrorException if response is an error
 */
export function unwrap<T = any>(response: ApiResponse<T>): T {
  if (isErrorResponse(response)) {
    throw new ApiErrorException(
      response.statusCode,
      response.code,
      response.errors,
      response.message
    );
  }
  return response.payload;
}

/**
 * Extract payload from success response or null
 * @param response - The API response
 * @returns The payload from success response or null
 */
export function unwrapOr<T = any>(
  response: ApiResponse<T>,
  defaultValue: T
): T {
  if (isErrorResponse(response)) {
    return defaultValue;
  }
  return response.payload;
}

/**
 * Handle API error safely
 * @param error - The error object
 * @returns ApiErrorException or generic error
 */
export function handleApiError(error: unknown): ApiErrorException {
  if (error instanceof ApiErrorException) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiErrorException(500, 'INTERNAL_ERROR', null, error.message);
  }

  return new ApiErrorException(
    500,
    'UNKNOWN_ERROR',
    null,
    'An unknown error occurred'
  );
}
