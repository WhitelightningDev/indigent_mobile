import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private CELL_KEY = 'CellNumber';
  private TOKEN_KEY = 'Token';
  private OTP_KEY = 'OTP';
  private UserID_KEY = 'UserID';
  private EMAIL_KEY = 'Email';
  private CONSUMER_KEY = 'ConsumerID';
  private FULLNAME = 'FullName';
  private AVATAR = 'Avatar';
  private COMPANYNAME = 'CompanyName';
  constructor() {}

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }

  // async removeToken(): Promise<void> {
  //   await Storage.remove({ key: this.TOKEN_KEY });
  // }
  public setTerms(terms: any): void {
    sessionStorage.setItem('Terms', terms);
  }

  public getTerms(): any {
    return sessionStorage.getItem('Terms');
  }
  public setCell(cell: any): void {
    sessionStorage.setItem(this.CELL_KEY, cell);
  }

  public getCell(): any {
    return sessionStorage.getItem(this.CELL_KEY);
  }

  public setOTP(otp: string): void {
    sessionStorage.setItem(this.OTP_KEY, otp);
  }

  public getOTP(): string | null {
    return sessionStorage.getItem(this.OTP_KEY);
  }

  public setUserId(userID: string): void {
    sessionStorage.setItem(this.UserID_KEY, userID);
  }

  public getUserID(): string | null {
    return sessionStorage.getItem(this.UserID_KEY);
  }
  public setEmail(email: string): void {
    sessionStorage.setItem(this.EMAIL_KEY, email);
  }

  public getEmail(): string | null {
    return sessionStorage.getItem(this.EMAIL_KEY);
  }
  public setConsumer(consumer: number): void {
    sessionStorage.setItem(this.CONSUMER_KEY, JSON.stringify(consumer));
  }

  public getConsumer(): string | null {
    return sessionStorage.getItem(this.CONSUMER_KEY);
  }

  public setFullName(fullname: string) {
    sessionStorage.setItem(this.FULLNAME, fullname);
  }
  public getFullName(): string | null {
    return sessionStorage.getItem(this.FULLNAME);
  }
  public setAvatar(avatar: string) {
    sessionStorage.setItem(this.AVATAR, avatar);
  }
  public getAvatar() {
    return sessionStorage.getItem(this.AVATAR);
  }
  public setCompanyName(Cname: string) {
    sessionStorage.setItem(this.COMPANYNAME, Cname);
  }
  public getCompanyName() {
    return sessionStorage.getItem(this.COMPANYNAME);
  }

  public setStatus(consumer: number): void {
    sessionStorage.setItem(this.CONSUMER_KEY, JSON.stringify(consumer));
  }

  public getStatus(): string | null {
    return sessionStorage.getItem(this.CONSUMER_KEY);
  }

  public clearStorage(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.CELL_KEY);
    sessionStorage.removeItem(this.OTP_KEY);
    sessionStorage.removeItem(this.UserID_KEY);
    sessionStorage.removeItem(this.EMAIL_KEY);
    sessionStorage.removeItem(this.CONSUMER_KEY);
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }
}
