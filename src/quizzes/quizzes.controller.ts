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
import { CreateQuizDto } from './dto/create-quiz-dto';
import { UpdateQuizDto } from './dto/udpate-quiz-dto';
import { QuizzesService } from './quizzes.service';

@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}
  /**
   *
   *  QUIZZES
   *  GET ALL
   *  GET ALL TITLES
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE
   *
   */
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all quizzes',
    type: [CreateQuizDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllQuizzes() {
    return this.quizzesService.getAllQuizzes();
  }

  @ApiOperation({ summary: 'Get all quizzes titles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all quizzes titles',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/titles')
  getAllQuizzesTitles() {
    return this.quizzesService.getAllQuizzesTitles();
  }

  @ApiOperation({ summary: 'Get quiz by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected quiz id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected quiz data',
    type: CreateQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getQuiz(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuiz(id);
  }

  @ApiOperation({ summary: 'Create new quiz' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateQuizDto',
    },
    description: 'The new quiz data',
    type: CreateQuizDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The created quiz data',
    type: CreateQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards()
  @Post('/new')
  createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @ApiOperation({ summary: 'Delete quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected quiz id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted quiz',
    type: CreateQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteQuiz(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.deleteQuiz(id);
  }

  @ApiOperation({ summary: 'Update quiz data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'CreateQuizDto',
    },
    description: 'The fields we want to udpate in the quiz',
    required: true,
    type: CreateQuizDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated quiz',
    type: CreateQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  updateQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }
  /**
   *
   *  QUIZZES META
   *  GET ALL META
   *  SET META
   *
   */
  @ApiOperation({ summary: 'Get all quiz meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected quiz id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected quiz meta data',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/meta/:id')
  getQuizMeta(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuizMeta(id);
  }

  @ApiOperation({ summary: 'Set quiz meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key of the meta data',
        },
        value: {
          type: 'string',
          description: 'The value of the meta data',
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
  setQuizMeta(
    @Param('id', ParseIntPipe) id: number,
    @Body('key') key: string,
    @Body('value') value: any,
  ) {
    return this.quizzesService.setQuizMeta(id, key, value);
  }
  /**
   *
   *  QUIZZES - QUESTIONS
   *  GET ALL
   *  GET ONE
   *  SET QUIZ QUESTION
   *  DELETE QUIZ QUESTION
   *  UPDATE QUIZ QUESTION
   *
   */
  @ApiOperation({ summary: "Get all quiz's questions" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'intger',
    example: 2,
    description: 'The selected quiz id',
  })
  @ApiResponse({
    status: 200,
    description: "List of all quiz's questions",
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/questions/all/:id')
  getQuizQuestions(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuizQuestions(id);
  }

  @ApiOperation({ summary: 'Get one quiz question' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        questionId: {
          type: 'number',
          example: 3,
          description: 'The selected question id',
        },
      },
    },
    description: 'The question id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The selected quiz question data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/questions/:id')
  getQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('questionId') questionId: number,
  ) {
    return this.quizzesService.getQuizQuestion(id, questionId);
  }

  @ApiOperation({ summary: 'Set quiz quesitons' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        questionId: {
          type: 'number',
          example: 3,
          description: 'The selected question id',
        },
      },
    },
    description: 'The question id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The new quiz question',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/questions/new/:id')
  setQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('questionId') questionId: number,
  ) {
    return this.quizzesService.setQuizQuestion(id, questionId);
  }

  @ApiOperation({ summary: 'Delete quiz question' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        questionId: {
          type: 'number',
          example: 3,
          description: 'The selected question id',
        },
      },
    },
    description: 'The question id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted quiz question data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/questions/delete/:id')
  deleteQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('questionId') questionId: number,
  ) {
    return this.quizzesService.deleteQuizQuestion(id, questionId);
  }

  @ApiOperation({ summary: 'Update quiz quesiton' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        questionId: {
          type: 'number',
          example: 2,
          description: 'The old selected quesiton id',
        },
        newQuestionId: {
          type: 'number',
          example: 4,
          description: 'The new selected question id',
        },
      },
    },
    description: 'The old and new questions ids',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The new quiz question data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/questions/update/:id')
  updateQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('questionId') questionId: number,
    @Body('newQuestionId') newQuestionId: number,
  ) {
    return this.quizzesService.updateQuizQuestion(
      id,
      questionId,
      newQuestionId,
    );
  }
}
