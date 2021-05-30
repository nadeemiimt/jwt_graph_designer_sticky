import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiagramDesignerComponent } from './diagram-designer/diagram-designer.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormInputComponent } from '../common/dynamic-form-input/dynamic-form-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicCommonFormComponent } from '../common/dynamic-form/dynamic-common-form.component';
import { RestApiService } from '../services/rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProgressComponent } from '../common/progress/progress.component';
import { DndDirective } from '../common/dnd.directive';
import { DragAndDropComponent } from '../common/drag-and-drop/drag-and-drop.component';
import { AnnualSalesChartComponent } from './dashboard/annual-sales-chart/annual-sales-chart.component';
import { CardComponent } from './dashboard/card/card.component';
import { MiniCardComponent } from './dashboard/mini-card/mini-card.component';
import { OrdersTableComponent } from './dashboard/orders-table/orders-table.component';
import { ProductSalesChartComponent } from './dashboard/product-sales-chart/product-sales-chart.component';
import { SalesTrafficChartComponent } from './dashboard/sales-traffic-chart/sales-traffic-chart.component';
import { StoreSessionsChartComponent } from './dashboard/store-sessions-chart/store-sessions-chart.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ChartsModule } from 'ng2-charts';
import {MatExpansionModule} from '@angular/material/expansion';
//import { NgxBpmnModelerModule } from 'ngx-bpmn-modeler';



@NgModule({
  declarations: [
    DashboardComponent,
    DiagramDesignerComponent,
    DynamicFormComponent,    
    DynamicFormInputComponent,
    DynamicCommonFormComponent,
    ProgressComponent,
    DndDirective,
    DragAndDropComponent,
    CardComponent,
    ProductSalesChartComponent,
    SalesTrafficChartComponent,
    AnnualSalesChartComponent,
    StoreSessionsChartComponent,
    OrdersTableComponent,
    MiniCardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule ,
    MatButtonModule,
    ChartsModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatExpansionModule
  ],
  exports:[
  ],
  providers:[
    RestApiService
  ]
})
export class AdminModule { }
