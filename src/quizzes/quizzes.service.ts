import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz-dto';
import { UpdateQuizDto } from './dto/udpate-quiz-dto';
import { Quiz_meta } from './entities/quiz-meta.entity';
import { Quiz } from './entities/quiz.entity';
import { Quiz_question } from './entities/quiz-question.entity';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(Quiz_meta)
    private quiz_metaRepository: Repository<Quiz_meta>,

    @InjectRepository(Quiz_question)
    private quiz_questionRepository: Repository<Quiz_question>,
    private questionsService: QuestionsService,
  ) {}
  /**
   *
   * QUIZ
   * CRUD --- GET ALL , GET ALL TITLES
   *
   */

  async createQuiz(createQuizDto: CreateQuizDto): Promise<any> {
    try {
      const { quiz_title, quiz_description, quiz_passing_score } =
        createQuizDto;

      const quiz = new Quiz();
      quiz.quiz_title = quiz_title;
      quiz.quiz_description = quiz_description;
      quiz.quiz_passing_score = quiz_passing_score;

      await this.quizRepository.save(quiz);
      return quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllQuizzes(): Promise<any> {
    try {
      const quizzes = await this.quizRepository.find();
      return quizzes;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllQuizzesTitles(): Promise<any> {
    try {
      const titles = await this.quizRepository.find({
        select: ['quiz_title'],
      });
      const quizzesTitles = titles.map((title) => {
        return { quize_title: title };
      });
      return quizzesTitles;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getQuiz(id: number): Promise<any> {
    try {
      const quiz = await this.quizRepository.findOne({ where: { id } });

      if (!quiz) {
        throw Error("Quiz doesn't exist");
      }
      return quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteQuiz(id: number): Promise<any> {
    try {
      const quiz = this.getQuiz(id);

      await this.quizRepository.softDelete(id);
      return quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateQuiz(id: number, updateQuizDto: UpdateQuizDto): Promise<any> {
    try {
      let quiz = await this.getQuiz(id);
      quiz = { ...quiz, ...updateQuizDto };

      await this.quizRepository.save(quiz);
      return quiz;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * QUIZ META
   * GET ALL META
   * SET META
   *
   */
  async getQuizMeta(id: number): Promise<any> {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ['quiz_meta'],
      });
      const meta = quiz.quiz_meta;
      return meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setQuizMeta(id: number, key: string, value: any): Promise<any> {
    try {
      const quiz = await this.getQuiz(id);

      const quiz_meta = new Quiz_meta();
      quiz_meta.meta_key = key;
      quiz_meta.meta_value = value;
      quiz_meta.quiz = quiz;

      await this.quiz_metaRepository.save(quiz_meta);
      return quiz_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * QUIZ - QUESTION
   * GET ALL QUIZ QUESTIONS
   * SET QUIZ QUESTION
   * DELETE QUIZ QUESTION
   * UPDATE QUIZ QUESTION
   *
   */
  async getQuizQuestions(id: number): Promise<any> {
    try {
      const quiz = await this.quizRepository.find({
        where: { id },
        relations: ['quiz_question', 'quiz_question.question'],
      });
      try {
        const questions = quiz.map((item) => {
          return item.quiz_question;
        });

        return questions;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getQuizQuestion(quizId: number, questionId: number): Promise<any> {
    try {
      const quiz_question = await this.quiz_questionRepository.findOne({
        where: { quiz: { id: quizId }, question: { id: questionId } },
        relations: ['quiz', 'question'],
      });
      if (!quiz_question) {
        return { message: "This quiz question doesn't exist" };
      }
      return quiz_question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setQuizQuestion(quizId: number, questionId: number): Promise<any> {
    try {
      const quiz = await this.getQuiz(quizId);
      const question = await this.questionsService.getQuestion(questionId);
      const quiz_question = new Quiz_question();
      quiz_question.quiz = quiz;
      quiz_question.question = question;

      await this.quiz_questionRepository.save(quiz_question);
      return quiz_question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteQuizQuestion(quizId: number, questionId: number): Promise<any> {
    try {
      const quiz_question = await this.getQuizQuestion(quizId, questionId);

      await this.quiz_questionRepository.softDelete(quiz_question.id);
      return quiz_question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateQuizQuestion(
    quizId: number,
    questionId: number,
    newQuestionId: number,
  ): Promise<any> {
    try {
      await this.deleteQuizQuestion(quizId, questionId);
      const quiz_question = await this.setQuizQuestion(quizId, newQuestionId);

      return quiz_question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
