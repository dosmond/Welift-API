import { AcceptedLift } from '@src/model/acceptedLift.entity';
export const singleAcceptedLiftWithCustomId = (id: string) =>
  new AcceptedLift({
    id: id,
    lifterId: '337da095-b9b9-496d-805c-0c122507ad6c',
    clockInTime: new Date(),
    clockOutTime: new Date(),
    liftId: '337da095-b9b9-496d-805c-0c122507ad6d',
    payrate: 20,
    totalPay: 20,
    usePickupTruck: false,
  });

export const multipleAcceptedLift = [
  new AcceptedLift({
    id: '337da095-b9b9-496d-805c-0c122507ad6f',
    lifterId: '337da095-b9b9-496d-805c-0c122507ad6c',
    clockInTime: new Date(),
    clockOutTime: new Date(),
    liftId: '337da095-b9b9-496d-805c-0c122507ad6d',
    payrate: 20,
    totalPay: 20,
    usePickupTruck: false,
  }),
  new AcceptedLift({
    id: '337da095-b9b9-496d-805c-0c122507ad6a',
    lifterId: '337da095-b9b9-496d-805c-0c122507ad6c',
    clockInTime: new Date(),
    clockOutTime: new Date(),
    liftId: '337da095-b9b9-496d-805c-0c122507ad6d',
    payrate: 20,
    totalPay: 20,
    usePickupTruck: false,
  }),
];
