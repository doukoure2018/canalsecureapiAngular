import { Pipe, PipeTransform } from '@angular/core';
import { parseISO, differenceInDays } from 'date-fns';

@Pipe({
  name: 'expirationStatus',
})
export class ExpirationStatusPipe implements PipeTransform {
  transform(
    expirationDate: Date | string | undefined,
    status: string,
    balance: number
  ): { message: string; type: 'avertissement' | 'attention' | null } {
    // Check if balance is below the minimum threshold and display a warning
    if (balance < 200) {
      return {
        message:
          'Attention ! Le solde de messages est inférieur au seuil minimum de 200.',
        type: 'avertissement',
      };
    }
    if (status === 'EXPIRED') {
      return {
        message:
          'Votre abonnement sms a expiré. Veuillez le renouveler dès que possible.',
        type: 'attention',
      };
    }

    // If expirationDate is undefined, return no message
    if (!expirationDate) {
      return { message: '', type: null };
    }

    // Convert Date to string if necessary, then parse
    const expiration =
      typeof expirationDate === 'string'
        ? parseISO(expirationDate)
        : expirationDate;
    const daysToExpire = differenceInDays(expiration, new Date());

    if (daysToExpire <= 4 && daysToExpire >= 0) {
      return {
        message: `Attention ! Il ne reste que ${daysToExpire} jours avant l'expiration.`,
        type: 'avertissement',
      };
    }

    return { message: '', type: null };
  }
}
