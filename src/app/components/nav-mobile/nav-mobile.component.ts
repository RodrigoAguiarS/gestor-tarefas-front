import { ACESSO } from './../../model/Acesso';
import { Component, Input } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-nav-mobile',
   imports: [
     NzLayoutModule,
     CommonModule,
     NzMenuModule,
     RouterModule,
     NzIconModule,
     NzBadgeModule,
 ],
  templateUrl: './nav-mobile.component.html',
  styleUrl: './nav-mobile.component.css'
})
export class NavMobileComponent {

  ACESSO = ACESSO;

  @Input() roles: string[] = [];
  @Input() quantidadeNotificacoes: number = 0;

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly message: NzMessageService,
   ) {}

  deslogar(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    this.message.info('Usuário deslogado com sucesso');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.deslogar();
    }
  }
}
