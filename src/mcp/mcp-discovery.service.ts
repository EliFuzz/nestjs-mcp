import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { z } from 'zod';

export const MCP_TOOL_METADATA = Symbol('mcp:tool');
export const MCP_SERVER = 'MCP_SERVER';

export interface McpToolMetadata {
    name: string;
    title: string;
    description: string;
    inputSchema: z.ZodRawShape;
    outputSchema: z.ZodRawShape;
}

@Injectable()
export class McpDiscoveryService implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
        private readonly mcpServer: McpServer,
        private readonly logger: Logger,
    ) { }

    onModuleInit(): void {
        this.discoverAndRegisterTools();
    }

    private discoverAndRegisterTools(): void {
        const providers = this.discoveryService.getProviders();
        const controllers = this.discoveryService.getControllers();

        [...providers, ...controllers].map((wrapper) => this.processInstance(wrapper));

        this.logger.log('All MCP tools have been registered');
    }

    private processInstance(wrapper: InstanceWrapper): void {
        if (!wrapper.instance || !wrapper.metatype) {
            return;
        }

        const metadata = this.reflector.get<McpToolMetadata>(MCP_TOOL_METADATA, wrapper.metatype);
        if (!metadata) {
            return;
        }

        const toolInstance = wrapper.instance;
        if (typeof toolInstance.execute !== 'function') {
            this.logger.warn(`Tool ${metadata.name} does not have an execute method`);
            return;
        }

        (this.mcpServer as any).registerTool(
            metadata.name,
            {
                title: metadata.title,
                description: metadata.description,
                inputSchema: metadata.inputSchema,
                outputSchema: metadata.outputSchema,
            },
            async (input: unknown) => {
                try {
                    return { content: [], structuredContent: await toolInstance.execute(input) as Record<string, unknown> };
                } catch (error) {
                    this.logger.error(`Error executing tool ${metadata.name}:`, error);
                    return {
                        content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                        isError: true
                    };
                }
            },
        );

        this.logger.log(`Registered MCP tool: ${metadata.name}`);
    }
}
