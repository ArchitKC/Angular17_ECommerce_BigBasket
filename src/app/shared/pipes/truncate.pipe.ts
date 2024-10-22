import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(text:string, maxLength: number= 12): string {
    if(text && text.length <= maxLength){
      return text;
    }else if(text && text.length > maxLength){
      return text.substring(0, maxLength) + '...';
    }else
    return '___';
  }
}
