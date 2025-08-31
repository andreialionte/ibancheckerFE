import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IbanService } from '../services/iban/iban';
import { IbanResponse } from '../responses/IbanResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iban-validator',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './iban-validator.html',
  styleUrl: './iban-validator.css'
})
export class IbanValidator {
 validateForm: FormGroup;
  lastResult: IbanResponse | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private ibanService: IbanService
  ) {
    this.validateForm = this.fb.group({
      iban: ['', [Validators.required, Validators.minLength(24)]]
    });
  }

  get cleanIbanLength(): number {
    const iban = this.validateForm.get('iban')?.value || '';
    return iban.replace(/\s/g, '').length;
  }

  onSubmit(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const request = {
        iban: this.validateForm.value.iban
      };

      this.ibanService.validateIban(request).subscribe({
        next: (response) => {
          this.lastResult = response;
          this.isLoading = false;
        },
        error: (error) => {
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

  formatIban(): void {
    const iban = this.validateForm.get('iban')?.value;
    if (iban) {
      const cleanIban = iban.replace(/\s/g, '').toUpperCase();
      const formatted = cleanIban.replace(/(.{4})/g, '$1 ').trim();
      this.validateForm.patchValue({ iban: formatted });
    }
  }

  clearForm(): void {
    this.validateForm.reset();
    this.lastResult = null;
  }
}
