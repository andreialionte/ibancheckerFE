export interface IbanOperation {
  id: string;
  iban: string;
  operation: 'GENERATE' | 'VALIDATE';
  valid: boolean;
  timestamp: Date;
  bankName?: string;
}