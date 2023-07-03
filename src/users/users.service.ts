import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User_meta } from './entities/user-meta.entity';
import { User_role } from './entities/user-role.entity';
import { RolesService } from 'src/roles/roles.service';
import { Student_lesson } from './entities/student-lesson.entity';
import { LessonsService } from 'src/lessons/lessons.service';
import { StudentLessonStatus } from './enums/student-lesson-status.enum';
import { Student_course } from './entities/student-course.entity';
import { CoursesService } from 'src/courses/courses.service';
import { StudentCourseStatus } from './enums/student-course-status.enum';
import { Instructor_course } from './entities/instructor-course.entity';
import { CreateCourseDto } from 'src/courses/dto/create-course-dto';
import { InstructorCourseStatus } from './enums/instructor-course-status.enum';
import { Instructor_lesson } from './entities/instructor-lesson.entity';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson-dto';
import { InstructorLessonStatus } from './enums/instructor-lesson-status.enum';
import { Student_quiz } from './entities/student-quiz.entity';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { CreateStudentQuizDto } from './dto/create-student-quiz-dto';
import { UpdateStudentQuizDto } from './dto/update-student-quiz-dto';
import { Student_quiz_question } from './entities/student-quiz-question.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { CreateStudentQuizQuestionDto } from './dto/create-student-quiz-question-dto';
import { UpdateStudentQuizQuestionDto } from './dto/update-student-quiz-question-dto';
import { Question } from 'src/questions/entities/question.entity';
import { Answer } from 'src/questions/entities/answer.entity';
import { Comment } from 'src/discusion/entities/comment.entity';
import { DiscusionService } from 'src/discusion/discusion.service';
import { CreateCommentDto } from 'src/discusion/dto/create-comment-dto';
import { UpdateCommentDto } from 'src/discusion/dto/update-comment-dto';
import { Comment_replay } from 'src/discusion/entities/comment-replay.entity';
import { CreateCommentReplayDto } from 'src/discusion/dto/create-comment-replay-dto';
import { UpdateCommentReplayDto } from 'src/discusion/dto/update-comment-replay-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(User_meta)
    private user_metaRepository: Repository<User_meta>,

    @InjectRepository(User_role)
    private user_roleRepository: Repository<User_role>,
    private roleService: RolesService,

    @InjectRepository(Student_course)
    private student_courseRepository: Repository<Student_course>,
    private coursesService: CoursesService,

    @InjectRepository(Instructor_course)
    private instructor_courseRepository: Repository<Instructor_course>,

    @InjectRepository(Student_lesson)
    private student_lessonRepository: Repository<Student_lesson>,
    private lessonsService: LessonsService,

    @InjectRepository(Instructor_lesson)
    private instructor_lessonRepository: Repository<Instructor_lesson>,

    @InjectRepository(Student_quiz)
    private student_quizRepository: Repository<Student_quiz>,
    private quizzesService: QuizzesService,

    @InjectRepository(Student_quiz_question)
    private student_quiz_questionRepository: Repository<Student_quiz_question>,
    private questionsServce: QuestionsService,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private discusionService: DiscusionService,

    @InjectRepository(Comment_replay)
    private comment_replayRepository: Repository<Comment_replay>,
  ) {}
  /**
   *
   * USER
   * SIGNUP USER [ CREATE USER ]
   * LOGIN USER
   * GET ONE USER
   * VALIDATE USER
   * GET USER TYPE
   * GET ALL USERS
   * GET ALL USERS NAMES
   * DELETE USER
   * UPDATE USER
   * GET USER BY EMAIL
   * GET USER BY PHONE
   *
   */
  async signupUser(createUserDto: CreateUserDto): Promise<any> {
    const {
      user_name,
      user_email,
      user_phone,
      user_pass,
      password_confirm,
      user_img,
      user_type,
    } = createUserDto;

    let exist: any;
    try {
      exist = await this.getUserByEmail(user_email);
      if (!exist.message) {
        throw Error('This email address is already registered');
      }
      if (user_pass != password_confirm) {
        throw Error('Your passwords does not match');
      }
    } catch (err) {
      return { message: err.message };
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user_pass, salt);

    const user = new User();
    user.user_name = user_name;
    user.user_email = user_email;
    user.user_phone = user_phone;
    user.user_pass = hash;
    user.user_img = user_img;
    user.user_type = user_type;

    await this.usersRepository.save(user);
    const { user_pass: pass, ...userPassed } = user;

    return userPassed;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const { user_email, user_pass } = loginUserDto;

    const user = await this.usersRepository.findOne({ where: { user_email } });
    try {
      if (!user) {
        throw Error('Incorrect Email');
      }
      const match = await bcrypt.compare(user_pass, user.user_pass);

      if (!match) {
        throw Error('Incorrect Password');
      }

      const { user_pass: pass, ...userPassed } = user;
      return userPassed;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getUser(id: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw Error('User does not exist');
      }
      return user;
    } catch (err) {
      return { message: err.message };
    }
  }

  async validateUser(id: number): Promise<any> {
    const user = await this.getUser(id);
    if (!user) {
      return null;
    }

    const userId = user.id;
    return { userId };
  }

  async getUserType(id: number): Promise<any> {
    const user = await this.getUser(id);
    if (user.message) {
      return user;
    }
    const user_type = user.user_type;
    return { user_type };
  }

  async getAllUsers(): Promise<any> {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getAllUserNames(): Promise<any> {
    try {
      const names = await this.usersRepository.find({
        select: ['user_name'],
      });
      const usernames = names.map((name) => {
        return { username: name };
      });
      return usernames;
    } catch (err) {
      return { message: err.message };
    }
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.getUser(id);
    if (user.message) {
      return user;
    }

    await this.usersRepository.softDelete(id);

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    let user = await this.getUser(id);
    if (user.message) {
      return user;
    }

    user = { ...user, ...updateUserDto };
    await this.usersRepository.save(user);

    return user;
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_email: email },
      });
      if (!user) {
        return { message: 'User not found' };
      }
      return user;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getUserByPhone(phone: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_phone: phone },
      });
      if (!user) {
        return { message: 'User not found' };
      }
      return user;
    } catch (err) {
      return { message: err.message };
    }
  }
  /**
   *
   * USER - NICKNAME
   *
   */
  async setUserNickname(nickname: string, id: number): Promise<any> {
    const user = await this.getUser(id);
    if (user.message) {
      return user;
    }

    const user_meta = new User_meta();
    user_meta.meta_key = 'nickname';
    user_meta.meta_value = nickname;
    user_meta.user = user;
    await this.user_metaRepository.save(user_meta);
    return user_meta;
  }
  /**
   *
   * USER - META
   *
   */
  async getUserMeta(id: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['user_meta'],
      });
      if (!user) {
        return { message: 'User not found' };
      }

      const meta = user.user_meta;
      return meta;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setUserMeta(id: number, key: string, value: string): Promise<any> {
    const user = await this.getUser(id);
    if (user.message) {
      return user;
    }

    const user_meta = new User_meta();
    user_meta.meta_key = key;
    user_meta.meta_value = value;
    user_meta.user = user;

    await this.user_metaRepository.save(user_meta);
    return user_meta;
  }
  /**
   *
   * USER - ROLE
   * SET USER ROLE
   * GET USER'S ROLS
   * DELETE USER ROLE
   * UPDATE USER ROLE
   *
   */
  async setUserRole(userId: number, roleId: number): Promise<any> {
    try {
      const user = await this.getUser(userId);
      const role = await this.roleService.getRole(roleId);

      if (user.message) {
        return user;
      }
      if (role.message) {
        return role;
      }
      const user_role = new User_role();
      user_role.user = user;
      user_role.role = role;

      await this.user_roleRepository.save(user_role);
      return user_role;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getUserRole(id: number): Promise<any> {
    try {
      const user_role = await this.user_roleRepository.findOne({
        where: { user: { id: id } },
        relations: ['role'],
      });

      if (!user_role) {
        return { message: "This user doesn't have a role" };
      }

      const role = user_role.role;
      return role;
    } catch (err) {
      return { message: err.message };
    }
  }

  async deleteUserRole(id: number): Promise<any> {
    try {
      const user_role = await this.user_roleRepository.findOne({
        where: { user: { id: id } },
        relations: ['role', 'user'],
      });

      if (!user_role) {
        return { message: "This user doesn't have a role" };
      }

      await this.user_roleRepository.softDelete(user_role.id);
      return user_role;
    } catch (err) {
      return { message: err.message };
    }
  }

  async updateUserRole(userId: number, roleId: number): Promise<any> {
    try {
      const user_role = await this.getUserRole(userId);
      if (user_role.message) {
        return user_role;
      }
      await this.deleteUserRole(userId);

      const new_user_role = await this.setUserRole(userId, roleId);
      return new_user_role;
    } catch (err) {
      return { message: err.message };
    }
  }
  /**
   *
   * STUDENT - COURSE
   *
   */
  async getStudentCourses(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['student_course', 'student_course.course'],
    });
    const courses = user.student_course;
    return courses;
  }

  async getStudentCourse(userId: number, courseId: number): Promise<any> {
    const student_course = await this.student_courseRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
      relations: ['course'],
    });
    return student_course;
  }

  async setStudentCourse(
    userId: number,
    courseId: number,
    status: StudentCourseStatus,
  ): Promise<any> {
    const exist = await this.getStudentCourse(userId, courseId);
    if (exist) {
      return { message: 'Student is already enrolled' };
    }
    const user = await this.getUser(userId);
    const course = await this.coursesService.getCourse(courseId);

    const student_course = new Student_course();
    student_course.user = user;
    student_course.course = course;
    student_course.student_course_status = status;

    await this.student_courseRepository.save(student_course);
    return student_course;
  }

  async deleteStudentCourse(userId: number, courseId: number): Promise<any> {
    const student_course = await this.getStudentCourse(userId, courseId);

    await this.student_courseRepository.softDelete(student_course.id);
    return student_course;
  }

  async updateStudentCourseStatus(
    userId: number,
    courseId: number,
    status: StudentCourseStatus,
  ): Promise<any> {
    const student_course = await this.getStudentCourse(userId, courseId);
    student_course.student_course_status = status;

    await this.student_courseRepository.save(student_course);
    return student_course;
  }
  /**
   *
   * INSTRUCTOR - COURSE
   *
   */
  async getInstructorCourses(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['instructor_course', 'instructor_course.course'],
    });
    const courses = user.instructor_course;
    return courses;
  }

  async getInstructorCourse(userId: number, courseId: number): Promise<any> {
    const instructor_course = await this.instructor_courseRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
      relations: ['course'],
    });
    return instructor_course;
  }

  async setInstructorCourse(
    userId: number,
    createCourseDto: CreateCourseDto,
  ): Promise<any> {
    const user = await this.getUser(userId);
    const course = await this.coursesService.createCourse(createCourseDto);

    const instructor_course = new Instructor_course();
    instructor_course.user = user;
    instructor_course.course = course;

    await this.instructor_courseRepository.save(instructor_course);
    return instructor_course;
  }

  async deleteInstructorCourse(userId: number, coruseId: number): Promise<any> {
    const instructor_course = await this.getInstructorCourse(userId, coruseId);

    await this.instructor_courseRepository.softDelete(instructor_course.id);
    return instructor_course;
  }

  async updateInstructorCourseStatus(
    userId: number,
    courseId: number,
    status: InstructorCourseStatus,
  ): Promise<any> {
    const instructor_course = await this.getInstructorCourse(userId, courseId);
    instructor_course.instructor_course_status = status;

    await this.instructor_courseRepository.save(instructor_course);
    return instructor_course;
  }
  /**
   *
   * STUDENT - LESSON
   *
   */
  async getStudentLessons(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['student_lesson', 'student_lesson.lesson'],
    });
    const lessons = user.student_lesson;
    return lessons;
  }

  async getStudentLesson(userId: number, lessonId: number): Promise<any> {
    const student_lesson = await this.student_lessonRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
      relations: ['lesson'],
    });
    return student_lesson;
  }

  async setStudentLesson(
    userId: number,
    lessonId: number,
    status: StudentLessonStatus,
  ): Promise<any> {
    const exist = await this.getStudentLesson(userId, lessonId);
    if (exist) {
      return { message: 'Student is already enrolled' };
    }
    const user = await this.getUser(userId);
    const lesson = await this.lessonsService.getLesson(lessonId);

    const student_lesson = new Student_lesson();
    student_lesson.user = user;
    student_lesson.lesson = lesson;
    student_lesson.student_lesson_status = status;

    await this.student_lessonRepository.save(student_lesson);
    return student_lesson;
  }

  async deleteStudentLesson(userId: number, lessonId: number): Promise<any> {
    const student_lesson = await this.getStudentLesson(userId, lessonId);

    await this.student_lessonRepository.softDelete(student_lesson.id);
    return student_lesson;
  }

  async updateStudentLessonStatus(
    userId: number,
    lessonId: number,
    status: StudentLessonStatus,
  ): Promise<any> {
    const student_lesson = await this.getStudentLesson(userId, lessonId);
    student_lesson.student_lesson_status = status;

    await this.student_lessonRepository.save(student_lesson);
    return student_lesson;
  }
  /**
   *
   * INSTRUCTOR - LESSON
   * GET ALL INSTRUCTOR LESSONS
   * GET ONE INSTRUCTOR LESSON
   * SET INSTRUCTOR LESON
   * DELETE INSTRUCTOR LESSON
   * UPDATE INSTRUCTOR LESSON
   *
   */
  async getInstructorLessons(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['instructor_lesson', 'instructor_lesson.lesson'],
    });
    const lessons = user.instructor_lesson;
    return lessons;
  }

  async getInstructorLesson(userId: number, lessonId: number): Promise<any> {
    const instructor_lesson = await this.instructor_lessonRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
      relations: ['lesson'],
    });
    return instructor_lesson;
  }

  async setInstructorLesson(
    userId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<any> {
    const user = await this.getUser(userId);
    const lesson = await this.lessonsService.createLesson(createLessonDto);

    const instructor_lesson = new Instructor_lesson();
    instructor_lesson.user = user;
    instructor_lesson.lesson = lesson;

    await this.instructor_lessonRepository.save(instructor_lesson);
    return instructor_lesson;
  }

  async deleteInstructorLesson(userId: number, lessonId: number): Promise<any> {
    const instructor_lesson = await this.getInstructorLesson(userId, lessonId);

    await this.instructor_lessonRepository.softDelete(instructor_lesson.id);
    return instructor_lesson;
  }

  async updateInstructorLessonStatus(
    userId: number,
    lessonId: number,
    status: InstructorLessonStatus,
  ): Promise<any> {
    const instructor_lesson = await this.getInstructorLesson(userId, lessonId);
    instructor_lesson.instructor_lesson_status = status;

    await this.instructor_lessonRepository.save(instructor_lesson);
    return instructor_lesson;
  }
  /**
   *
   * STUDENT - QUIZ
   * GET ALL
   * GET ONE
   * GET ONE BY STUDENT_QUIZ ID
   * SET STUDENT QUIZ
   * DELETE STUDENT QUIZ
   *
   */
  async getStudentQuizzes(studentId: number): Promise<any> {
    const student_quiz = await this.student_quizRepository.find({
      where: { user: { id: studentId } },
      relations: ['quiz', 'quiz.quiz_question', 'quiz.quiz_question.question'],
    });

    try {
      if (student_quiz.length < 1) {
        return { message: "This student didn't take any quiz" };
      }
      return student_quiz;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getStudentQuiz(studentId: number, quizId: number): Promise<any> {
    let student_quiz: any;
    try {
      student_quiz = await this.student_quizRepository.findOne({
        where: { user: { id: studentId }, quiz: { id: quizId } },
        relations: [
          'quiz',
          'quiz.quiz_question',
          'quiz.quiz_question.question',
        ],
        order: { id: 'DESC' },
      });

      if (!student_quiz) {
        return { message: "The student didn't take this quiz" };
      }
      return student_quiz;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getStudentQuizById(id: number): Promise<any> {
    const student_quiz = await this.student_quizRepository.findOne({
      where: { id },
    });

    if (!student_quiz) {
      return { message: "The student didn't take this quiz" };
    }
    return student_quiz;
  }

  async setStudentQuiz(
    createStudentQuizDto: CreateStudentQuizDto,
  ): Promise<any> {
    const {
      student_id,
      quiz_id,
      student_quiz_score,
      student_quiz_status,
      student_quiz_reviewed,
    } = createStudentQuizDto;

    let user: any;
    let quiz: any;
    try {
      user = await this.getUser(student_id);
      quiz = await this.quizzesService.getQuiz(quiz_id);
    } catch (err) {
      return { message: err.message };
    }

    const student_quiz = new Student_quiz();
    student_quiz.user = user;
    student_quiz.quiz = quiz;
    student_quiz.student_quiz_score = student_quiz_score;
    student_quiz.student_quiz_status = student_quiz_status;
    student_quiz.student_quiz_reviewed = student_quiz_reviewed;

    await this.student_quizRepository.save(student_quiz);
    return student_quiz;
  }

  async deleteStudentQuiz(userId: number, quizId: number): Promise<any> {
    const student_quiz = await this.getStudentQuiz(userId, quizId);

    await this.student_quizRepository.softDelete(student_quiz.id);
    return student_quiz;
  }

  async updateStudentQuiz(
    userId: number,
    updateStudentQuizDto: UpdateStudentQuizDto,
  ): Promise<any> {
    const { quiz_id } = updateStudentQuizDto;
    let student_quiz = await this.getStudentQuiz(userId, quiz_id);
    student_quiz = { ...student_quiz, ...updateStudentQuizDto };

    await this.student_quizRepository.save(student_quiz);
    return student_quiz;
  }
  /**
   *
   * STUDENT - QUIZ - QUESTION
   * GET ALL
   * GET ONE
   * SET STUDENT QUIZ
   * DELETE STUDENT QUIZ
   *
   */
  async getStudentQuizQuestions(student_quiz_id: number): Promise<any> {
    const student_quiz_questions =
      await this.student_quiz_questionRepository.find({
        where: { student_quiz: { id: student_quiz_id } },
        relations: ['question'],
      });

    try {
      if (student_quiz_questions.length < 1) {
        return { message: "This student didn't answer any question yet" };
      }
      return student_quiz_questions;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getStudentQuizQuestion(
    student_quiz_id: number,
    question_id: number,
  ): Promise<any> {
    try {
      const student_quiz_question =
        await this.student_quiz_questionRepository.findOne({
          where: {
            student_quiz: { id: student_quiz_id },
            question: { id: question_id },
          },
          relations: ['question'],
          order: { id: 'DESC' },
        });

      if (!student_quiz_question) {
        return {
          message: "The student didn't answer this question in this quiz",
        };
      }
      return student_quiz_question;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setStudentQuizQuestion(
    createStudentQuizQuestionDto: CreateStudentQuizQuestionDto,
  ): Promise<any> {
    let {
      student_quiz_id,
      question_id,
      answer_id,
      student_quiz_question_answer_txt,
      student_quiz_question_is_correct,
    } = createStudentQuizQuestionDto;

    const exist = await this.getStudentQuizQuestion(
      student_quiz_id,
      question_id,
    );
    if (!exist.message) {
      return {
        message: 'The answer to this question has already been submitted',
      };
    }

    try {
      const student_quiz = await this.getStudentQuizById(student_quiz_id);
      const question = await this.questionsServce.getQuestion(question_id);
      const answer = await this.questionsServce.getAnswer(answer_id);

      const is_correct = await this.answerAutoReview(question, answer);

      if (is_correct === null) {
        student_quiz_question_is_correct = null;
      } else if (is_correct === true) {
        student_quiz_question_is_correct = true;
        student_quiz.student_quiz_score += question.question_score;
        await this.student_quizRepository.save(student_quiz);
      } else if (is_correct === false) {
        student_quiz_question_is_correct = false;
      }

      const student_quiz_question = new Student_quiz_question();
      student_quiz_question.student_quiz = student_quiz;
      student_quiz_question.question = question;
      student_quiz_question.answer = answer;

      student_quiz_question.student_quiz_question_answer_txt =
        student_quiz_question_answer_txt;
      student_quiz_question.student_quiz_question_is_correct =
        student_quiz_question_is_correct;

      await this.student_quiz_questionRepository.save(student_quiz_question);
      return student_quiz_question;
    } catch (err) {
      return { message: err.message };
    }
  }

  async deleteStudentQuizQuestion(
    student_quiz_id: number,
    question_id: number,
  ): Promise<any> {
    const student_quiz_question = await this.getStudentQuizQuestion(
      student_quiz_id,
      question_id,
    );

    if (student_quiz_question.message) {
      return student_quiz_question;
    }

    await this.student_quiz_questionRepository.softDelete(
      student_quiz_question.id,
    );
    return student_quiz_question;
  }

  async updateStudentQuizQuestion(
    student_quiz_id: number,
    updateStudentQuizQuestionDto: UpdateStudentQuizQuestionDto,
  ): Promise<any> {
    const { question_id } = updateStudentQuizQuestionDto;
    let student_quiz_question = await this.getStudentQuizQuestion(
      student_quiz_id,
      question_id,
    );

    if (student_quiz_question.message) {
      return student_quiz_question;
    }
    // HERE WE SHOULD CHECK IF THERE IS NEW ANSWER WE SHOULD
    // TRY TO AUTO REVIEW IT
    if (updateStudentQuizQuestionDto.answer_id) {
      console.log('NEW ANSWER');
    }

    student_quiz_question = {
      ...student_quiz_question,
      ...updateStudentQuizQuestionDto,
    };

    await this.student_quiz_questionRepository.save(student_quiz_question);
    return student_quiz_question;
  }
  /**
   *
   * STUDENT - QUIZ - QUESTION
   * AUTO REVIEW STUDENT'S ANSWER
   * GET ALL STUDENT QUIZ ANSWERS CORRECT OR NOT
   * CHECK IF QUIZ IS REVIEWED
   * GET STUDNET'S ANSWER'S TEXT
   *
   */
  async answerAutoReview(question: Question, answer: Answer): Promise<any> {
    console.log('ANSWER AUTO REVIEW');
    if (question.question_type !== 'short answer') {
      const checkAnswer = await this.questionsServce.checkQuestionAnswer(
        question.id,
        answer.id,
      );
      const is_correct = checkAnswer[0].answer_is_correct;

      if (is_correct === null) {
        console.log(is_correct);
        return null;
      } else if (is_correct) {
        console.log(is_correct);
        return true;
      } else {
        console.log(is_correct);
        return false;
      }
    }
    return null;
  }

  async checkIsCorrect(student_quiz_id: number): Promise<any> {
    const student_quiz_question =
      await this.student_quiz_questionRepository.find({
        where: { student_quiz: { id: student_quiz_id } },
        relations: ['question'],
      });
    const is_correct = student_quiz_question.map((item) => {
      return {
        question_title: item.question.question_txt,
        is_correct: item.student_quiz_question_is_correct,
      };
    });
    return is_correct;
  }

  async checkIsReviewed(student_quiz_id: number): Promise<any> {
    const is_correct = await this.checkIsCorrect(student_quiz_id);

    const not_reviewed = is_correct.find((item) => {
      if (item.is_correct === null) {
        return true;
      }
    });

    let reviewed: boolean;
    if (not_reviewed) {
      reviewed = false;
      return { reviewed };
    } else {
      reviewed = true;
      return { reviewed };
    }
  }

  async getStudentAnswer(
    student_quiz_id: number,
    question_id: number,
  ): Promise<any> {
    try {
      const student_quiz_question =
        await this.student_quiz_questionRepository.findOne({
          where: {
            student_quiz: { id: student_quiz_id },
            question: { id: question_id },
          },
        });
      const answer_txt = student_quiz_question.student_quiz_question_answer_txt;

      return { answer_txt };
    } catch (err) {
      return { message: err.message };
    }
  }

  async reviewAnswer(
    student_quiz_id: number,
    question_id: number,
    is_correct: boolean,
  ): Promise<any> {
    const student_quiz_question =
      await this.student_quiz_questionRepository.findOne({
        where: {
          student_quiz: { id: student_quiz_id },
          question: { id: question_id },
        },
      });
    student_quiz_question.student_quiz_question_is_correct = is_correct;

    await this.student_quiz_questionRepository.save(student_quiz_question);
    return student_quiz_question;
  }
  /**
   *
   * COMMENT
   * GET ALL
   * GET ONE
   * SET COMMENT
   * DELETE COMMENT
   * UPDATE COMMENT
   *
   */
  async getComments(discusion_id: number): Promise<any> {
    try {
      const comments = await this.commentRepository.find({
        where: { discusion: { id: discusion_id } },
        relations: ['user', 'discusion'],
      });

      if (comments.length < 1) {
        return { message: "This discussion doesn't have any comments" };
      }

      return comments;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getComment(comment_id: number): Promise<any> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: comment_id },
        relations: ['user', 'discusion'],
      });

      if (!comment) {
        return { message: "This comment doesn't exist" };
      }

      return comment;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setComment(createCommentDto: CreateCommentDto): Promise<any> {
    const { comment_txt, user_id, discusion_id } = createCommentDto;

    const user = await this.getUser(user_id);
    const discssion = await this.discusionService.getDiscusion(discusion_id);

    const comment = new Comment();

    comment.comment_txt = comment_txt;
    comment.user = user;
    comment.discusion = discssion;

    await this.commentRepository.save(comment);
    return comment;
  }

  async deleteComment(comment_id: number): Promise<any> {
    const comment = await this.getComment(comment_id);

    if (comment.message) {
      return comment;
    }

    await this.commentRepository.softDelete(comment_id);
    return comment;
  }

  async updateComment(
    comment_id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    let comment = await this.getComment(comment_id);

    if (comment.message) {
      return comment;
    }

    comment = { ...comment, ...updateCommentDto };
    await this.commentRepository.save(comment);
    return comment;
  }
  /**
   *
   * COMMENT REPLAY
   * GET ALL
   * GET ONE
   * SET COMMENT REPLAY
   * DELETE COMMENT REPLAY
   * UPDATE COMMENT REPLAY
   *
   */
  async getcommentReplays(comment_id: number): Promise<any> {
    try {
      const comment_replays = await this.comment_replayRepository.find({
        where: { comment: { id: comment_id } },
      });

      if (comment_replays.length < 1) {
        return { message: "This comment doesn't have any replays yet" };
      }

      return comment_replays;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getCommentReplay(replay_id: number): Promise<any> {
    try {
      const replay = await this.comment_replayRepository.findOne({
        where: { id: replay_id },
        relations: ['user', 'comment'],
      });

      if (!replay) {
        return { message: "This replay doesn't exist" };
      }
      return replay;
    } catch (err) {
      return { message: err.message };
    }
  }

  async setCommentReplay(
    createCommentReplayDto: CreateCommentReplayDto,
  ): Promise<any> {
    const { comment_replay_txt, user_id, comment_id } = createCommentReplayDto;

    const user = await this.getUser(user_id);
    const comment = await this.getComment(comment_id);

    const comment_replay = new Comment_replay();
    comment_replay.comment_replay_txt = comment_replay_txt;
    comment_replay.user = user;
    comment_replay.comment = comment;

    await this.comment_replayRepository.save(comment_replay);
    return comment_replay;
  }

  async deleteCommentReplay(replay_id: number): Promise<any> {
    const comment_replay = await this.getCommentReplay(replay_id);

    if (comment_replay.message) {
      return comment_replay;
    }

    await this.comment_replayRepository.softDelete(comment_replay.id);
    return comment_replay;
  }

  async updateCommentReplay(
    replay_id: number,
    updateCommentReplayDto: UpdateCommentReplayDto,
  ): Promise<any> {
    let replay = await this.getCommentReplay(replay_id);

    if (replay.message) {
      return replay;
    }

    replay = { ...replay, ...updateCommentReplayDto };
    await this.comment_replayRepository.save(replay);
    return replay;
  }
}
