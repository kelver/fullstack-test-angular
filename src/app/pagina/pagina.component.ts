import { Component, OnInit } from '@angular/core';

import { catchError } from 'rxjs/operators';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.scss']
})
export class PaginaComponent implements OnInit {
  public apiGreeting: string;
  public dateTime: string;
  public messages: object = [];
  public currentPage: number = 1;
  public nextPage: number = 1;
  public lastPage: number;
  public isPaginate: boolean = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  sendMessage(message: string): void {
    this.apiService.storeNewMessage(message).pipe(
      catchError((err) => {
        this.apiGreeting = 'Falha na comunicação com o servidor.';
        return [];
      })
    ).subscribe((response) => {
      if (response) {
        (<HTMLFormElement>document.getElementById("addMessage")).reset();
        return this.loadMessages();
      }
    });
  }

  checkData(): void {
    this.apiService.getDateTime().pipe(
      catchError((err) => {
        this.dateTime = 'Falha na comunicação com o servidor.';
        return [];
      })
    ).subscribe((response) => {
      if (response) {
        console.log(response.data);
        this.dateTime = response.data;
      }
    });
  }

  loadMessages(): void {
    this.nextPage = this.isPaginate ? this.currentPage + 1 : 1;
    this.apiService.getAllMessages(this.nextPage).pipe(
      catchError((err) => {
        return 'Falha na comunicação com o servidor.';
      })
    ).subscribe((response) => {
      if (response) {
        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;

        this.checkData();
        let messages = this.messages;
        // @ts-ignore
        this.messages = this.isPaginate ? messages.concat(response.data) : response.data;
        this.isPaginate = false;
      }
    });
  }

  showMoreMessages() {
    this.isPaginate = true;
    this.loadMessages();
  }
}
