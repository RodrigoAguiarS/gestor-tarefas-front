import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioChangeService {

  private readonly userChangedSubject = new Subject<void>();

  userChanged$ = this.userChangedSubject.asObservable();

  notifyUserChanged() {
    this.userChangedSubject.next();
  }
}
