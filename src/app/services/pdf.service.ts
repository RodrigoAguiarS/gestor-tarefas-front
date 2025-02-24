import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Tarefa } from '../model/Tarefa';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  exportarTarefaParaPDF(tarefa: Tarefa): void {
    const doc = new jsPDF();

    // Configurações gerais
    const leftMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 30;

    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 144, 255); // Azul forte
    doc.text('Informações da Tarefa', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Linha separadora no cabeçalho
    doc.setDrawColor(30, 144, 255); // Azul forte
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - leftMargin, y);
    y += 15;

    // Definição dos dados da tarefa
    const tableData = [
      ['Código', tarefa.id],
      ['Título', tarefa.titulo],
      ['Descrição', tarefa.descricao],
      ['Responsável', tarefa.responsavel.pessoa.nome],
      ['Situação', tarefa.situacao],
      ['Prioridade', tarefa.prioridade],
    ];

    // Tabela
    (doc as any).autoTable({
      startY: y,
      head: [['Campo', 'Detalhes']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 12, cellPadding: 6, textColor: [0, 0, 0] },
      headStyles: { fillColor: [30, 144, 255], textColor: 255, fontSize: 14 }, // Azul forte no cabeçalho
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }, // Ajusta a largura da 1ª coluna
      margin: { left: leftMargin, right: leftMargin },
    });

    y = (doc as any).lastAutoTable.finalY + 20;

    // Rodapé
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Cinza escuro
    doc.text(
      `Emitido em: ${new Date().toLocaleDateString()} • Página 1`,
      leftMargin,
      pageHeight - 10
    );

    // Linha separadora no rodapé
    doc.setDrawColor(200, 200, 200); // Cinza claro
    doc.line(leftMargin, pageHeight - 15, pageWidth - leftMargin, pageHeight - 15);

    // Salvar o PDF
    doc.save(`Tarefa_${tarefa.id}.pdf`);
  }
}
