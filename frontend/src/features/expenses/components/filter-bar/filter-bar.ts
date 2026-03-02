import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { FilterState } from '../../../../core/models/FilterState';


@Component({
  selector: 'app-filter-bar',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar implements OnInit{
  selectedDate:string="current_month";
  selectedCategory:string = "";

  @Output() filterApply = new EventEmitter<FilterState>();
  @Input() filterMode = ''

  apply(){
    var payload:FilterState;
    if(this.filterMode = 'expenses'){
       payload ={
      dateRange:this.selectedDate,
      category:this.selectedCategory
    };
    }else {
      payload ={
      dateRange:this.selectedDate,
      source:this.selectedCategory
    };
    }
    
    
    this.filterApply.emit(payload);
  }

  ngOnInit(): void {
    this.apply();
  }

  

}
