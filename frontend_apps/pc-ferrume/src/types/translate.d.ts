export interface TranslateResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}
