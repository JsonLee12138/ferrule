export interface Result {
  code: number;
  msg: string;
}

export interface ResultWithData<T> extends Result {
  data: T;
}
