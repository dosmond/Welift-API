import { LifterTransactionsService } from './../routes/lifter-transactions/lifter-transactions.service';
import { LifterDTO } from 'src/dto/lifter.dto';
import { BookingDTO } from 'src/dto/booking.dto';
import { WhatsNewService } from './../routes/whats-new/whats-new.service';
import { TrainingVideosService } from './../routes/training-videos/training-videos.service';
import { SurveyResponseService } from './../routes/survey-response/survey-response.service';
import { SurveyService } from './../routes/survey/survey.service';
import { PartnerReferralsService } from './../routes/partner-referrals/partner-referrals.service';
import { PartnerCreditHourPurchasesService } from './../routes/partner-credit-hour-purchases/partner-credit-hour-purchases.service';
import { PartnersService } from './../routes/partners/partners.service';
import { NoteService } from './../routes/note/note.service';
import { LiftsService } from './../routes/lifts/lifts.service';
import { AuthService } from './../auth/auth.service';
import { LifterStatsService } from './../routes/lifter-stats/lifter-stats.service';
import { AWSS3Helper } from './../helper/awss3.helper';
import { LiftersService } from './../routes/lifters/lifters.service';
import { LifterReviewsService } from './../routes/lifter-reviews/lifter-reviews.service';
import { LifterEquipmentService } from './../routes/lifter-equipment/lifter-equipment.service';
import { LifterCompletedTrainingVideosService } from './../routes/lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LeadsService } from './../routes/leads/leads.service';
import { EquipmentService } from './../routes/equipment/equipment.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronHelper } from './../helper/cron.helper';
import { CompletedLifterBadgeService } from './../routes/completed-lifter-badge/completed-lifter-badge.service';
import { BookingLocationCountService } from './../routes/booking-location-count/bookingLocationCount.service';
import { BadgeService } from './../routes/badge/badge.service';
import { AddressService } from './../routes/address/address.service';
import { WhatsNew } from 'src/model/whatsnew.entity';
import { TrainingVideo } from 'src/model/TrainingVideos.entity';
import { SurveyResponse } from 'src/model/surveyResponse.entity';
import { PendingVerification } from 'src/model/pendingVerification.entity';
import { PartnerReferral } from 'src/model/partnerReferrals.entity';
import { PartnerCreditHourPurchase } from 'src/model/partnerCreditHourPurchases.entity';
import { Note } from 'src/model/note.entity';
import { LifterStats } from 'src/model/lifterStats.entity';
import { Lifter } from 'src/model/lifters.entity';
import { LifterReview } from 'src/model/lifterReviews.entity';
import { LifterEquipment } from 'src/model/lifterEquipment.entity';
import { LifterCompletedTrainingVideo } from 'src/model/lifterCompletedTrainingVideos.entity';
import { Lead } from 'src/model/leads.entity';
import { Equipment } from 'src/model/equipment.entity';
import { CronJobDescription } from './../model/cronjob.entity';
import { CompletedLifterBadge } from 'src/model/completedLifterBadges.entity';
import { BookingLocationCount } from './../model/bookingLocationCount.entity';
import { Badge } from 'src/model/badges.entity';
import { Address } from 'src/model/addresses.entity';
import { Partner } from 'src/model/partner.entity';
import { Booking } from 'src/model/booking.entity';
import { BookingService } from './../routes/booking/booking.service';
import { Lift } from 'src/model/lifts.entity';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { AcceptedLiftService } from './../routes/accepted-lift/accepted-lift.service';
import { configService } from '@src/config/config.service';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Survey } from '@src/model/survey.entity';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailClient } from '@src/helper/email.client';
import { TextClient } from '@src/helper/text.client';
import { GoogleCalendarApiHelper } from '@src/helper/googleCalendar.helper';
import { BookingBatchDTO } from '@src/dto/booking.batch.dto';
import { AddressDTO } from '@src/dto/address.dto';
import { LifterBatchDTO } from '@src/dto/lifter.batch.dto';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';

