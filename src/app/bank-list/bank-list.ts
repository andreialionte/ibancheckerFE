import { Component, OnInit } from '@angular/core';
import { BankService } from '../services/bank/bank';
import { Bank } from '../entities/Bank';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.css'
})
export class BankListComponent implements OnInit {
  banks: Bank[] = [];
  searchTerm = '';
  showOnlyActive = true;

  constructor(private bankService: BankService) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  private loadBanks(): void {
    this.bankService.banks$.subscribe(banks => {
      this.banks = banks;
    });
  }

  get filteredBanks(): Bank[] {
    let filtered = this.banks;

    if (this.showOnlyActive) {
      filtered = filtered.filter(bank => bank.active);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(bank => 
        bank.name.toLowerCase().includes(term) ||
        bank.shortName.toLowerCase().includes(term) ||
        bank.bicCode.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => a.shortName.localeCompare(b.shortName));
  }

  get totalBanks(): number {
    return this.banks.length;
  }

  get activeBanks(): number {
    return this.banks.filter(bank => bank.active).length;
  }

  get uniqueBicCodes(): number {
    return new Set(this.banks.map(bank => bank.bicCode)).size;
  }

  copyBicCode(bicCode: string): void {
    navigator.clipboard.writeText(bicCode).then(() => {
      console.log('BIC code copied:', bicCode);
    });
  }
}
