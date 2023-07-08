import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor_lesson } from 'src/users/entities/instructor-lesson.entity';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson-dto';
import { UpdateLessonDto } from './dto/update-lesson-dto';
import { Lesson_meta } from './entities/lesson-meta.entity';
import { Lesson } from './entities/lesson.entity';
import { Lesson_metadata_group } from './entities/lesson-meta-group.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Lesson_meta)
    private lesson_metaRepository: Repository<Lesson_meta>,

    @InjectRepository(Instructor_lesson)
    private instructor_lessonRepository: Repository<Instructor_lesson>,

    @InjectRepository(Lesson_metadata_group)
    private lesson_metadata_groupRepository: Repository<Lesson_metadata_group>,
  ) {}
  /**
   *
   * LESSON
   * GET ALL LESSONS
   * GET ALL LESSONS' TITLES
   * GET ONE LESSON
   * SET NEW LESSON
   * DELETE LESSON
   * UPDATE LESSON
   *
   */
  async createLesson(createLessonDto: CreateLessonDto): Promise<any> {
    try {
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
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getAllLessons(): Promise<any> {
    try {
      const lessons = await this.lessonRepository.find();
      if (lessons.length < 1) {
        throw new Error('There is no lessons');
      }
      return lessons;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getAllLessonsTitles(): Promise<any> {
    try {
      const titles = await this.lessonRepository.find({
        select: ['lesson_title'],
      });

      const lessonTitles = titles.map((title) => {
        return { lesson_title: title };
      });
      return lessonTitles;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getLesson(id: number): Promise<any> {
    try {
      const lesson = await this.lessonRepository.findOne({ where: { id } });
      if (!lesson) {
        throw Error("Lesson doesn't exist");
      }
      return lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async deleteLesson(id: number): Promise<any> {
    try {
      const lesson = await this.getLesson(id);

      await this.lessonRepository.softDelete(id);
      return lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateLesson(
    id: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<any> {
    try {
      let lesson = await this.getLesson(id);

      lesson = { ...lesson, ...updateLessonDto };
      await this.lessonRepository.save(lesson);
      return lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * LESSON
   * GET LESSON CLASS
   * SET LESSON CLASS
   *
   */
  async getLessonClass(id: number): Promise<any> {
    try {
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
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async setLessonClass(id: number, className: string): Promise<any> {
    try {
      const lesson = await this.getLesson(id);

      const lesson_meta = new Lesson_meta();
      lesson_meta.meta_key = 'class';
      lesson_meta.meta_value = className;
      lesson_meta.lesson = lesson;

      await this.lesson_metaRepository.save(lesson_meta);
      return lesson_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * LESSON - META
   * GET LESSON META
   * SET LESSON META
   * GET LESSON META BY KEY
   *
   */
  async getLessonMeta(id: number): Promise<any> {
    try {
      const lesson = await this.lessonRepository.findOne({
        where: { id },
        relations: ['lesson_meta'],
      });
      const meta = lesson.lesson_meta;
      return meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async setLessonMeta(
    lesson_id: number,
    group_name: string,
    key: string,
    value: any,
  ): Promise<any> {
    try {
      const lesson = await this.getLesson(lesson_id);

      let group = await this.getLessonMetadataGroupByName(group_name);

      if (group.message) {
        group = await this.setLessonMetadataGroup(group_name);
      }

      const lesson_meta = new Lesson_meta();
      lesson_meta.meta_key = key;
      lesson_meta.meta_value = value;
      lesson_meta.lesson = lesson;
      lesson_meta.lesson_metadata_group = group;

      await this.lesson_metaRepository.save(lesson_meta);
      return lesson_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async setLessonMetaList(
    lesson_id: number,
    group_name: string,
    metadata: [key: any, value: any],
  ): Promise<any> {
    try {
      const lesson = await this.getLesson(lesson_id);
      let group = await this.getLessonMetadataGroupByName(group_name);
      if (group.message) {
        group = await this.setLessonMetadataGroup(group_name);
      }

      metadata.forEach(async (item) => {
        const meta = new Lesson_meta();

        meta.lesson = lesson;
        meta.lesson_metadata_group = group;
        meta.meta_key = item.key;
        meta.meta_value = item.value;

        await this.lesson_metaRepository.save(meta);
      });
      return metadata;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getLessonMetaByKey(lesson_id: number, key: string): Promise<any> {
    try {
      const lesson_meta = await this.lesson_metaRepository.findOne({
        where: { lesson: { id: lesson_id }, meta_key: key },
        relations: ['lesson_metadata_group'],
        order: { id: 'DESC' },
      });
      if (!lesson_meta) {
        throw new Error('Not found');
      }

      return lesson_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * LESSON METADATA GROUP
   * GET ALL GROUPS
   * GET ONE GROUP
   * GET GROUP BY NAME
   * SET NEW GROUP
   * DELETE GROUP
   * UPDATE GROUP
   *
   */
  async getLessonMetadataGroups(): Promise<any> {
    try {
      const groups = await this.lesson_metadata_groupRepository.find();

      if (groups.length < 1) {
        throw new Error('There is no groups yet');
      }
      return groups;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getLessonMetadataGroup(group_id: number): Promise<any> {
    try {
      const group = await this.lesson_metadata_groupRepository.findOne({
        where: { id: group_id },
      });
      if (!group) {
        throw new Error('Not found');
      }
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getLessonMetadataGroupByName(group_name: string): Promise<any> {
    try {
      const group = await this.lesson_metadata_groupRepository.findOne({
        where: { lesson_metadata_group_name: group_name },
      });
      if (!group) {
        return { message: "Doesn't eixst" };
      }
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async setLessonMetadataGroup(name: string): Promise<any> {
    try {
      const group = new Lesson_metadata_group();
      group.lesson_metadata_group_name = name;

      await this.lesson_metadata_groupRepository.save(group);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async deleteLessonMetadataGroup(group_id: number): Promise<any> {
    try {
      const group = await this.getLessonMetadataGroup(group_id);

      await this.lesson_metadata_groupRepository.softDelete(group_id);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateLessonMetadataGroup(
    group_id: number,
    new_name: string,
  ): Promise<any> {
    try {
      const group = await this.getLessonMetadataGroup(group_id);
      group.lesson_metadata_group_name = new_name;

      await this.lesson_metadata_groupRepository.save(group);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * LESSON
   * GET LESSON INSTRUCTOR
   *
   */
  async getLessonInstructor(id: number): Promise<any> {
    try {
      const lesson = await this.lessonRepository.findOne({
        where: { id },
        relations: ['instructor_lesson', 'instructor_lesson.user'],
      });
      const instructor_lesson = lesson.instructor_lesson;

      const instructor = instructor_lesson.map((item) => {
        return item.user;
      });
      if (instructor.length < 1) {
        return { message: 'SUPERUSER' };
      }
      return instructor;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
}
