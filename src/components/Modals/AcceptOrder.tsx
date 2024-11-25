
import { InstanceProps, create } from 'react-modal-promise';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Order } from '@/lib/types/Zod/Order';

export interface NewOrder extends Omit<Order, 'restaurant'> {
  restaurant: {
    name: string;
    latitude: number;
    longitude: number;
  }
}

export interface AddAddressProps extends InstanceProps<any, any> {
  order: NewOrder
}


function AcceptOrder(props: AddAddressProps) {
  const { isOpen, onReject, onResolve, order } = props;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Hay una nueva orden disponible'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {order.restaurant.name}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onReject}>
            {'Descartar'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onResolve}>
            {'Tomar la orden'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const AcceptOrderDialog = create(AcceptOrder);
