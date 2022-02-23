import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { LiftersService } from './../lifters/lifters.service';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CheckrService {
  private readonly logger: Logger = new Logger(CheckrService.name);

  constructor(private readonly lifterService: LiftersService) {}

  public async handleBcWebhook(request: any): Promise<void> {
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
            this.logger.error(`unable to update lifter: ${err}`);
          }
          return;
        } else this.logger.error('Report status not clear');
        break;
      case 'candidate.created':
        this.logger.debug('Checkr Candidate Created');
      default:
        break;
    }
  }
}
