import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { Devices } from '../enums/Devices';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private deviceTypeSubject: BehaviorSubject<Devices> = new BehaviorSubject<Devices>(Devices.DESKTOP);
  deviceType$ = this.deviceTypeSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe(result => this.handleBreakpointChange(result));
  }

  private handleBreakpointChange(result: BreakpointState): void {
    const isMobilePortrait = result.breakpoints['(max-width: 599.98px) and (orientation: portrait)'];
    // const isMobileLandscape = result.breakpoints['(max-width: 959.98px) and (orientation: landscape)'];
    const isTabletPortrait = result.breakpoints['(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)'];
    const isTabletLandscape = result.breakpoints['(min-width: 840px) and (orientation: portrait)'];

    if (isMobilePortrait) {
      this.deviceTypeSubject.next(Devices.MOBILE);
    } else if (isTabletPortrait || isTabletLandscape) {
      this.deviceTypeSubject.next(Devices.TABLET);
    } else {
      this.deviceTypeSubject.next(Devices.DESKTOP);
    }
  }

  observeDeviceType() {
    return this.deviceType$;
  }
}
