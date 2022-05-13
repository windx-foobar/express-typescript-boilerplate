import { glob as _glob } from 'glob';
import { exec as _exec, spawn as _spawn } from 'child_process';
import { promisify } from 'util';

export type Maybe<T> = T | undefined | null;

export const glob = promisify(_glob);
export const exec = promisify(_exec);
export const spawn = promisify(_spawn);
