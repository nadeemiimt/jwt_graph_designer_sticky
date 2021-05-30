import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormField } from 'src/app/model/form-field';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  title = 'AngularDynamicForms';
  formFields: FormField<string>[];
  
  constructor(private service: RestApiService, public router: Router) {
    this.formFields = service.getFormFields();
  }

  ngOnInit(): void {
    this.service.isLoggedIn().subscribe((res:any) =>
      {
        if(!res)
        {
          this.router.navigate(['login']);
        }
      })
  }

  formClicked(data: string){  // parse data 
    alert(data);
  }

}
