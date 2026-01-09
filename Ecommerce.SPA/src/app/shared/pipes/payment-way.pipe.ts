import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentWay',
  standalone: true,
})
export class PaymentWayPipe implements PipeTransform {
  transform(value: unknown): unknown {
    const paymentway = [
      { id: 1, name: 'Paypal' },
      { id: 2, name: 'CheckPayment' },
    ];

    if (value) {
      let paymentName: any = paymentway.find((x) => x.id == value);
      return paymentName.name;
    }
    return null;
  }
}
