import {
  multipleAcceptedLift,
  singleAcceptedLiftWithCustomId,
} from './../mock-data/acceptedLifts.mock.data';

export const mockAcceptedLiftService = {
  getById(id: string) {
    return singleAcceptedLiftWithCustomId(id);
  },
  getAll() {
    return multipleAcceptedLift;
  },
};
