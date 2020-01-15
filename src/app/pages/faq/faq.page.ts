import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss']
})
export class FaqPage implements OnInit {
  faqs = [
    {
      question: '¿Quienes somos?',
      answer: 'SOY un estudiante de moviles de la URU xd',
      expanded: false
    },
    {
      question: '¿Como ganan plata?',
      answer:
        // tslint:disable-next-line: max-line-length
        'Compramos tarjetas de regalo en estados unidos a un precio mas economico que luego podemos vender al precio que ves en nuestras tiendas con una minima ganancia',
      expanded: false
    },
    {
      question: '¿Y ahora batman?',
      answer: '¡Salvese quien pueda!',
      expanded: false
    }
  ];

  constructor() {}

  ngOnInit() {}

  expand(faq) {
    faq.expanded = !faq.expanded;
  }
}
