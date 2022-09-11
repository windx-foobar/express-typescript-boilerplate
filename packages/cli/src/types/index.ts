export interface CommandOptions {
  name: string;
  description?: string;
  arguments?: string[];
  alias?: string;
  options?: Array<[string, string, any?]>;
  namespace?: string;
}
