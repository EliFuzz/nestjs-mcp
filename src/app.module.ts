import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { McpModule } from './mcp/mcp.module';
import { SumTool } from './tools/sum.tool';

@Module({
  imports: [McpModule],
  controllers: [HealthController],
  providers: [SumTool],
})
export class AppModule { }
