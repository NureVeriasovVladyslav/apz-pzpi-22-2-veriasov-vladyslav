import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';
import { writeFileSync } from 'fs';
const PORT = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('e-transport')
    .setDescription('The e-transport API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Экспорт спецификации в файл JSON
  writeFileSync('./swagger-spec.json', JSON.stringify(document));
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
