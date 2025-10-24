import { Injectable } from '@nestjs/common';
import { McpTool } from 'src/mcp/mcp-tool.decorator';
import { z } from 'zod';

type SumInput = {
    a: number;
    b: number;
};

type SumOutput = {
    result: number;
    operation: string;
};

@Injectable()
@McpTool<SumInput, SumOutput>({
    name: 'sum',
    title: 'Sum Two Numbers',
    description: 'Adds two numbers together and returns the result',
    inputSchema: {
        a: z.number().describe('First number to add'),
        b: z.number().describe('Second number to add'),
    },
    outputSchema: {
        result: z.number().describe('The sum of the two numbers'),
        operation: z.string().describe('Description of the operation performed'),
    },
})
export class SumTool {
    execute(input: SumInput): Promise<SumOutput> {
        const { a, b } = input;
        return Promise.resolve({
            result: a + b,
            operation: `Added ${a} and ${b}`,
        });
    }
}
