import { Component, OnInit } from '@angular/core';
import { IbanOperation } from '../entities/IbanOperation';
import { IbanService } from '../services/iban/iban';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {
  operations: IbanOperation[] = [];
  searchTerm = '';
  filterType = '';
  filterValid = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private ibanService: IbanService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.ibanService.history$.subscribe(history => {
      this.operations = history;
      this.currentPage = 1; // Reset to first page when history changes
    });
  }

  get filteredOperations(): IbanOperation[] {
    let filtered = this.operations;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(op => 
        op.iban.toLowerCase().includes(term) ||
        (op.bankName && op.bankName.toLowerCase().includes(term))
      );
    }

    // Filter by operation type
    if (this.filterType) {
      filtered = filtered.filter(op => op.operation === this.filterType);
    }

    // Filter by valid/invalid
    if (this.filterValid !== '') {
      const isValid = this.filterValid === 'true';
      filtered = filtered.filter(op => op.valid === isValid);
    }

    return filtered;
  }

  get paginatedOperations(): IbanOperation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOperations.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOperations.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getOperationBadgeClass(operation: IbanOperation): string {
    return operation.operation === 'GENERATE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatIbanForDisplay(iban: string): string {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  copyToClipboard(iban: string): void {
    navigator.clipboard.writeText(iban).then(() => {
      console.log('IBAN copied to clipboard:', iban);
    });
  }

  revalidateIban(iban: string): void {
    const request = { iban: iban };
    this.ibanService.validateIban(request).subscribe({
      next: (response: any) => {
        console.log('Revalidation result:', response);
        // Could add a toast notification here
      },
      error: (error: any) => {
        console.error('Revalidation error:', error);
      }
    });
  }

  clearHistory(): void {
    if (confirm('Sunteți sigur că doriți să ștergeți întregul istoric?')) {
      this.ibanService.clearHistory();
    }
  }

  // Statistics methods
  getTotalOperations(): number {
    return this.operations.length;
  }

  getGeneratedCount(): number {
    return this.operations.filter(op => op.operation === 'GENERATE').length;
  }

  getValidatedCount(): number {
    return this.operations.filter(op => op.operation === 'VALIDATE').length;
  }

  getValidCount(): number {
    return this.operations.filter(op => op.valid).length;
  }
}
