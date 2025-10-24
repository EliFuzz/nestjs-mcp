import { SetMetadata } from '@nestjs/common';
import { MCP_TOOL_METADATA } from 'src/mcp/mcp-discovery.service';
import { z } from 'zod';

export interface McpToolConfig<TInput = any, TOutput = any> {
    name: string;
    title: string;
    description: string;
    inputSchema: z.ZodRawShape;
    outputSchema: z.ZodRawShape;
    handler: (input: TInput) => Promise<TOutput>;
}

export function McpTool<TInput = any, TOutput = any>(config: Omit<McpToolConfig<TInput, TOutput>, 'handler'>) {
    return function <T extends { new(...args: any[]): any }>(target: T): T {
        SetMetadata(MCP_TOOL_METADATA, config)(target);
        return target;
    };
}
