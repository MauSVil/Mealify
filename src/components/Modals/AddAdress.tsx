import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { InstanceProps, create } from 'react-modal-promise';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export interface AddAddressProps extends InstanceProps<any, any> {}

function AddAdress(props: AddAddressProps) {
  const { isOpen, onReject, onResolve } = props;
  const [name, setName] = useState('');

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMapCenter({ lat, lng });
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
      },
      () => {
        setMapCenter({ lat: 0, lng: 0 });
      }
    );
  }, [])

  const onSubmit = async () => {
    await onResolve({
      name,
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Agregar nueva ubicación'}</AlertDialogTitle>
        </AlertDialogHeader>
        <Input placeholder="Nombre de la ubicación..." value={name} onChange={(e) => setName(e.target.value)} />
        <div className="w-full flex flex-col pb-4 sm:pb-6 lg:pb-8">
          {
            (!!mapCenter.lat && !!mapCenter.lng) && (
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                loadingElement={<div style={{ height: `100%` }}><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
                  onClick={handleMapClick}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
              </LoadScript>
            )
          }
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

export const AddAdressDialog = create(AddAdress);
