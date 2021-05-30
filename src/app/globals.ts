import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class Globals {
    useTokenService: boolean = false; 
    defaultRole: string[] = ["anonymous"];
    notesInServer: boolean = true;
}