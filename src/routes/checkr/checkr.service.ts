import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { LiftersService } from './../lifters/lifters.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LifterDTO } from '@src/dto/lifter.dto';

@Injectable()
export class CheckrService {
  constructor(private readonly lifterService: LiftersService) {}

  public async handleBcWebhook(request: any): Promise<void> {
    console.log(request);
    switch (request.type) {
      case 'report.completed':
        if (request.data.object.status === 'clear') {
          try {
            const candidate = await axios.get(
              `https://api.checkr.com/v1/candidates/${request.data.object.candidate_id}`,
              {
                auth: {
                  username: process.env.CHECKR_API_KEY,
                  password: '',
                },
              },
            );

            const lifter = await this.lifterService.getByUserId(
              null,
              candidate?.data?.metadata?.userId,
            );

            lifter.passedBc = true;
            lifter.bcInProgress = true;

            const dto = new LifterBatchDTO();
            dto.lifter = lifter;

            await this.lifterService.updateBatch(dto);
          } catch (err) {
            console.error(`unable to update lifter: ${err}`);
          }

          console.error('Report status clear');
          return;
        } else console.error('Report status not clear');
        break;
      case 'candidate.created':
        console.info('Checkr Candidate Created');
      default:
        console.warn('Unhandled bc webhook type');
        break;
    }
  }
}
