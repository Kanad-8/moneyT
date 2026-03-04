import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardOverview } from '../../../core/models/DashboardModel/DashboardOverview';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl=environment.apiUrl+'/dashboard-overview';

  constructor(){}
  private http = inject(HttpClient);

  getOverview(startDate:string,endDate:string):Observable<DashboardOverview>{
    const params = new HttpParams()
    .set('startDate',startDate)
    .set('endDate',endDate);

    return this.http.get<DashboardOverview>(this.apiUrl,{params});
  }

  getCurrentMonthDates(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(year,month,1);
    const endDate = new Date(year,month+1,0);

    return {
      startDate:startDate.toISOString().split('T')[0],
      endDate :endDate.toISOString().split('T')[0]
    };
  } 
}
