import { Injectable } from '@angular/core';

export interface IAccountInfo {
  name?: string;
  walletAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor() { }
}
