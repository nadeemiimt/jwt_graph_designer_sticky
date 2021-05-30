import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  OnInit
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
 import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

 import { from, Observable, Subscription, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DragAndDropComponent } from 'src/app/common/drag-and-drop/drag-and-drop.component';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
 

@Component({
  selector: 'app-diagram-designer',
  templateUrl: './diagram-designer.component.html',
  styleUrls: ['./diagram-designer.component.scss']
})
export class DiagramDesignerComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {
private bpmnJS: any;
multiple: any = false;

  @ViewChild('ref', { static: true }) private el!: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @ViewChild(DragAndDropComponent, { static: false })
  private dragAndDropComponent!: DragAndDropComponent;

 // @Input() private 
 url: string = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
 url2:string = '/assets/default.bpmn';
  constructor(private http: HttpClient, private restApiService: RestApiService, public router: Router) {

    this.bpmnJS = new BpmnJS();

    this.bpmnJS.on('import.done', ({ error }:any) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }
  ngOnInit(): void {
    //this.loadUrl(this.url2);
    this.restApiService.isLoggedIn().subscribe((res:any) =>
      {
        if(!res)
        {
          this.router.navigate(['login']);
        }
      })
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }

  form: FormGroup = new FormGroup({
    url: new FormControl(this.url),
  });
  
  submit() {
    if (this.form.valid) {
     // this.submitEM.emit(this.form.value);
     this.loadUrl(this.form.get("url")?.value)
    }
  }
  //@Input() 
  
  error!: string | null;

  //@Output() submitEM = new EventEmitter();
clear(){
  if(this.dragAndDropComponent && this.dragAndDropComponent.files?.length > 0)
  {
    let count = this.dragAndDropComponent.files.length;
    for(let i =0; i < count; i++)
    this.dragAndDropComponent.deleteFile(i);
  }
  this.form.setValue({"url":""});
  this.bpmnJS.clear();
}

fileDataReceived(data:any, mep: any){
this.importDiagram(data);
mep.expanded = false;
}

fileReadError(error:any){
alert(error);
}

// step = 0;

//   setStep(index: number) {
//     this.step = index;
//   }

//   nextStep() {
//     this.step++;
//   }

//   prevStep() {
//     this.step--;
//   }

nextStep(){

}
}