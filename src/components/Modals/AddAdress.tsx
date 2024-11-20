
import { InstanceProps, create } from 'react-modal-promise';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Input } from '../ui/input';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { Library } from '@googlemaps/js-api-loader';

export interface AddAddressProps extends InstanceProps<any, any> {}

const libraries: Library[] = ['core', 'maps', 'places', 'marker']

function AddAdress(props: AddAddressProps) {
  const { isOpen, onReject, onResolve } = props;
  const [name, setName] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    language: 'es',
    libraries,
  })

  const mapRef = useRef<HTMLDivElement>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          const mapOptions = {
            center: { lat: 19.5101674, lng: -99.2394589 },
            zoom: 15,
            mapId: 'MY-MAP-1234',
          };
          
          const gMap = new google.maps.Map(mapRef.current, mapOptions);

          const gAutoComplete = new google.maps.places.Autocomplete(placeAutoCompleteRef.current as HTMLInputElement);

          setAutoComplete(gAutoComplete);
          setMap(gMap);
        }
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const setMarker = (location: google.maps.LatLng, name: string) => {
    if (!map) return;
    map.setCenter(location);
    new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: location,
      title: name,
    })
  }

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        if (place.geometry) {
          const position = place.geometry.location;
          if (position) {
            setMarker(position, place.name!);
            setLatitude(position.lat());
            setLongitude(position.lng());
          }
        }
      });
    }
  }, [autoComplete])

  const onSubmit = async () => {
    await onResolve({
      name,
      latitude,
      longitude,
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Agregar nueva ubicación'}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className='flex-1 flex flex-col gap-4'>
          <Input placeholder="Nombre de la ubicación..." value={name} onChange={(e) => setName(e.target.value)} />
          <Input ref={placeAutoCompleteRef} />
        </div>
        <div className='flex-1 h-72 w-full' ref={mapRef} />
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
