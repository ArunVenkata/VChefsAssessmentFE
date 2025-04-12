import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NzNotificationModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {


  constructor(
    private authService: AuthService, 
    private nzNotificationService: NzNotificationService,
    private router: Router ){

  }
  ngAfterViewInit() {
    this.initiateGoogleSignIn();
  }

  initiateGoogleSignIn(){
    setTimeout(() => { // to make sure the button always shows
      //@ts-ignore
      google.accounts.id.initialize({
        client_id: "740427105644-n0e0hn2nea39nbaleu8g09tmk6v9dut0.apps.googleusercontent.com",
        callback: this.onSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
    
      });
  
      //@ts-ignore
      google.accounts.id.renderButton(
        document.getElementById("google-signin") as HTMLElement,
        { theme: "outline", size: "large" }  // options
      );
      
    }, 200)
  }
  onSignIn(data: any){
    console.log("SIGN IN")
    console.log(data)

    const token = data.credential;
    if (!token){
      this.nzNotificationService.error("Something went wrong", "Please try again later");
      return;
    }
    this.authService.setAccessToken(token);
    this.authService.loginWithGoogle(token).subscribe({
      next: (response) => {
        console.log("Logged in:", response);
        // caution: unsafe
        
        this.router.navigate(["/"]);
      },
      error: (error) => console.error("Login error:", error)
    });
  }
}
