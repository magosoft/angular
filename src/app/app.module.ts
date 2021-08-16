import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipelineComponent } from './components/pipeline/pipeline.component';
import { EditviewComponent } from './components/pipeline/editview/editview.component';

@NgModule({
  declarations: [
    AppComponent,
    PipelineComponent,
    EditviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
