import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  hetHealth() {
    return 'ok';
  }
}
