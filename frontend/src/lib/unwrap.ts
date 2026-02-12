import { ApiResponse } from '@/types/api-response';

export function unwrap<T>(res: ApiResponse<T>): T {
  if (res.status === 'success') return res.payload;
  throw new Error(res.message);
}
