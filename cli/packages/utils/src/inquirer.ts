import inquirer from 'inquirer';

interface PromptOptions {
  choices?: any[];
  defaultValue?: any;
  message: string;
  type?: string;
  require?: boolean;
}

export default function ({ choices, defaultValue, message, type = 'list', require = true }: PromptOptions): Promise<any> {
  const options: inquirer.Question = {
    type,
    name: 'name',
    message,
    default: defaultValue,
    require,
  };
  if (type === 'list') {
    options.choices = choices;
  }
  return inquirer.prompt(options).then(answer => answer.name);
}
