import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {

  public activeLanguage = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.activeLanguage);
  }

  ngOnInit(): void {
  }

  public cambiarLenguaje(lang: string){
    this.activeLanguage = lang;
    this.translate.use(lang);
  }

}
