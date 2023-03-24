import { Spinner } from 'cli-spinner';

export default function startSpinner(msg: string, spinnerString: string = '|/-\\'): Spinner {
  const spinner: Spinner = new Spinner(`${msg}.. %s`);
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
}
