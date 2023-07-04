import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/create-answr-dto';
import { CreateQuestionDto } from './dto/create-question-dto';
import { UpdateAnswerDto } from './dto/update-answer-dto';
import { UpdateQuestionDto } from './dto/update-question-dto';
import { Answer } from './entities/answer.entity';
import { Question_meta } from './entities/question-meta.entity';
import { Question } from './entities/question.entity';
import { QuestionType } from './enums/question-type.enum';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Question_meta)
    private question_metaRepository: Repository<Question_meta>,

    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}
  /**
   *
   * QUESTIONS
   * GET ALL QUESIONS
   * GET ALL QUESTIONS TITLES
   * GET ONE QUESTION
   * SET NEW QUESTION
   * DELETE QUESTION
   * UPDATE QUESTION
   *
   */
  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<any> {
    try {
      const { question_txt, question_type, question_score } = createQuestionDto;

      const question = new Question();
      question.question_txt = question_txt;
      question.question_type = question_type;
      question.question_score = question_score;

      await this.questionRepository.save(question);
      return question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getAllQuestions(): Promise<any> {
    try {
      const questions = await this.questionRepository.find();

      if (questions.length < 1) {
        throw new Error('There is no quesions yet');
      }

      return questions;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getAllQuestionsTxt(): Promise<any> {
    try {
      const titles = await this.questionRepository.find({
        select: ['question_txt'],
      });
      const questionsTxt = titles.map((title) => {
        return { question_txt: title };
      });
      return questionsTxt;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async getQuestion(id: number): Promise<any> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
      });

      if (!question) {
        throw Error("Question doesn't exist");
      }
      return question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async deleteQuestion(id: number): Promise<any> {
    try {
      const question = this.getQuestion(id);

      await this.questionRepository.softDelete(id);
      return question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateQuestion(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<any> {
    try {
      let question = await this.getQuestion(id);

      question = { ...question, ...updateQuestionDto };
      await this.questionRepository.save(question);
      return question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * QUESTIONS - META
   * GET QUESTIONS META
   * SET QUESTIONS META
   *
   */
  async getQuestionMeta(id: number): Promise<any> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['question_meta'],
      });
      const meta = question.question_meta;
      return meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async setQuestionMeta(id: number, key: string, value: any): Promise<any> {
    try {
      const question = await this.getQuestion(id);

      const question_meta = new Question_meta();
      question_meta.meta_key = key;
      question_meta.meta_value = value;
      question_meta.question = question;

      await this.question_metaRepository.save(question_meta);
      return question_meta;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * QUESTION
   * GET QUESTION TYPE
   *
   */
  async getQuestionType(id: number): Promise<any> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
        select: ['question_type'],
      });

      return question;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
  /**
   *
   * ANSWERS
   * GET ALL ANSWERS
   * GET ALL ANSWERS TEXT
   * GET ONE ANSWER
   * SET NEW ANSWER
   * DELETE ANSWER
   * UPDATE ANSWER
   *
   */

  async createAnswer(createAnswerDto: CreateAnswerDto): Promise<any> {
    const { answer_txt, answer_is_correct, question_id } = createAnswerDto;
    const question = await this.getQuestion(question_id);

    const answer = new Answer();
    answer.answer_txt = answer_txt;
    answer.answer_is_correct = answer_is_correct;
    answer.question = question;

    await this.answerRepository.save(answer);
    return answer;
  }

  async getAllAnswers(): Promise<any> {
    const answers = await this.answerRepository.find({
      relations: ['question'],
    });
    return answers;
  }

  async getAllAnswersTxt(): Promise<any> {
    const titles = await this.answerRepository.find({
      select: ['answer_txt'],
    });
    const asnwerTitles = titles.map((title) => {
      return { answer_txt: title };
    });
    return asnwerTitles;
  }

  async getAnswer(id: number): Promise<any> {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (!answer) {
      throw Error('Answer doesn\t exist');
    }
    return answer;
  }

  async deleteAnswer(id: number): Promise<any> {
    const answer = await this.getAnswer(id);

    await this.answerRepository.softDelete(id);
    return answer;
  }

  async updateAnswer(
    id: number,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<any> {
    let answer = await this.getAnswer(id);
    answer = { ...answer, ...updateAnswerDto };

    await this.answerRepository.save(answer);
    return answer;
  }

  /**
   *
   * QUESTIONS - ANSWERS
   * GET QUESTION'S ANSWERS
   * GET QUESTION CORRECT ANSWER
   * CHECK IF ANSWER IS CORRECT IN CASE OF MCQ || T/F ELSE WE RETURN NULL
   *
   */
  async getQuestionAnswers(id: number): Promise<any> {
    const answers = await this.answerRepository.find({
      where: { question: { id } },
    });
    if (answers.length < 1) {
      return [{ message: "This question doesn't have a predefined answers" }];
    }
    return answers;
  }

  async getQuestionCorrectAnswer(id: number): Promise<any> {
    const answers = await this.getQuestionAnswers(id);

    if (answers[0].message) {
      return answers;
    }
    const correct = answers.find((answer) => {
      return answer.answer_is_correct == true;
    });
    return correct;
  }

  async checkQuestionAnswer(id: number, answerId: number): Promise<any> {
    const question_type = await this.getQuestionType(id);

    if (question_type.question_type === QuestionType.SHORT_ANSWER) {
      return [
        { answer_is_correct: null },
        { message: "This question doesn't have a predefined answers" },
      ];
    }

    const answer = await this.getAnswer(answerId);
    const correct_answer = await this.getQuestionCorrectAnswer(id);
    if (answer.id !== correct_answer.id) {
      return [{ answer_is_correct: false }];
    }
    return [{ answer_is_correct: true }];
  }
}
