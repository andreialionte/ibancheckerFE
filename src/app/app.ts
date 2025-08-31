import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IbanValidator } from "./iban-validator/iban-validator";
import { BankListComponent } from "./bank-list/bank-list";
import { HistoryComponent } from "./history/history";
import { IbanGeneratorComponent } from "./iban-generator/iban-generator";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IbanValidator, BankListComponent, HistoryComponent, IbanGeneratorComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   activeTab = 'generate';

  tabs = [
    { id: 'generate', label: 'Generator IBAN', icon: '🔄' },
    { id: 'validate', label: 'Validator IBAN', icon: '✅' },
    { id: 'banks', label: 'Lista Bănci', icon: '🏦' },
    { id: 'history', label: 'Istoric', icon: '📊' }
  ];

  getTabClasses(tabId: string): string {
    const baseClasses = 'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 hover:text-blue-600';
    if (this.activeTab === tabId) {
      return baseClasses + ' border-blue-500 text-blue-600';
    }
    return baseClasses + ' border-transparent text-gray-500 hover:border-gray-300';
  }
}
