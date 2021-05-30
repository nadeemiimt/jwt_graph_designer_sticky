import { Injectable, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, of, throwError } from 'rxjs';
import { retry, catchError, filter, map, reduce, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormField } from '../model/form-field';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IFormModel } from '../model/form-model';
import * as data from "../resources/formFields.json";
import { StoreSummary } from '../model/store-summary';
import { OrdersTableItem } from '../model/orders-table-item';
import { Note } from '../model/note';
import { select, Store } from '@ngrx/store';
import { UserState } from '../store/reducer/user.reducer';
import { currentUser } from '../store/selector/user.selectors';

// TODO: replace this with real data from your application
let EXAMPLE_DATA: OrdersTableItem[] = [
  { id: 1, name: 'Hydrogen', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '18.00' },
  { id: 2, name: 'Helium', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '178.00' },
  { id: 3, name: 'Lithium', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '618.00' },
  { id: 4, name: 'Beryllium', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '16.00' },
  { id: 5, name: 'Boron', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '1544.00' },
  { id: 6, name: 'Carbon', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '13.00' },
  { id: 7, name: 'Nitrogen', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '133.00' },
  { id: 8, name: 'Oxygen', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '155.00' },
  { id: 9, name: 'Fluorine', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '143.00' },
  { id: 10, name: 'Neon', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '1234.00' },
  { id: 11, name: 'Sodium', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '18.00' },
  { id: 12, name: 'Magnesium', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '18.00' },
  { id: 13, name: 'Aluminum', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '18.00' },
  { id: 14, name: 'Silicon', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '18.00' },
  { id: 15, name: 'Phosphorus', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '18.00' },
  { id: 16, name: 'Sulfur', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '18.00' },
  { id: 17, name: 'Chlorine', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '18.00' },
  { id: 18, name: 'Argon', date: '01/May/2021', paymentMode: 'Online', status: 'pending', orderTotal: '18.00' },
  { id: 19, name: 'Potassium', date: '01/May/2021', paymentMode: 'Online', status: 'delivered', orderTotal: '18.00' },
  { id: 20, name: 'Calcium', date: '01/May/2021', paymentMode: 'Online', status: 'shipped', orderTotal: '18.00' },
];

const SUMMARY: StoreSummary[] = [
  { color: "purple", title: "Total Sales", icon: "receipt", isIncrease: true, isCurrency: true, value: 9465, duration: "since last month", percentValue: 53.83 },
  { color: "orange", title: "Average Order Value", icon: "local_atm", isIncrease: false, isCurrency: true, value: 465, duration: "since last month", percentValue: 25.44 },
  { color: "red", title: "Total Order", icon: "shopping_cart", isIncrease: true, isCurrency: false, value: 243, duration: "since last month", percentValue: 45.65 },
  { color: "purple", title: "Returning Customers", icon: "person_add", isIncrease: false, isCurrency: false, value: 35, duration: "since last month", percentValue: 83.61 }
];

@Injectable({
  providedIn: CommonModule,
})
export class RestApiService {
  // getOrderCount(): Observable<number> {
  //   var result = EXAMPLE_DATA.length;

  //   return of(result);
  // }

  // getOrders(offset: number, pageSize: number, active: string, direction: string): ObservableInput<any> {
  //   debugger;
  //   var og = Array.from(EXAMPLE_DATA);
  //   var length = og.length;
  //   var data = EXAMPLE_DATA.sort((a, b) => {
  //     const isAsc = direction === 'asc';
  //     switch (active) {
  //       case 'name': return this.compare(a.name, b.name, isAsc);
  //       case 'id': return this.compare(+a.id, +b.id, isAsc);
  //       case 'orderTotal': return this.compare(+a.orderTotal, +b.orderTotal, isAsc);
  //       case 'date': return this.compare(a.date, b.date, isAsc);
  //       case 'status': return this.compare(a.status, b.status, isAsc);
  //       case 'paymentMode': return this.compare(a.paymentMode, b.paymentMode, isAsc);
  //       default: {
  //         if (direction == "") {
  //           return this.compare(+a.id, +b.id, true);
  //         }
  //         return 0;
  //       };
  //     }
  //   })
  //   var result = data.splice(offset, pageSize);
    
