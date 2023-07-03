import { Injectable } from '@nestjs/common';
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
        return { message: 'There is no discussions yet' };
      }
      return discusions;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getDiscusion(discusion_id: number): Promise<any> {
    try {
      const discusion = await this.discusionRepository.findOne({
        where: { id: discusion_id },
      });

      if (!discusion) {
        return { message: "This discussion doen't exist" };
      }

      return discusion;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setDiscusion(createDiscusionDto: CreateDiscusionDto): Promise<any> {
    const { discusion_txt, discusion_status } = createDiscusionDto;

    const discusion = new Discusion();
    discusion.discusion_txt = discusion_txt;
    discusion.discusion_status = discusion_status;

    await this.discusionRepository.save(discusion);
    return discusion;
  }

  async deleteDiscusion(discusion_id: number): Promise<any> {
    const discusion = await this.getDiscusion(discusion_id);

    if (discusion.message) {
      return discusion;
    }

    await this.discusionRepository.softDelete(discusion_id);
    return discusion;
  }

  async updateDiscusion(
    discusion_id: number,
    updateDiscusionDto: UpdateDiscusionDto,
  ): Promise<any> {
    let discusion = await this.getDiscusion(discusion_id);

    if (discusion.message) {
      return discusion;
    }

    discusion = { ...discusion, ...updateDiscusionDto };

    await this.discusionRepository.save(discusion);
    return discusion;
  }
}
