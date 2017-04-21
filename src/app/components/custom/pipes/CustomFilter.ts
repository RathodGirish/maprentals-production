import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customFilter'
})
@Injectable()
export class CustomFilter implements PipeTransform {
  transform(datas: any[], args: string): any {
    if (typeof args[0] == 'undefined' || args.length == 0) {
      return datas;
    } else {
      return datas.filter(data => {
        return (data.Title.toLowerCase().indexOf(args.toLowerCase()) !== -1 || data.Address.toLowerCase().indexOf(args.toLowerCase()) !== -1 || data.MonthlyRent.toString().toLowerCase().indexOf(args) !== -1);
      });
    }
  }
}