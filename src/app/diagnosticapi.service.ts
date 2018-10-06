import { Injectable } from '@angular/core';
import { DetectorResponse, DetectorMetaData } from 'applens-diagnostics';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError, share, mergeMap} from 'rxjs/operators';
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/mergeMap'


@Injectable()
export class DiagnosticapiService {
  public readonly localDiagnosticApi: string = "http://localhost:5000/";
  public readonly diagnosticApi: string = "https://applens.azurewebsites.net/";

  detectorSettings: Observable<any>;
  private version: string;
  private resourceId: string;
  private accessToken: string;
  private detectorId: string;
  constructor(private _http: Http) { 
    this.detectorSettings = this.getJSON().share();
  }

  private getJSON(): Observable<any> {
     return this._http.get('assets/detectorSettings.json').map((res:any) => res.json()).catch(error => {console.log(error); return Observable.throw(error)});
   }

  //  private getJSON(): Observable<any> {
  //   console.log(document.location.href);
  //   return this.http.get('...')
  //     .map((res:any)=> res.json())
  //     .catch((error:any) => {
  //       return Observable.throw(error);
  //     })
  // }

  private _getTimeQueryParameters(startTime: string, endTime: string) {
    // let format = 'YYYY-MM-DDTHH:mm'
    // return `&startTime=${this._detectorControlService.startTime.format(format)}&endTime=${this._detectorControlService.endTime.format(format)}`;
    return `&startTime=${startTime}&endTime=${endTime}`;
  }

  getDetector(detector: string, startTime: string, endTime: string, refresh: boolean = false, internalView: boolean = true): Observable<DetectorResponse> {
    var body;
    let timeParameters = this._getTimeQueryParameters(startTime, endTime);
    console.log("my service");
    console.log(startTime);
    console.log(endTime);
    console.log("my service");
    let path = `${this.version}${this.resourceId}/detectors/${detector}?${timeParameters}`;

    // return this.detectorSettings.mergeMap(data => {
    //   let path = `${data.Version}${data.ResourceId}/detectors/${detector}?${timeParameters}`;
    //   return this.invoke<DetectorResponse>(data.Token, path, 'POST', body, true, refresh, internalView);
    // } 

    return this.invoke<DetectorResponse>(this.accessToken, path, 'POST', body, true, refresh, internalView);

  }

  // getDetectors(): Observable<DetectorMetaData[]> {
  //   return this._diagnosticApi.getDetectors(
  //     this._resourceService.versionPrefix, 
  //     this._resourceService.getCurrentResourceId(true),
  //     this._resourceService.getRequestBody());
  // }

  // public getDetector(version: string, resourceId: string, detector: string, startTime?: string, endTime?: string, body?: any, refresh: boolean = false, internalView: boolean = false): Observable<DetectorResponse> {
  //   let timeParameters = this._getTimeQueryParameters(startTime, endTime);
  //   let path = `${version}${resourceId}/detectors/${detector}?${timeParameters}`;
  //   return this.invoke<DetectorResponse>(path, 'POST', body, true, refresh, internalView);
  // }

  public getDetectors(): Observable<DetectorMetaData[]> {
    console.log("my service getdetectors");
      var body;
      return this.detectorSettings.mergeMap(data => {
        this.version = data.Version;
        this.resourceId = data.ResourceId;
        this.accessToken = data.Token;
        let path = `${data.Version}${data.ResourceId}/detectors`;
        return this.invoke<DetectorResponse[]>(data.Token, path, 'POST', body).map(response => response.map(detector => detector.metadata));
      }
    )
  }

  public invoke<T>(token: string, path: string, method: string = 'GET', body: any = {}, useCache: boolean = true, invalidateCache: boolean = false, internalView: boolean = true): Observable<T> {
    var url: string = `${this.localDiagnosticApi}api/invoke`

    let request = this._http.post(url, body, {
      headers: this._getHeaders(token, path, method, internalView)
    })
      .map((response: Response) => <T>(response.json()));

    return request;
  }

  private _getHeaders(token?: string, path?: string, method: string = 'GET', internalView: boolean = true): Headers {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', String(token));
    headers.append('x-ms-internal-client', String(true));
    headers.append('x-ms-internal-view', String(internalView));
    if (path) {
      headers.append('x-ms-path-query', path);
    }

    if (method) {
      headers.append('x-ms-method', method);
    }

    console.log(headers);
    return headers;
  }
}