  //   EXAMPLE_DATA.splice(0, length - pageSize);
  //   EXAMPLE_DATA = EXAMPLE_DATA.concat(og);
  //   return of(result);
  // }

  // /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  // compare(a: string | number, b: string | number, isAsc: boolean): number {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }

  // getStoreSummary(): Observable<StoreSummary[]> {
  //   return of(SUMMARY);
  // }

  // Define API
  apiURL = 'http://localhost:8000/api/';

  constructor(@SkipSelf() private http: HttpClient, private readonly store: Store<UserState>) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
    //  'Content-Type': 'application/json'
    })
  }

  /*************DASHBOARD**************************/
  getOrders(offset: number, pageSize: number, active: string, direction: string): ObservableInput<OrdersTableItem[]> {
    return this.http.post<OrdersTableItem[]>(this.apiURL + 'order', {
      offset,
      pageSize,
      active,
      direction
    }, this.httpOptions).pipe(map((data:any) => { 
      return data.orders
    }));
  }

  getOrderCount(): Observable<number> {
    return this.http.get<number>(this.apiURL + 'ordercount', this.httpOptions).pipe(map((data:any) => {
      return data.ordercount
    }));
  }

  getStoreSummary(): Observable<StoreSummary[]> {
    return this.http.get<StoreSummary[]>(this.apiURL + 'store', this.httpOptions).pipe(map((data:any) => { 
      return data.stores
    }));
  }

  /***************************HOME STICKY *******************************/
  saveNote(note: Note): Observable<Note[]> {
    const content = note.content;
    return this.http.post<OrdersTableItem[]>(this.apiURL + 'notes', {
      "content": content
    }, this.httpOptions).pipe(map((data:any) => { 
      return data.notes
    }));
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<OrdersTableItem[]>(this.apiURL + 'notes', this.httpOptions).pipe(map((data:any) => { 
      return data.notes
    }));
  }

  updateNote(note: Note): Observable<Note[]> {
    const id = note.id;
    const content = note.content;
    return this.http.put<OrdersTableItem[]>(this.apiURL + 'notes', {
      "id": id,
      "content": content
    }, this.httpOptions).pipe(map((data:any) => { 
      return data.notes
    }));
  }

  isLoggedIn(): Observable<boolean>{
    return this.store.pipe(select(currentUser)).pipe(
      map(x=> x.access_token != "")
    )
  }
  
  deleteNote(id: number): Observable<Note[]> {
    return this.http.delete<OrdersTableItem[]>(this.apiURL + 'notes' + '?id=' + id, this.httpOptions).pipe(map((data:any) => { 
      return data.notes
    })).pipe(
      retry(1),
      catchError(this.handleError)
    );;
  }

  toFormGroup(inputs: FormField<string>[]): FormGroup {
    const group: any = {};
    inputs.forEach(input => {
      let validator: ValidatorFn[] = input.required ? [Validators.required] : [];
      switch (input.validator) {
        case "email":
          validator.push(Validators.email);
          break;
        default:
          break;
      }
      group[input.key] = validator.length > 0 ? new FormControl(input.value || '', validator)
        : new FormControl(input.value || '');
    });

    return new FormGroup(group);
  }

  getFormFields(): FormField<string>[] {
    let fields = (data as any as IFormModel).fields;
    let inputs: FormField<string>[] = [];
    fields.forEach((item, index) => {
      inputs.push(new FormField<string>(
        {
          controlType: "textbox",
          key: item.name,
          label: item.name,
          required: true,
          order: 1,
          validator: item.validateAs === 'email' ? "email" : undefined,
          type: item.validateAs === "number" ? "number" : undefined,
        }));
    });
    return inputs.sort((a, b) => a.order - b.order);
  }

  // Error handling 
  handleError(error: any) {
    debugger;
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //       window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
