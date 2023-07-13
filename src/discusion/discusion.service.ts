import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discusion } from './entities/discusion.entity';
import { Repository } from 'typeorm';
import { CreateDiscusionDto } from './dto/create-discusion-dto';
import { UpdateDiscusionDto } from './dto/update-discusion-dto';

@Injectable()
export class DiscusionService {
  constructor(
    @InjectRepository(Discusion)
    private discusionRepository: Repository<Discusion>,
  ) {}
  /**
   *
   * Discussion
   * GET ALL
   * GET ONE
   * SET DISCUSSION
   * DELETE DISCUSSION
   * UPDATE DISCUSSIO
   *
   */
  async getDiscusions(): Promise<any> {
    try {
      const discusions = await this.discusionRepository.find();

      if (discusions.length < 1) {
        throw new Error('There is no discussions yet');
      }
      return discusions;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDiscusion(discusion_id: number): Promise<any> {
    try {
      const discusion = await this.discusionRepository.findOne({
        where: { id: discusion_id },
      });

      if (!discusion) {
        throw new Error("This discussion doen't exist");
      }

      return discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setDiscusion(createDiscusionDto: CreateDiscusionDto): Promise<any> {
    try {
      const { discusion_txt, discusion_status } = createDiscusionDto;

      const discusion = new Discusion();
      discusion.discusion_txt = discusion_txt;
      discusion.discusion_status = discusion_status;

      await this.discusionRepository.save(discusion);
      return discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteDiscusion(discusion_id: number): Promise<any> {
    try {
      const discusion = await this.getDiscusion(discusion_id);

      if (discusion.message) {
        return discusion;
      }

      await this.discusionRepository.softDelete(discusion_id);
      return discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDiscusion(
    discusion_id: number,
    updateDiscusionDto: UpdateDiscusionDto,
  ): Promise<any> {
    try {
      let discusion = await this.getDiscusion(discusion_id);

      if (discusion.message) {
        return discusion;
      }

      discusion = { ...discusion, ...updateDiscusionDto };

      await this.discusionRepository.save(discusion);
      return discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
