import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserPreferencesRoutingModule } from './user-preferences-routing.module';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';


@NgModule({
  declarations: [
    NotificationSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserPreferencesRoutingModule
  ]
})
export class UserPreferencesModule { }
