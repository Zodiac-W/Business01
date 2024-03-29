import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson-dto';
import { LessonsService } from 'src/lessons/lessons.service';
import { Instructor_course } from 'src/users/entities/instructor-course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Course_lesson } from './entities/course-lesson.entity';
import { Course_meta } from './entities/course-meta.entity';
import { Course } from './entities/course.entity';
import { Course_quiz } from './entities/course-quiz.entity';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { Course_discusion } from './entities/course-discusion.entity';
import { DiscusionService } from 'src/discusion/discusion.service';
import { Course_metadata_group } from './entities/course-meta-group.entity';
import { CreateCourseWithMetaDto } from './dto/create-course-with-meta-dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Course_meta)
    private course_metaRepository: Repository<Course_meta>,

    @InjectRepository(Course_lesson)
    private course_lessonRepository: Repository<Course_lesson>,
    private lessonsService: LessonsService,

    @InjectRepository(Instructor_course)
    private instructor_courseRepository: Repository<Instructor_course>,

    @InjectRepository(Course_quiz)
    private course_quizRepository: Repository<Course_quiz>,
    private quizzesService: QuizzesService,

    @InjectRepository(Course_discusion)
    private course_discusionRepository: Repository<Course_discusion>,
    private discusionService: DiscusionService,

    @InjectRepository(Course_metadata_group)
    private course_metadata_groupRepository: Repository<Course_metadata_group>,
  ) {}
  /**
   *
   * COURSE
   * GET ALL
   * GET ONE
   * GET ALL TITLES
   * SET COURSE
   * DELETE COURSE
   * UPDATE COURSE
   *
   */
  async createCourse(createCourseDto: CreateCourseDto): Promise<any> {
    try {
      const {
        course_title,
        course_description,
        course_duration,
        course_status,
      } = createCourseDto;

      const course = new Course();
      course.course_title = course_title;
      course.course_description = course_description;
      course.course_duration = course_duration;
      course.course_status = course_status;

      await this.courseRepository.save(course);
      return course;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCourses(): Promise<any> {
    try {
      const courses = await this.courseRepository.find();

      if (courses.length < 1) {
        throw new Error('There is not courses');
      }

      return courses;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCoursesTitles(): Promise<any> {
    try {
      const courseTitles = await this.courseRepository.find({
        select: ['course_title'],
      });

      const coursesTitles = courseTitles.map((courseTitle) => {
        return { course_title: courseTitle };
      });
      return coursesTitles;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourse(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      if (!course) {
        throw new Error('Course does not exist');
      }
      return course;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCourse(id: number): Promise<any> {
    try {
      const course = await this.getCourse(id);

      await this.courseRepository.softDelete(id);
      return course;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<any> {
    try {
      let course = await this.getCourse(id);

      course = { ...course, ...updateCourseDto };
      await this.courseRepository.save(course);
      return course;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE
   * CREATE COURSE WITH METADATA
   *
   */
  async setCourseWithMeta(
    createCourseWithMetaDto: CreateCourseWithMetaDto,
  ): Promise<any> {
    try {
      const {
        course_title,
        course_description,
        course_duration,
        course_status,
        metadata_group_name,
        metadata,
      } = createCourseWithMetaDto;
      const createCourse = {
        course_title,
        course_description,
        course_duration,
        course_status,
      };
      const course = await this.createCourse(createCourse);
      let group = await this.getCourseMetadataGroupByName(metadata_group_name);

      if (group.message) {
        group = await this.setCourseMetadataGroup(metadata_group_name);
      }

      metadata.forEach(async (item) => {
        const meta = new Course_meta();

        meta.course = course;
        meta.course_metadata_group = group;
        meta.meta_key = item.key;
        meta.meta_value = item.value;

        await this.course_metaRepository.save(meta);
      });

      return course;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE
   * SET COURSE ROUNDS
   * GET COURSE ROUNDS
   *
   */
  async setCourseRounds(id: number, round: number): Promise<any> {
    try {
      const course = await this.getCourse(id);

      const course_meta = new Course_meta();
      course_meta.meta_key = 'round';
      course_meta.course = course;

      if (round) {
        course_meta.meta_value = round.toString();
      } else {
        const rounds = await this.getCourseRounds(id);
        let round = rounds.rounds;
        ++round;
        course_meta.meta_value = round.toString();
      }

      await this.course_metaRepository.save(course_meta);
      return course_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseRounds(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['course_meta'],
      });

      const meta = course.course_meta;
      const rounds = meta.map((item) => {
        if (item.meta_key == 'round') {
          return item.meta_value;
        }
      });

      const currentRound = rounds[rounds.length - 1];
      return { rounds: currentRound };
    } catch (err) {
      throw new HttpException(err.messagem, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE
   * GET COURSE META
   * SET COURSE META
   * SET COURSE META LIST
   * GET COURSE META BY KEY
   *
   */
  async getCourseMeta(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['course_meta'],
      });

      const meta = course.course_meta;
      return meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseMetaList(
    course_id: number,
    group_name: string,
    metadata: [key: any, value: any],
  ): Promise<any> {
    try {
      const course = await this.getCourse(course_id);
      let group = await this.getCourseMetadataGroupByName(group_name);
      if (group.message) {
        group = await this.setCourseMetadataGroup(group_name);
      }

      metadata.forEach(async (item) => {
        const meta = new Course_meta();

        meta.course = course;
        meta.course_metadata_group = group;
        meta.meta_key = item.key;
        meta.meta_value = item.value;

        await this.course_metaRepository.save(meta);
      });
      return metadata;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseMeta(
    course_id: number,
    group_name: string,
    key: string,
    value: any,
  ): Promise<any> {
    try {
      const course = await this.getCourse(course_id);
      let group = await this.getCourseMetadataGroupByName(group_name);

      if (group.message) {
        group = await this.setCourseMetadataGroup(group_name);
      }

      const course_meta = new Course_meta();
      course_meta.meta_key = key;
      course_meta.meta_value = value;
      course_meta.course = course;
      course_meta.course_metadata_group = group;

      await this.course_metaRepository.save(course_meta);
      return course_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseMetaByKey(course_id: number, key: string): Promise<any> {
    try {
      const course_meta = await this.course_metaRepository.findOne({
        where: { course: { id: course_id }, meta_key: key },
        relations: ['course_metadata_group'],
        order: { id: 'DESC' },
      });
      if (!course_meta) {
        throw new Error('Not found');
      }

      return course_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE METADATA GROUP
   * GET ALL GROUPS
   * GET ONE GROUP
   * GET GROUP BY NAME
   * SET NEW GROUP
   * DELETE GROUP
   * UPDATE GROUP
   *
   */
  async getCourseMetadataGroups(): Promise<any> {
    try {
      const groups = await this.course_metadata_groupRepository.find();

      if (groups.length < 1) {
        throw new Error('There is no groups yet');
      }
      return groups;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseMetadataGroup(group_id: number): Promise<any> {
    try {
      const group = await this.course_metadata_groupRepository.findOne({
        where: { id: group_id },
      });
      if (!group) {
        throw new Error('Not found');
      }
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseMetadataGroupByName(group_name: string): Promise<any> {
    try {
      if (group_name === null) {
        throw new Error('Please enter the group name');
      }
      const group = await this.course_metadata_groupRepository.findOne({
        where: { course_metadata_group_name: group_name },
      });
      if (!group) {
        return { message: "Doesn't exist" };
      }
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseMetadataGroup(name: string): Promise<any> {
    try {
      const group = new Course_metadata_group();
      group.course_metadata_group_name = name;

      await this.course_metadata_groupRepository.save(group);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCourseMetadataGroup(group_id: number): Promise<any> {
    try {
      const group = await this.getCourseMetadataGroup(group_id);

      await this.course_metadata_groupRepository.softDelete(group_id);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourseMetadataGroup(
    group_id: number,
    new_name: string,
  ): Promise<any> {
    try {
      const group = await this.getCourseMetadataGroup(group_id);

      group.course_metadata_group_name = new_name;

      await this.course_metadata_groupRepository.save(group);
      return group;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE - LESSON
   * GET ONE COURSE LESSON
   * SET COURSE LESSON
   * CREATE NEW LESSON AND SET IT TO COURSE
   * DELETE COURSE LESSON
   * UPDATE COURSE LESSON
   *
   */
  async getCourseLessons(id: number): Promise<any> {
    try {
      const course_lessons = await this.course_lessonRepository.find({
        where: { course: { id } },
        relations: ['course', 'lesson'],
      });
      if (course_lessons.length < 1) {
        throw new Error("This course doesn't have lessons");
      }
      return course_lessons;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseLesson(course_id: number, lesson_id: number): Promise<any> {
    try {
      const course_lesson = await this.course_lessonRepository.findOne({
        where: {
          course: { id: course_id },
          lesson: { id: lesson_id },
        },
        relations: ['course', 'lesson'],
        order: { id: 'DESC' },
      });

      if (!course_lesson) {
        throw new Error("This lesson doesn't exist in this course");
      }

      return course_lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseLesson(course_id: number, lesson_id: number): Promise<any> {
    try {
      const course = await this.getCourse(course_id);
      const lesson = await this.lessonsService.getLesson(lesson_id);

      const course_lesson = new Course_lesson();
      course_lesson.course = course;
      course_lesson.lesson = lesson;

      await this.course_lessonRepository.save(course_lesson);
      return course_lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createCourseLesson(
    id: number,
    createLessonDto: CreateLessonDto,
  ): Promise<any> {
    try {
      const course = await this.getCourse(id);
      const lesson = await this.lessonsService.createLesson(createLessonDto);

      const course_lesson = new Course_lesson();
      course_lesson.course = course;
      course_lesson.lesson = lesson;

      await this.course_lessonRepository.save(course_lesson);
      return course_lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCourseLesson(course_id: number, lesson_id: number): Promise<any> {
    try {
      const course_lesson = await this.getCourseLesson(course_id, lesson_id);

      if (course_lesson.message) {
        return course_lesson;
      }

      await this.course_lessonRepository.softDelete(course_lesson.id);
      return course_lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourseLesson(
    course_id: number,
    lesson_id_old: number,
    lesson_id_new: number,
  ): Promise<any> {
    try {
      const course_lesson = await this.getCourseLesson(
        course_id,
        lesson_id_old,
      );

      if (course_lesson.message) {
        return course_lesson;
      }

      await this.deleteCourseLesson(course_id, lesson_id_old);
      const new_course_lesson = await this.setCourseLesson(
        course_id,
        lesson_id_new,
      );
      return new_course_lesson;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE - LESSON
   * GET COURSE INSTRUCTOR
   *
   */
  async getCourseInstructor(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['instructor_course', 'instructor_course.user'],
      });

      const instructor_course = course.instructor_course;
      // const instructor = instructor_course.find((item)=>)
      // TEST THE ENDPOINT RETURN THEN COMPLETE THE ARRAY FUNCTION
      // IF NULL THEN IT IS SUPERUSER

      const instructor = instructor_course.map((item) => {
        return item.user;
      });
      if (instructor.length < 1) {
        return { message: 'SUPERUSER' };
      }
      return instructor;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE - QUIZ
   * GET ALL COURSE QUIZZES
   * GET ONE COURSE QUIZ
   * SET COURSE QUIZ
   * DELETE COURSE QUIZ
   * UPDATE COURSE QUIZ
   *
   */
  async getCourseQuizzes(course_id: number): Promise<any> {
    try {
      const course_quizzes = await this.course_quizRepository.find({
        where: { course: { id: course_id } },
        relations: ['course', 'quiz'],
      });

      if (course_quizzes.length < 1) {
        throw new Error("This course doesn't have any quizzes");
      }
      return course_quizzes;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseQuiz(course_id: number, quiz_id: number): Promise<any> {
    try {
      const course_quiz = await this.course_quizRepository.findOne({
        where: {
          course: { id: course_id },
          quiz: { id: quiz_id },
        },
        relations: ['course', 'quiz'],
        order: { id: 'DESC' },
      });

      if (!course_quiz) {
        throw new Error("This course doesn't have this quiz");
      }

      return course_quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseQuiz(course_id: number, quiz_id: number): Promise<any> {
    try {
      const course = await this.getCourse(course_id);
      const quiz = await this.quizzesService.getQuiz(quiz_id);

      const course_quiz = new Course_quiz();
      course_quiz.course = course;
      course_quiz.quiz = quiz;

      await this.course_quizRepository.save(course_quiz);
      return course_quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCourseQuiz(course_id: number, quiz_id: number): Promise<any> {
    try {
      const course_quiz = await this.getCourseQuiz(course_id, quiz_id);

      if (course_quiz.message) {
        return course_quiz;
      }

      await this.course_quizRepository.softDelete(course_quiz.id);
      return course_quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourseQuiz(
    course_id: number,
    quiz_id_old: number,
    quiz_id_new: number,
  ): Promise<any> {
    try {
      const course_quiz = await this.getCourseQuiz(course_id, quiz_id_old);

      if (course_quiz.message) {
        return course_quiz;
      }

      await this.deleteCourseQuiz(course_id, quiz_id_old);
      const new_course_quiz = await this.setCourseQuiz(course_id, quiz_id_new);
      return new_course_quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * COURSE - DISCUSSION
   * GET ALL COURSE DISCUSSIONS
   * GET ONE COURSE DISCUSSION
   * SET COURSE DISCUSSION
   * DELETE COURSE DISCUSSION
   * UPDATE COURSE DISCUSSION
   *
   */
  async getCourseDiscusions(course_id: number): Promise<any> {
    try {
      const course_discusion = await this.course_discusionRepository.find({
        where: { course: { id: course_id } },
        relations: ['course', 'discusion'],
      });

      if (course_discusion.length < 1) {
        throw new Error("This course doesn't have any discussions yet");
      }

      return course_discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCourseDiscusion(
    course_id: number,
    discusion_id: number,
  ): Promise<any> {
    try {
      const course_discusion = await this.course_discusionRepository.findOne({
        where: { course: { id: course_id }, discusion: { id: discusion_id } },
        relations: ['course', 'discusion'],
      });

      if (!course_discusion) {
        throw new Error("This course doesn't have this discussion");
      }

      return course_discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setCourseDiscusion(
    course_id: number,
    discusion_id: number,
  ): Promise<any> {
    try {
      const course = await this.getCourse(course_id);
      const discusion = await this.discusionService.getDiscusion(discusion_id);

      const course_discusion = new Course_discusion();
      course_discusion.course = course;
      course_discusion.discusion = discusion;

      await this.course_discusionRepository.save(course_discusion);
      return course_discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCourseDiscusion(
    course_id: number,
    discusion_id: number,
  ): Promise<any> {
    try {
      const course_discusion = await this.getCourseDiscusion(
        course_id,
        discusion_id,
      );

      if (course_discusion.message) {
        return course_discusion;
      }

      await this.course_discusionRepository.softDelete(course_discusion.id);
      return course_discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourseDiscusion(
    course_id: number,
    discusion_id_old: number,
    discusion_id_new: number,
  ): Promise<any> {
    try {
      const course_discusion = await this.getCourseDiscusion(
        course_id,
        discusion_id_old,
      );

      if (course_discusion.message) {
        return course_discusion;
      }

      await this.course_discusionRepository.softDelete(course_discusion.id);
      const new_course_discusion = await this.setCourseDiscusion(
        course_id,
        discusion_id_new,
      );
      return new_course_discusion;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
