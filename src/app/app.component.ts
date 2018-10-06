import { Component, OnInit } from '@angular/core';
import { DetectorResponse, DetectorMetaData } from 'applens-diagnostics';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { map, catchError} from 'rxjs/operators';
//import * as momentNs from 'moment';
import 'moment-timezone';
import * as momentNs from 'moment-timezone';
import * as moment from 'moment-timezone';
import { DiagnosticService, DetectorControlService } from 'applens-diagnostics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Detector-Output';
  detectorResponse: DetectorResponse = null;
  author = "";

  startTime: moment.Moment;
  endTime: moment.Moment;

  ngOnInit() {
    console.log("try to get response");
//   this.detectorResponse.metadata.author = "Cindy";
 //   this.author = this.detectorResponse.metadata.author;
  this.endTime = moment.tz('Etc/UTC');
  this.endTime.startOf('minute').minute(this.endTime.minute() - this.endTime.minute() % 5);
  this.startTime = this.endTime.clone().add(-1, 'days');
  }

  constructor(private http: Http, private _detectorControlService: DetectorControlService) {
    _detectorControlService.setDefault();
    var obj;
    this.getJSON().subscribe(data => this.detectorResponse = data, error => console.error(error));
  }

  public getJSON(): Observable<any> {
    return this.http.get('assets/invocationOutput.json').map((res:any) => res.json()).catch((error:any) => Observable.throw(error));
  //  return this.http.get('assets/invocationOutput.json').pipe(map((res:any) => res.json()), catchError(error => {console.log(error); return throwError(error)}));

  // const name = Rx.Observable
  // .getJSON<{ name: string }>("/api/employees/alice")
  // .map(employee => employee.name)
  // .catch(error => Rx.Observable.of(null));
  }

//   public getJSON1(): Observable<any> {
//     return this.http.get("./file.json")
//                     .map((res:any) => res.json())
//                     .catch((error:any) => console.log(error));

// }
}

export class TimeZones {
  public static readonly UTC: string = 'Etc/UTC';
}