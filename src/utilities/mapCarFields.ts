// src/utilities/mapCarFields.ts
import { CarInformation } from '../components/informationCard/type';

export function mapCarFields(data: any): CarInformation {
  return {
    name: data.name ?? '',
    type: data.type ?? '',
    color: data.color ?? '',
    model: data.model ?? '',
    chassisNumber: data.chassisNumber ?? '',
    plateNumber: data.plateNumber ?? '',
    walletNumber: data.walletNumber ?? '',
    typeOfCarPlate: data.typeOfCarPlate ?? '',
    engineType: data.engineType ?? '',
    passengerCount: data.passengerCount ?? 1,
    cylinderCount: data.cylinderCount ?? 2,
    kilometers: data.kilometers ?? 0,
    origin: data.origin ?? '',
  };
}
