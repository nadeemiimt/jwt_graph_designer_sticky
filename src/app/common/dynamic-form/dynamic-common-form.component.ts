import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField } from 'src/app/model/form-field';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'common-dynamic-form',
  templateUrl: './dynamic-common-form.component.html',
  styleUrls: ['./dynamic-common-form.component.scss']
})
export class DynamicCommonFormComponent implements OnInit {

  @Input() 
  formFields: any = [];

  @Output()
  formOutPut = new EventEmitter<string>();

  form!: FormGroup;
  payLoad = ' ';

  constructor(private formfieldService: RestApiService) { }

  ngOnInit(): void {
    this.form = this.formfieldService.toFormGroup(this.formFields);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    this.formOutPut.emit(this.payLoad);
    //alert(this.payLoad);
  }

}