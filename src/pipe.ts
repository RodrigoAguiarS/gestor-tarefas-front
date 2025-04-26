import { Pipe, PipeTransform } from '@angular/core';
import { Produto } from './app/model/Produto';


@Pipe({
  name: 'CPF',
})
export class CPFPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    if (value && value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return 'error';
  }
}

@Pipe({
  name: 'formatarHorario'
})
export class FormatarHorarioPipe implements PipeTransform {
  transform(horario: { diasFuncionamento: string; horaAbertura: string; horaFechamento: string }): string {
    const diasFormatados = this.formatarDias(horario.diasFuncionamento);
    const horaAberturaFormatada = this.formatarHora(horario.horaAbertura);
    const horaFechamentoFormatada = this.formatarHora(horario.horaFechamento);

    return `${diasFormatados} | ${horaAberturaFormatada} às ${horaFechamentoFormatada}`;
  }

  private formatarDias(dias: string): string {
    const diasMap = {
      SEG: 'Segunda',
      TER: 'Terça',
      QUA: 'Quarta',
      QUI: 'Quinta',
      SEX: 'Sexta',
      SAB: 'Sábado',
      DOM: 'Domingo'
    };

    return dias
      .split('-')
      .map((dia) => diasMap[dia as keyof typeof diasMap] || dia)
      .join(' a ');
  }

  private formatarHora(hora: string): string {
    return hora.slice(0, 5);
  }
}

@Pipe({
  name: 'cep',
})
export class CEPPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace(/\D/g, '');
      if (value.length === 8) {
        return value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
      }
    }
    return value;
  }
}

@Pipe({
  name: 'categoriaFilter',
})
export class CategoriaFilterPipe implements PipeTransform {
  transform(produtos: Produto[], categoriaId: number): Produto[] {
    if (!produtos || !categoriaId) {
      return produtos;
    }
    return produtos.filter((produto) => produto.categoria.id === categoriaId);
  }
}

@Pipe({
  name: 'telefone',
})
export class TelefonePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace(/\D/g, '');
      if (value.length === 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  }
}

@Pipe({
  name: 'localDateTimeFormat'
})
export class LocalDateTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const segundos = String(date.getSeconds()).padStart(2, '0');
    return `${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`;
  }
}
@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }
}
