import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateAnswerDto } from './dto/create-answr-dto';
import { CreateQuestionDto } from './dto/create-question-dto';
import { UpdateAnswerDto } from './dto/update-answer-dto';
import { UpdateQuestionDto } from './dto/update-question-dto';
import { QuestionsService } from './questions.service';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}
  /**
   *
   *  QUESTIONS
   *  GET ALL
   *  GET ALL TEXT
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE
   *
   */
  @ApiOperation({ summary: 'Get all questions' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all questions',
    type: [CreateQuestionDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @ApiOperation({ summary: 'Get all questions text' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all questions titles',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/titles')
  getAllQuestionsTxt() {
    return this.questionsService.getAllQuestionsTxt();
  }

  @ApiOperation({ summary: 'Get question by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected question data',
    type: CreateQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestion(id);
  }

  @ApiOperation({ summary: 'Create new quesion' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateQuestionDto',
    },
    description: 'The new question data',
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The created question data',
    type: CreateQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/new')
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @ApiOperation({ summary: 'Delete Question' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted question data',
    type: CreateQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteQuestion(id);
  }

  @ApiOperation({ summary: 'Update question data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiBody({
    schema: {
      type: 'CreateQuestionDto',
    },
    description: 'The fields we want to update in the question',
    required: true,
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated question',
    type: CreateQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }
  /**
   *
   *  QUESTIONS
   *  GET QUESTION META
   *  SET QUESTION META
   *
   */
  @ApiOperation({ summary: 'Get all question meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected question meta data',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/meta/:id')
  getQuestionMeta(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionMeta(id);
  }

  @ApiOperation({ summary: 'Set question meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'place',
          description: 'The meta data key',
        },
        value: {
          type: 'string',
          example: 'Egypt',
          description: 'The meta data value',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The added meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/meta/new/:id')
  setQuestionMeta(
    @Param('id', ParseIntPipe) id: number,
    @Body('key') key: string,
    @Body('value') value: any,
  ) {
    return this.questionsService.setQuestionMeta(id, key, value);
  }

  /**
   *
   * QUESTIONS
   * GET QUESTION TYPE
   *
   */
  @ApiOperation({ summary: 'Get question by type' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'The question type',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/type/:id')
  getQuestionType(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionType(id);
  }

  /**
   *
   *  ANSWERS
   *  GET ALL
   *  GET ALL TITLES
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE
   *
   */
  @ApiOperation({ summary: 'Get all answers' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all answers',
    type: [CreateAnswerDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/answers/all')
  getAllAnswers() {
    return this.questionsService.getAllAnswers();
  }

  @ApiOperation({ summary: 'Get all answers text' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all answers txt',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/answers/all/titles')
  getAllAnswersTitles() {
    return this.questionsService.getAllAnswersTxt();
  }

  @ApiOperation({ summary: 'Get one answer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected answer id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected answer data',
    type: CreateAnswerDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/answers/one/:id')
  getAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getAnswer(id);
  }

  @ApiOperation({ summary: 'Create new answer' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateAnswerDto',
    },
    description: 'The answer data',
    required: true,
    type: CreateAnswerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new answer data',
    type: CreateAnswerDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/answers/new')
  createAnswer(@Body() createAnswerDto: CreateAnswerDto) {
    return this.questionsService.createAnswer(createAnswerDto);
  }

  @ApiOperation({ summary: 'Delete answer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected answer id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted answer data',
    type: CreateAnswerDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/answers/delete/:id')
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteAnswer(id);
  }

  @ApiOperation({ summary: 'Update answer data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected answer id',
  })
  @ApiBody({
    schema: {
      type: 'CreateAnswerDto',
    },
    description: 'The fields that we want to update in the answer',
    required: true,
    type: CreateAnswerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated answer data',
    type: CreateAnswerDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/answers/update/:id')
  updateAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.questionsService.updateAnswer(id, updateAnswerDto);
  }

  /**
   *  QUESTIONS - ANSWERS
   *  GET QUESTION ANSWERS
   *  GET QUESTION CORRECT ANSWER
   *
   */
  @ApiOperation({ summary: "List of quesiton's answers" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'List of question answer',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/answers/:id')
  getQuestionAnswers(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionAnswers(id);
  }

  @ApiOperation({ summary: 'Get the question correct asnwer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiResponse({
    status: 200,
    description: 'The correct answer',
    type: CreateAnswerDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/answers/correct/:id')
  getQuestionCorrectAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionCorrectAnswer(id);
  }

  @ApiOperation({ summary: 'Check wheather the answer is correct or not' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected question id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        asnwerId: {
          type: 'number',
          example: 3,
          description: 'selected answer id',
        },
      },
    },
    description: 'The asnwer id',
  })
  @ApiResponse({
    status: 200,
    description: 'weather the answer is correct or not',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Post('/answers/check/:id')
  checkQuestionAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body('answerId') asnwerId: number,
  ) {
    return this.questionsService.checkQuestionAnswer(id, asnwerId);
  }
}
