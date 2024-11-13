export interface IResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export interface IEmailBody {
  to: string;
  from: string;
  text: string;
  subject?: string;
  html?: string;
}
export interface EmailPortInterface {
  sendEmail({ to, from, text, subject, html }: IEmailBody): Promise<IResponse>;
}
