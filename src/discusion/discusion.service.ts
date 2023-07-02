import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discusion } from './entities/discusion.entity';
import { Repository } from 'typeorm';

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
   * SET STUDENT QUIZ
   * DELETE STUDENT QUIZ
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
    } catch (err) {
      return { message: err.message };
    }
  }
}
