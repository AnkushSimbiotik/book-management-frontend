import { API_CONSTANTS } from './../../core/constants/api.constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../core/services/common.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private commonService: CommonService) {}

  getTotalBooksStats(): Observable<any> {
    return this.commonService.commonGetService(
      `/${API_CONSTANTS.DASHBOARD.STATS_BOOK}`
    );
  }

  getTotalTopicsStats(): Observable<any> {
    return this.commonService.commonGetService(
      `/${API_CONSTANTS.DASHBOARD.STATS_TOPIC}`
    );
  }

  getBooks(): Observable<any> {
    return this.commonService.commonGetService(
      `/${API_CONSTANTS.DASHBOARD.BOOK}`
    );
  }

  getTopics(): Observable<any> {
    return this.commonService.commonGetService(
      `/${API_CONSTANTS.DASHBOARD.TOPIC}`
    );
  }
}
