import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'customCurrency' })
export class CustomCurrency implements PipeTransform {
  transform(input: number): number {
    if (typeof(input) === "undefined" || input === null) {
      return null;
    }
    return input / 100;
  }
}
