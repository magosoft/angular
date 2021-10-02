import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipelineComponent } from './components/pipeline/pipeline.component';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EditLeadComponent } from './components/pipeline/edit-lead/edit-lead.component';
import { EditOpportunityComponent } from './components/pipeline/edit-opportunity/edit-opportunity.component';
import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component';
@NgModule({
  declarations: [
    AppComponent,
    PipelineComponent,
    EditLeadComponent,
    EditOpportunityComponent,
    SpinnerOverlayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
