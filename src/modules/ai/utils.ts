import GPT3TokenizerImport from 'gpt3-tokenizer';

export const regexpEncode = (str: string) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const GPT3Tokenizer: typeof GPT3TokenizerImport =
  typeof GPT3TokenizerImport === 'function'
    ? GPT3TokenizerImport
    : (GPT3TokenizerImport as any).default;
// https://github.com/chathub-dev/chathub/blob/main/src/app/bots/chatgpt-api/usage.ts
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

export function countTokens(str: string): number {
  const encoded = tokenizer.encode(str);
  return encoded.bpe.length;
}
export const MAX_TOKENS = 4096;
