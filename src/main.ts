import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const commonDescription =
    'Non public entry points are protected by JWT token. Valid token must be provided in header "Authorization". Example:\n\n' +
    '> Authorization: Bearer *TOKEN*';

  const config = new DocumentBuilder()
    .setTitle('Business01')
    .setDescription(
      `LMS application for Business01 ` + ' \n' + commonDescription,
    )
    .setVersion('0.1.0-Alpha')
    .addBearerAuth()
    .addTag('All the business content you will ever need')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
