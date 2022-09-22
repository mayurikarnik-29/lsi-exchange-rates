import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { Rate, Theme } from './app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'LSI Exchange Rates App';
  rates: Rate[] = [];
  cols: any[] = [];
  theme: Theme[] = [
    { name: 'Light', code: 'light' },
    { name: 'Dark', code: 'dark' }
  ];
  selectedTheme:Theme = { name: 'Light', code: 'light' };
  dateInvalid: boolean = false;

  constructor(private http: HttpClient, private messageService: MessageService, private themeService: ThemeService) { }

  ngOnInit() {
    this.getNbpQuotes('https://api.nbp.pl/api/exchangerates/tables/A/?format=json');

    this.cols = [
      { field: 'currency', header: 'Currency Name' },
      { field: 'code', header: 'Currency Symbol' },
      { field: 'mid', header: 'Rate' },
    ];
  }

  getNbpQuotes(url: string) {
    return this.http.get(url)
      .subscribe((response: any) => {
        this.rates = response[0].rates;
      },
        error => {
          this.messageService.add({ key: 'error', severity: 'error', summary: error.status, detail: error.error });
          this.rates = []
        })
  }

  filterByDate(date: Date) {
    if (!date) {
      this.dateInvalid = false;
    } else {
      if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        this.dateInvalid = false;
        const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
        this.getNbpQuotes(`https://api.nbp.pl/api/exchangerates/tables/A/${formattedDate}/?format=json`);
      } else {
        this.dateInvalid = true;
      }
    }
  }

  selectTheme(theme: Theme) {
    this.themeService.switchTheme(theme.code)
  }
}
