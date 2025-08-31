// src/app/services/iban.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IbanOperation } from '../../entities/IbanOperation';
import { IbanResponse } from '../../responses/IbanResponse';
import { IbanGenerateDto } from '../../entities/IbanGenerateDto';
import { IbanValidateDto } from '../../entities/IbanValidateDto';


@Injectable({
  providedIn: 'root'
})
export class IbanService {
  private readonly API_URL = 'http://localhost:8080/api/iban';
  private readonly STORAGE_KEY = 'iban_history';
  
  private historySubject = new BehaviorSubject<IbanOperation[]>([]);
  public history$ = this.historySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadHistoryFromStorage();
  }

  generateIban(request: IbanGenerateDto): Observable<IbanResponse> {
    return this.http.post<IbanResponse>(`${this.API_URL}/generate`, request)
      .pipe(
        tap(response => this.addToHistory(response, 'GENERATE'))
      );
  }

  validateIban(request: IbanValidateDto): Observable<IbanResponse> {
    return this.http.post<IbanResponse>(`${this.API_URL}/validate`, request)
      .pipe(
        tap(response => this.addToHistory(response, 'VALIDATE'))
      );
  }

  formatIban(iban: string): Observable<string> {
    return this.http.post(`${this.API_URL}/format`, iban, { responseType: 'text' });
  }

  private addToHistory(response: IbanResponse, operation: 'GENERATE' | 'VALIDATE'): void {
    if (response.iban) {
      const historyItem: IbanOperation = {
        id: Date.now().toString(),
        iban: response.iban,
        operation: operation,
        valid: response.valid || false,
        timestamp: new Date(),
        bankName: response.details?.bankName
      };

      const currentHistory = this.historySubject.value;
      const newHistory = [historyItem, ...currentHistory].slice(0, 50); // Keep last 50 operations
      
      this.historySubject.next(newHistory);
      this.saveHistoryToStorage(newHistory);
    }
  }

  private loadHistoryFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const history = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        this.historySubject.next(history);
      } catch (error) {
        console.error('Error loading history from storage:', error);
      }
    }
  }

  private saveHistoryToStorage(history: IbanOperation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  clearHistory(): void {
    this.historySubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getHistoryValue(): IbanOperation[] {
    return this.historySubject.value;
  }
}