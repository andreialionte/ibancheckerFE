import { IbanDetails } from "../entities/IbanDetails";

export interface IbanResponse {
  success: boolean;
  message: string;
  iban?: string;
  ibanFormatted?: string;
  valid?: boolean;
  details?: IbanDetails;
  timestamp: Date;
}