async function run() {
  const seedId = Date.now()
    .toString()
    .split('')
    .reverse()
    .reduce((s, it, x) => (x > 3 ? s : (s += it)), '');

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);

  console.log('Initializing');
  //
  // Repo Initializaiton
  //
  const acceptedLiftRepo = connection.getRepository(AcceptedLift);
  const addressRepo = connection.getRepository(Address);
  const badgeRepo = connection.getRepository(Badge);
  const bookingRepo = connection.getRepository(Booking);
  const bookingLocationCountRepo =
    connection.getRepository(BookingLocationCount);
  const completedLifterBadgeRepo =
    connection.getRepository(CompletedLifterBadge);
  const cronJobRepo = connection.getRepository(CronJobDescription);
  const equipmentRepo = connection.getRepository(Equipment);
  const leadsRepo = connection.getRepository(Lead);
  const lifterCompletedTrainingVideoRepo = connection.getRepository(
    LifterCompletedTrainingVideo,
  );
  const lifterEquipmentRepo = connection.getRepository(LifterEquipment);
  const lifterReviewRepo = connection.getRepository(LifterReview);
  const lifterRepo = connection.getRepository(Lifter);
  const lifterStatsRepo = connection.getRepository(LifterStats);
  const lifterTransactionRepo = connection.getRepository(LifterTransaction);
  const liftRepo = connection.getRepository(Lift);
  const noteRepo = connection.getRepository(Note);
  const partnerRepo = connection.getRepository(Partner);
  const partnerCreditHourPurchasesRepo = connection.getRepository(
    PartnerCreditHourPurchase,
  );
  const partnerReferralRepo = connection.getRepository(PartnerReferral);
  const pendingVerificationRepo = connection.getRepository(PendingVerification);
  const surveyRepo = connection.getRepository(Survey);
  const surveyResponseRepo = connection.getRepository(SurveyResponse);
  const trainingVideoRepo = connection.getRepository(TrainingVideo);

  //
  // Service initialization
  //
  const authService = new AuthService();
  const acceptedLiftService = new AcceptedLiftService(
    acceptedLiftRepo,
    liftRepo,
  );
  const addressService = new AddressService(addressRepo);
  const badgeService = new BadgeService(badgeRepo);
  const bookingLocationService = new BookingLocationCountService(
    bookingLocationCountRepo,
    new PushNotificationHelper(),
  );
  const bookingService = new BookingService(
    bookingRepo,
    partnerRepo,
    partnerReferralRepo,
    liftRepo,
    acceptedLiftRepo,
    noteRepo,
    new EmailClient(),
    new GoogleCalendarApiHelper(),
    bookingLocationService,
    new CronHelper(new SchedulerRegistry(), cronJobRepo, new EventEmitter2()),
  );
  const completedLifterBadgeService = new CompletedLifterBadgeService(
    completedLifterBadgeRepo,
  );
  const equipmentService = new EquipmentService(
    equipmentRepo,
    lifterEquipmentRepo,
  );
  const leadService = new LeadsService(leadsRepo, new EmailClient());
  const lifterCompletedTrainingVideoService =
    new LifterCompletedTrainingVideosService(lifterCompletedTrainingVideoRepo);
  const lifterEquipmentService = new LifterEquipmentService(
    lifterEquipmentRepo,
  );
  const lifterReviewService = new LifterReviewsService(lifterReviewRepo);
  const lifterStatsService = new LifterStatsService(lifterStatsRepo);
  const lifterTransactionsService = new LifterTransactionsService(
    lifterTransactionRepo,
  );
  const lifterService = new LiftersService(
    lifterRepo,
    lifterStatsRepo,
    pendingVerificationRepo,
    new TextClient(),
    new EmailClient(),
    new AWSS3Helper(),
    addressService,
    completedLifterBadgeService,
    lifterCompletedTrainingVideoService,
    lifterEquipmentService,
    lifterReviewService,
    lifterStatsService,
    lifterTransactionsService,
    acceptedLiftService,
    authService,
    new PushNotificationHelper(),
  );
  const noteService = new NoteService(noteRepo);
  const partnerService = new PartnersService(partnerRepo, new EmailClient());
  const surveyService = new SurveyService(surveyRepo);
  const trainingVideoService = new TrainingVideosService(
    trainingVideoRepo,
    lifterCompletedTrainingVideoRepo,
  );

  console.log('Done initializing');
  //
  // Begin Data Creation
  //
  console.log('Beginning Data Creation');
  await createBookings(seedId, bookingService);
  await createLifters(lifterService);
}

const createBookings = async (
  seedId: string,
  bookingService: BookingService,
): Promise<void> => {
  const startingAddress = new AddressDTO({
    street: '123 N Main St',
    street2: '',
    state: 'UT',
    city: 'Salt Lake City',
    postalCode: '84004',
  });

  for (let i = 0; i < 10; i++) {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);
    console.log('Creating Booking ', i);
    await bookingService.createBatch(
      new BookingBatchDTO({
        startingAddress: startingAddress,
        endingAddress: startingAddress,
        booking: new BookingDTO({
          needsPickupTruck: false,
          name: `test-${seedId}-${i}`,
          phone: '8015555555',
          email: 'test@test.com',
          startTime: new Date(),
          endTime: endTime,
          lifterCount: 2,
          hoursCount: 2,
          totalCost: 240,
          timezone: 'America/Denver',
          distanceInfo: 'none',
        }),
      }),
    );
  }
};

const createLifters = async (
  lifterService: LiftersService,
): Promise<LifterDTO[]> => {
  const address = new AddressDTO({
    street: '123 N Main St',
    street2: '',
    state: 'UT',
    city: 'Salt Lake City',
    postalCode: '84004',
  });

  const lifterOne = new LifterDTO({
    firstName: 'Test',
    lastName: 'Tester',
    alias: 'Test 1',
    email: 'test1@test.com',
    phone: '8015555556',
    passedBc: true,
    hasPickupTruck: false,
    status: 'contacted',
    acceptedContract: true,
  });

  const lifterTwo = new LifterDTO({
    firstName: 'Test 2',
    lastName: 'Tester',
    alias: 'Test 2',
    email: 'test2@test.com',
    phone: '8015555555',
    passedBc: true,
    hasPickupTruck: true,
    status: 'contacted',
    acceptedContract: true,
  });

  const lifters: LifterDTO[] = [];
  lifters.push(
    await lifterService.createBatch(
      new LifterBatchDTO({
        address: address,
        lifter: lifterOne,
      }),
    ),
    await lifterService.createBatch(
      new LifterBatchDTO({
        address: address,
        lifter: lifterTwo,
      }),
    ),
  );

  return lifters;
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('seed error', error);
    process.exit(1);
  });
