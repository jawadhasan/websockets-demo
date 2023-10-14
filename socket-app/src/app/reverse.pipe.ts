import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
  transform(value: any) {
    if (!value) return;

    console.log('in-pipe',value);
    return value.reverse();
  }
}
