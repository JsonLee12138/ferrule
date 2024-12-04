export enum HttpContentType {
  JSON = 'application/json;charset=UTF-8',
  URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM = 'multipart/form-data;charset=UTF-8',
}

export enum HttpResponseStatus {
  SUCCESS = 0,
  AUTH_EXPIRED = 7
}
