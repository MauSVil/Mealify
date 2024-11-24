
import { InstanceProps, create } from 'react-modal-promise';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { Library } from '@googlemaps/js-api-loader';

export interface AddAddressProps extends InstanceProps<any, any> {}

const libraries: Library[] = ['core', 'maps', 'places', 'marker']

function AcceptOrder(props: AddAddressProps) {
  const { isOpen, onReject, onResolve } = props;

  const onSubmit = async () => {
    await onResolve({ name: 'Test' });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Agregar nueva ubicación'}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className='flex-1 flex flex-col gap-4'>
          Esta es una orden nueva
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onReject}>
            {'Cancelar'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>
            {'Crear'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const AcceptOrderDialog = create(AcceptOrder);
