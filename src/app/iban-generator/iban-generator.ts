import { Component, OnInit } from '@angular/core';
import { Bank } from '../entities/Bank';
import { BankService } from '../services/bank/bank';
import { IbanService } from '../services/iban/iban';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IbanResponse } from '../responses/IbanResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iban-generator',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './iban-generator.html',
  styleUrl: './iban-generator.css'
})
export class IbanGeneratorComponent implements OnInit {
  generateForm: FormGroup;
  banks: Bank[] = [];
  selectedBankBic = '';
  lastResult: IbanResponse | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private ibanService: IbanService
  ) {
    this.generateForm = this.fb.group({
      selectedBank: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{16}$/), Validators.minLength(16), Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {
    this.loadBanks();
    this.setupFormSubscriptions();
  }

  private loadBanks(): void {
    this.bankService.banks$.subscribe((banks: Bank[]) => {
      this.banks = banks;
    });
  }

  private setupFormSubscriptions(): void {
    this.generateForm.get('selectedBank')?.valueChanges.subscribe((bicCode: string) => {
      this.selectedBankBic = bicCode;
    });

    // Auto-uppercase account number
    this.generateForm.get('accountNumber')?.valueChanges.subscribe(value => {
      if (value) {
        const upperValue = value.toUpperCase();
        if (upperValue !== value) {
          this.generateForm.get('accountNumber')?.setValue(upperValue, { emitEvent: false });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.generateForm.valid) {
      this.isLoading = true;
      const request = {
        bankCode: this.generateForm.value.selectedBank,
        accountNumber: this.generateForm.value.accountNumber
      };

      this.ibanService.generateIban(request).subscribe({
        next: (response: any) => {
          this.lastResult = response;
          this.isLoading = false;
        },
        error: (error: { message: string; }) => {
          this.lastResult = {
            success: false,
            message: 'Eroare de comunicare cu serverul: ' + error.message,
            timestamp: new Date()
          };
          this.isLoading = false;
        }
      });
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('IBAN copied to clipboard');
    });
  }
}