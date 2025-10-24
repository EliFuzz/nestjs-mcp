import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { All, Controller, Logger, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('sse')
export class McpController {
    constructor(private readonly mcpServer: McpServer, private readonly logger: Logger) { }

    @All()
    async handleMcpRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });

            res.on('close', () => { void transport.close() });

            await this.mcpServer.connect(transport);
            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            this.logger.error('Error handling MCP request:', error);
            if (!res.headersSent) {
                res.status(500).json({ jsonrpc: '2.0', error: { code: 500, message: 'Internal server error' }, id: null });
            }
        }
    }
}
