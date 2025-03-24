import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CurrentUser } from './common/decorators/user.decorator';
import { ResponseMessage } from './common/decorators/response-message.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  @ResponseMessage('服务运行正常')
  ping(): { status: string } {
    return { status: 'ok' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ResponseMessage('认证成功，受保护资源访问成功')
  protected(@CurrentUser() user: any): { message: string; user: any } {
    return {
      message: '这是一个受保护的资源',
      user,
    };
  }

  @Get('custom-message')
  customMessage(): { data: string[]; message: string } {
    return {
      data: ['这是一个自定义消息的示例'],
      message: '这是自定义的成功消息',
    };
  }

  @Get('custom-message-decorator')
  @ResponseMessage('这是通过装饰器设置的自定义成功消息')
  customMessageDecorator(): string[] {
    return ['这是一个自定义消息的示例'];
  }

  @Get('error-demo')
  errorDemo(): never {
    throw new Error('这是一个示例错误');
  }
}
