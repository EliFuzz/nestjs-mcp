import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Global, Logger, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MCP_SERVER, McpDiscoveryService } from './mcp-discovery.service';
import { McpController } from './mcp.controller';

@Global()
@Module({
    imports: [DiscoveryModule],
    controllers: [McpController],
    providers: [
        { provide: MCP_SERVER, useFactory: () => new McpServer({ name: 'nest-mcp-server', version: '1.0.0' }) },
        { provide: McpServer, useExisting: MCP_SERVER },
        McpDiscoveryService,
        Logger,
    ],
    exports: [McpServer, MCP_SERVER],
})
export class McpModule { }
