import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
      const orderStatus = [
      { id: 1, name: 'Pending' },
      { id: 2, name: 'On working' },
       { id: 3, name: 'Delivered' }
    ];
  
    if (value) {
      let statusName: any = orderStatus.find((x) => x.id == value);
      return statusName.name;
    }
    return null;
  }

}
