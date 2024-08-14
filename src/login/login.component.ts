import { Component, OnDestroy } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User, user } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy{
  userSubscription: Subscription | any;
  user$: Observable<User> | any;
  private provider = new GoogleAuthProvider();
  returnUrl: any;

  constructor(private auth: Auth, private router: Router, private route: ActivatedRoute) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    this.user$ = user(auth);

    this.userSubscription = this.user$.subscribe((aUser: User | null) => {      
      console.log(aUser);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


  login() {
    signInWithPopup(this.auth, this.provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        console.log(credential);

        sessionStorage.setItem('idToken', credential?.idToken || '');
        sessionStorage.setItem('uid', result?.user?.uid || '');
        sessionStorage.setItem('email', result?.user?.email || '');

        if(this.returnUrl)
          this.router.navigateByUrl(this.returnUrl);            
        else
          this.router.navigate([`${result?.user?.email}/workout`]);
          
        return credential;
    })
}
}