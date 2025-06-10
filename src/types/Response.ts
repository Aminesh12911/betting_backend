/**
 * Status = 'success' when request succed
 * status = 'fail' when request fails with status code startswith 4
 * status = 'error' when some internal error occuered status code startwith 5
 */

export default interface IResponse {
  status: 'success' | 'fail' | 'error';
  data: any;
  message?: string;
}
