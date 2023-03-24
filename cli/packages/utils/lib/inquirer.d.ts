interface PromptOptions {
    choices?: any[];
    defaultValue?: any;
    message: string;
    type?: string;
    require?: boolean;
}
export default function ({ choices, defaultValue, message, type, require }: PromptOptions): Promise<any>;
export {};
