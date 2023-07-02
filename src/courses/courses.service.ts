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
import { Course_quiz } from './entities/course-quiz.entity';
import { QuizzesService } from 'src/quizzes/quizzes.service';

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
  /**
   *
   * COURSE
   * SET COURSE ROUNDS
   * GET COURSE ROUNDS
   *
   */
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
  /**
   *
   * COURSE
   * GET COURSE META
   * SET COURSE META
   *
   */
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
    const course_lessons = await this.course_lessonRepository.find({
      where: { course: { id } },
      relations: ['course', 'lesson'],
    });

    try {
      if (course_lessons.length < 1) {
        return { message: "This course doesn't have lessons" };
      }
      return course_lessons;
    } catch (err) {
      return { message: err.message };
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
        return { message: "This lesson doesn't exist in this course" };
      }

      return course_lesson;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setCourseLesson(course_id: number, lesson_id: number): Promise<any> {
    const course = await this.getCourse(course_id);
    const lesson = await this.lessonsService.getLesson(lesson_id);

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

  async deleteCourseLesson(course_id: number, lesson_id: number): Promise<any> {
    const course_lesson = await this.getCourseLesson(course_id, lesson_id);

    if (course_lesson.message) {
      return course_lesson;
    }

    await this.course_lessonRepository.softDelete(course_lesson.id);
    return course_lesson;
  }

  async updateCourseLesson(
    course_id: number,
    lesson_id_old: number,
    lesson_id_new: number,
  ): Promise<any> {
    const course_lesson = await this.getCourseLesson(course_id, lesson_id_old);

    if (course_lesson.message) {
      return course_lesson;
    }

    await this.deleteCourseLesson(course_id, lesson_id_old);
    const new_course_lesson = await this.setCourseLesson(
      course_id,
      lesson_id_new,
    );
    return new_course_lesson;
  }
  /**
   *
   * COURSE - LESSON
   * GET COURSE INSTRUCTOR
   *
   */
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
        return { message: "This course doesn't have any quizzes" };
      }
      return course_quizzes;
    } catch (err) {
      return { message: err.message };
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
        return { message: "This course doesn't have this quiz" };
      }

      return course_quiz;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setCourseQuiz(course_id: number, quiz_id: number): Promise<any> {
    const course = await this.getCourse(course_id);
    const quiz = await this.quizzesService.getQuiz(quiz_id);

    const course_quiz = new Course_quiz();
    course_quiz.course = course;
    course_quiz.quiz = quiz;

    await this.course_quizRepository.save(course_quiz);
    return course_quiz;
  }

  async deleteCourseQuiz(course_id: number, quiz_id: number): Promise<any> {
    const course_quiz = await this.getCourseQuiz(course_id, quiz_id);

    if (course_quiz.message) {
      return course_quiz;
    }

    await this.course_quizRepository.softDelete(course_quiz.id);
    return course_quiz;
  }

  async updateCourseQuiz(
    course_id: number,
    quiz_id_old: number,
    quiz_id_new: number,
  ): Promise<any> {
    const course_quiz = await this.getCourseQuiz(course_id, quiz_id_old);

    if (course_quiz.message) {
      return course_quiz;
    }

    await this.deleteCourseQuiz(course_id, quiz_id_old);
    const new_course_quiz = await this.setCourseQuiz(course_id, quiz_id_new);
    return new_course_quiz;
  }
}
