import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SidebarModule,
  TabModule,
  TreeViewAllModule,
} from '@syncfusion/ej2-angular-navigations';

import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {
  NumericTextBoxModule,
  TextBoxModule,
} from '@syncfusion/ej2-angular-inputs';
import {
  DatePickerModule,
  DateTimePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import {
  DropDownListModule,
  ListBoxModule,
  MultiSelectModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import {
  GridModule,
  PageService,
  ResizeService,
} from '@syncfusion/ej2-angular-grids';
import {
  CheckBoxModule,
  RadioButtonModule,
} from '@syncfusion/ej2-angular-buttons';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  RichTextEditorAllModule,
} from '@syncfusion/ej2-angular-richtexteditor';
// import { LocalizationService } from '../services/localization';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    SidebarModule,
    TreeViewAllModule,
    DialogModule,
    NumericTextBoxModule,
    TextBoxModule,
    DatePickerModule,
    ToastModule,
    DropDownListModule,
    GridModule,
    UploaderModule,
    MultiSelectModule,
    DateTimePickerModule,
    TabModule,
    ProgressBarModule,
    CheckBoxModule,
    RichTextEditorAllModule,
    RadioButtonModule,
    ListBoxModule,
    ListViewAllModule,
  ],
  providers: [
    // LocalizationService,
    PageService,
    ResizeService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
  ],
})
export class EjsModule {}
