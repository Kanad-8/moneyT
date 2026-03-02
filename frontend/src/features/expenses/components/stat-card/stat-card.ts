import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [CurrencyPipe],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  @Input() title:string ='';
  @Input() value:number | null =null;
}
