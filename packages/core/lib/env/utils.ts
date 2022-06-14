import { join } from 'path';

export function getOsEnv(key: string): string {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

export function getOsEnvOptional(key: string, defaultValue?: string): string | undefined {
  if (!process.env[key]) {
    if (!defaultValue) return undefined;
    return defaultValue;
  }

  return process.env[key];
}

export function replacePathToProduction(path: string): string {
  if (process.env.NODE_ENV === 'production') {
    path = path.replace(
      /(app|global|packages|public|database|\.\/)(.*)/,
      'dist/$1$2'
    );
  }

  return join(process.cwd(), path);
}

export function getPath(path: string): string {
  const smartPath = replacePathToProduction(path);
  const isTsFile = /\.ts$/.test(smartPath);

  return process.env.NODE_ENV === 'production' && isTsFile
    ? smartPath.slice(0, -3) + '.js'
    : smartPath;
}

export function getPaths(paths: string[]): string[] {
  return paths.map((p: string) => getPath(p));
}

export function getOsPath(key: string): string {
  return getPath(getOsEnv(key));
}

export function getOsPaths(key: string): string[] {
  return getPaths(getOsEnvArray(key));
}

export function getOsEnvArray(key: string, delimiter: string = ','): string[] {
  return process.env[key] && process.env[key].split(delimiter) || [];
}

export function toNumber(value: string): number {
  return parseInt(value, 10);
}

export function toBool(value: string): boolean {
  return value === 'true';
}

export function normalizePort(port: string): number | string | boolean {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) { // named pipe
    return port;
  }
  if (parsedPort >= 0) { // port number
    return parsedPort;
  }
  return false;
}
