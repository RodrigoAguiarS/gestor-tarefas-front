import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() usuario: Usuario = new Usuario();
  papel: string[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.papel = this.usuario?.perfis?.map((perfil) => perfil.nome) ?? [];
  }
}
