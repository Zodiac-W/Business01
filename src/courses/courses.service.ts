import { Injectable } from '@nestjs/common';
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
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<any> {
    const { course_title, course_description, course_duration, course_status } =
      createCourseDto;

    const course = new Course();
    course.course_title = course_title;
    course.course_description = course_description;
    course.course_duration = course_duration;
    course.course_status = course_status;

    await this.courseRepository.save(course);
    return course;
  }

  async getAllCourses(): Promise<any> {
    const courses = await this.courseRepository.find();
    return courses;
  }

  async getAllCoursesTitles(): Promise<any> {
    const courseTitles = await this.courseRepository.find({
      select: ['course_title'],
    });

    const coursesTitles = courseTitles.map((courseTitle) => {
      return { course_title: courseTitle };
    });
    return coursesTitles;
  }

  async getCourse(id: number): Promise<any> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw Error('Course does not exist');
    }
    return course;
  }

  async deleteCourse(id: number): Promise<any> {
    const course = await this.getCourse(id);

    await this.courseRepository.softDelete(id);
    return course;
  }

  async updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<any> {
    let course = await this.getCourse(id);

    course = { ...course, ...updateCourseDto };
    await this.courseRepository.save(course);
    return course;
  }

  async setCourseRounds(id: number, round: number): Promise<any> {
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
  }

  async getCourseRounds(id: number): Promise<any> {
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
  }

  async getCourseMeta(id: number): Promise<any> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['course_meta'],
    });

    const meta = course.course_meta;
    return meta;
  }

  async setCourseMeta(id: number, key: string, value: any): Promise<any> {
    const course = await this.getCourse(id);

    const course_meta = new Course_meta();
    course_meta.meta_key = key;
    course_meta.meta_value = value;
    course_meta.course = course;

    await this.course_metaRepository.save(course_meta);
    return course_meta;
  }

  async getCourseLesson(id: number): Promise<any> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['course_lesson', 'course_lesson.lesson'],
    });

    const lessons = course.course_lesson;
    return lessons;
  }

  async setCourseLesson(courseId: number, lessonId: number): Promise<any> {
    const course = await this.getCourse(courseId);
    const lesson = await this.lessonsService.getLesson(lessonId);

    const course_lesson = new Course_lesson();
    course_lesson.course = course;
    course_lesson.lesson = lesson;

    await this.course_lessonRepository.save(course_lesson);
    return course_lesson;
  }

  async createCourseLesson(
    id: number,
    createLessonDto: CreateLessonDto,
  ): Promise<any> {
    const course = await this.getCourse(id);
    const lesson = await this.lessonsService.createLesson(createLessonDto);

    const course_lesson = new Course_lesson();
    course_lesson.course = course;
    course_lesson.lesson = lesson;

    await this.course_lessonRepository.save(course_lesson);
    return course_lesson;
  }

  async getCourseInstructor(id: number): Promise<any> {
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
  }
}
