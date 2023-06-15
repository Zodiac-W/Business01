import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson-dto';
import { UpdateLessonDto } from './dto/update-lesson-dto';
import { Lesson_meta } from './entities/lesson-meta.entity';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Lesson_meta)
    private lesson_metaRepository: Repository<Lesson_meta>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<any> {
    const {
      lesson_title,
      lesson_description,
      lesson_content,
      lesson_duration,
      lesson_status,
    } = createLessonDto;

    const lesson = new Lesson();
    lesson.lesson_title = lesson_title;
    lesson.lesson_description = lesson_description;
    lesson.lesson_content = lesson_content;
    lesson.lesson_duration = lesson_duration;
    lesson.lesson_status = lesson_status;

    await this.lessonRepository.save(lesson);
    return lesson;
  }

  async getAllLessons(): Promise<any> {
    const lessons = await this.lessonRepository.find();
    return lessons;
  }

  async getAllLessonsTitles(): Promise<any> {
    const titles = await this.lessonRepository.find({
      select: ['lesson_title'],
    });

    const lessonTitles = titles.map((title) => {
      return { lesson_title: title };
    });
    return lessonTitles;
  }

  async getLesson(id: number): Promise<any> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw Error("Lesson doesn't exist");
    }
    return lesson;
  }

  async deleteLesson(id: number): Promise<any> {
    const lesson = await this.getLesson(id);

    await this.lessonRepository.softDelete(id);
    return lesson;
  }

  async updateLesson(
    id: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<any> {
    let lesson = await this.getLesson(id);

    lesson = { ...lesson, ...updateLessonDto };
    await this.lessonRepository.save(lesson);
    return lesson;
  }

  async getLessonClass(id: number): Promise<any> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['lesson_meta'],
    });

    const meta = lesson.lesson_meta;
    const classes = meta.map((item) => {
      if (item.meta_key == 'class') {
        return { class: item.meta_value };
      }
    });

    return classes;
  }

  async setLessonClass(id: number, className: string): Promise<any> {
    const lesson = await this.getLesson(id);

    const lesson_meta = new Lesson_meta();
    lesson_meta.meta_key = 'class';
    lesson_meta.meta_value = className;
    lesson_meta.lesson = lesson;

    await this.lesson_metaRepository.save(lesson_meta);
    return lesson_meta;
  }

  async getLessonMeta(id: number): Promise<any> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['lesson_meta'],
    });
    const meta = lesson.lesson_meta;
    return meta;
  }

  async setLessonMeta(id: number, key: string, value: any): Promise<any> {
    const lesson = await this.getLesson(id);

    const lesson_meta = new Lesson_meta();
    lesson_meta.meta_key = key;
    lesson_meta.meta_value = value;
    lesson_meta.lesson = lesson;

    await this.lesson_metaRepository.save(lesson_meta);
    return lesson_meta;
  }
}
