export interface IbanDetails {
  countryCode: string;
  checkDigits: string;
  bankCode: string;
  accountNumber: string;
  bankName?: string;
}