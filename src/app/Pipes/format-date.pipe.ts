import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): string | null {
    // TODO 1
    let valueDate = new Date(value);
    if(args[0] === 1){
      return this.needZero(valueDate.getDate()) + this.needZero(valueDate.getMonth()) + this.needZero(valueDate.getFullYear());
    } else if( args[0] === 2){
      return this.needZero(valueDate.getDate()) + ' / ' + this.needZero(valueDate.getMonth()) + ' / ' + this.needZero(valueDate.getFullYear());
    } else if( args[0] === 3){
      return this.needZero(valueDate.getDate()) + '/' + this.needZero(valueDate.getMonth()) + '/' + this.needZero(valueDate.getFullYear());
    } else if( args[0] === 4){
      return this.needZero(valueDate.getFullYear()) + '-' + this.needZero(valueDate.getMonth()) + '-' + this.needZero(valueDate.getDate());
    }else{
      return null;
    }
    
  }

  public needZero(numb: number): string {
    if(numb < 10){
      return "0"+ String(numb);
    }
    return String(numb);
  }
}
