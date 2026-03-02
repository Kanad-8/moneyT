import { Component ,Input, OnChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import { MonthlyBudget } from '../../../../core/models/BudgetModel/MonthlyBudget';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { CurrencyPipe } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-overall-monthly-budget-card',
  imports: [CurrencyPipe],
  templateUrl: './overall-monthly-budget-card.html',
  styleUrl: './overall-monthly-budget-card.scss',
})
export class OverallMonthlyBudgetCard {

  @Input() data:{totalBudgeted:number,totalSpent:number,totalRemaining:number} = {totalBudgeted:0,totalSpent:0,totalRemaining:0};

  @ViewChild('chartCanvas') chartCanvas !: ElementRef<HTMLCanvasElement>;
  private chartInstance:Chart | null= null;

  percentage:number =0;

  ngAfterViewInit(){
    this.createChart();
    
  }

  ngOnChanges(){
    if(this.data.totalBudgeted >0){
      
      const percen = Math.round((this.data.totalSpent / this.data.totalBudgeted) * 100);
      
      this.percentage=percen;
    }else{
      this.percentage =0;
    }

     if(this.chartInstance){
      this.updateChartData();
  }
  }

  ngOnDestroy(){
    if(this.chartInstance){
      this.chartInstance.destroy();
      
    }
  }

  private createChart(){
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if(!ctx) return;

    const remaining = Math.max(0,this.data.totalBudgeted-this.data.totalSpent);

    

    const config:ChartConfiguration<'doughnut'>={
      type:'doughnut',
      data:{
        labels:['Used','Remaining'],
        datasets:[{
          data:[this.data.totalSpent,remaining],
          backgroundColor:[
            '#3b82f6', // Primary Blue (Used)
            '#e5e7eb'  // Light Gray (Remaining)
          ],
          borderWidth:0,
          borderRadius:20,
          hoverOffset:4
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{enabled:false}
        },
        cutout: '75%'
      }
    };

    this.chartInstance = new Chart(ctx,config);
  }

  private updateChartData(){
    if(!this.chartInstance) return;

    const remaining= Math.max(0,this.data.totalBudgeted-this.data.totalSpent);
    

    //Update data array
    let arr = [this.data.totalSpent,this.data.totalRemaining];
    this.chartInstance.data.datasets[0].data =arr;
    
    this.chartInstance.update();
  }

 
}
