import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class ChangeVisibilityService{
   apperancy:Subject<boolean> = new Subject<boolean>();
}