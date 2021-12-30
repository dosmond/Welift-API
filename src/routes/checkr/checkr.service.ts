import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { LiftersService } from './../lifters/lifters.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LifterDTO } from 'src/dto/lifter.dto';

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

            console.log(candidate);

            const dto = new LifterBatchDTO();
            dto.lifter = new LifterDTO();
            dto.lifter.id = candidate?.data?.metadata?.lifterId;
            dto.lifter.passedBc = true;

            await this.lifterService.updateBatch(dto);
          } catch (err) {
            console.log(`unable to update lifter: ${err}`);
          }

          console.log('Report status clear');
          return;
        } else console.log('Report status not clear');
        break;
      default:
        console.log('Unhandled bc webhook type');
        break;
    }
  }
}
