import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppService } from './app.service';
import { NG_APP_CLIENT_ID } from './app-config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public oidcSecurityService: OidcSecurityService, private appService: AppService) { }

  userInfo: any = {};
  isUserAuthenticated: boolean = false;

  peopleData: any[] = [];

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, idToken, accessToken }) => {
      console.log('app authenticated', isAuthenticated);
      console.log('app userData', userData);
      console.log('ID Token', idToken);
      console.log('Access Token', accessToken);
      this.isUserAuthenticated = isAuthenticated;
      this.userInfo = userData;
      localStorage.setItem('access_token', accessToken)
    });

  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    localStorage.removeItem('access_token');
    this.oidcSecurityService.logoff().subscribe((result) => console.log(result));
  }

  fetchCustomer() {
    this.appService.getCustomer().pipe().subscribe((data: any) => {
      console.log(data);
      this.peopleData = data;
    })
  }

  fetchPeople() {
    this.appService.getPeople().pipe().subscribe((data: any) => {
      console.log(data);
      this.peopleData = data;
    })
  }

  gotoLogin(){
    let url = `https://accounts.asgardeo.io/t/iamapptesting/accountrecoveryendpoint/register.do?client_id=${NG_APP_CLIENT_ID}`;
    window.location.href = url;
  }
}
