import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Bank } from '../../entities/Bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private readonly API_URL = 'https://ibancheckerbe-sparkling-morning-6756.fly.dev/banks';  //localhost:8080
  private banksSubject = new BehaviorSubject<Bank[]>([]);
  public banks$ = this.banksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBanks();
  }

  getAllActiveBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.API_URL);
  }

  getAllBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.API_URL}/all`);
  }

  getBankByBicCode(bicCode: string): Observable<Bank> {
    return this.http.get<Bank>(`${this.API_URL}/bic/${bicCode}`);
  }

  getBankByShortName(shortName: string): Observable<Bank> {
    return this.http.get<Bank>(`${this.API_URL}/short/${shortName}`);
  }

  private loadBanks(): void {
    this.getAllActiveBanks().subscribe({
      next: (banks) => this.banksSubject.next(banks),
      error: (error) => console.error('Error loading banks:', error)
    });
  }

  getBanksValue(): Bank[] {
    return this.banksSubject.value;
  }
}
