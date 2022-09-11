import { Container } from 'typedi';

const CONTAINER_NAME = Symbol('commands');

export const CommandContainer = Container.of(CONTAINER_NAME);
