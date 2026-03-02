import { Component, ViewChild ,ElementRef, SimpleChange, SimpleChanges} from '@angular/core';
import { Input } from '@angular/core';
import { 
  Chart, 
  DoughnutController, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
@Component({
  selector: 'app-category-chart',
  imports: [],
  templateUrl: './category-chart.html',
  styleUrl: './category-chart.scss',
})
export class CategoryChart {
  @Input() chartLabels:string[] =[];
  @Input() chartData:number[]=[];

  @ViewChild('canvas') canvas:ElementRef<HTMLCanvasElement> | undefined;

  private chart:Chart | null = null;

  constructor(){}

  ngAfterViewInit(): void{
    this.createChart();
  }

  ngOnChanges(changes:SimpleChanges):void{
    if(this.chart){
      if(changes['chartData'] || changes['chartLabels']){
        this.chart.data.labels=this.chartLabels;
        this.chart.data.datasets[0].data = this.chartData;
        this.chart.update();
        
        
      }
    }
  }

  private createChart():void{

    
    if(!this.canvas){
      return;
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    if(!ctx) return;

    if(this.chart){
      this.chart.destroy();
    }

    const chartColors = [
      '#f59e0b', // Amber-500 (Orange)
      '#10b981', // Emerald-500 (Green)
      '#3b82f6', // Blue-500
      '#ef4444', // Red-500
      '#8b5cf6', // Violet-500
      '#ec4899', // Pink-500
    ];

    this.chart = new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:this.chartLabels,
        datasets:[
          {
            data:this.chartData,
            backgroundColor:chartColors,
            hoverBackgroundColor:chartColors,
            borderWidth:0,
          },
        ],
      },
      options:{
        responsive:true,
        maintainAspectRatio:true,
        cutout:'75%',
        plugins:{
          legend:{
            display:true,
          },
          tooltip:{
            callbacks:{
              label: function(context){
                const label = context.label ?? '';
                return `${label}:${context.formattedValue}`;
              }
            }
          },
        },
      },
    });
  }





}
