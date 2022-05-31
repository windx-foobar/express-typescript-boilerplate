<p align="center">
  <img src="./windx-logo.jpg" alt="windx-foobar" width="400" />
</p>

<h1 align="center">Express Typescript WXPlate</h1>

<p align="center">
  <a href="https://app.travis-ci.com/github/windx-foobar/express-typescript-wxplate">
    <img src="https://img.shields.io/travis/com/windx-foobar/express-typescript-wxplate/master?label=Travis%20CI" alt="travis" />
  </a>
  <a href="https://github.com/windx-foobar/express-typescript-wxplate/actions/workflows/test_on_push_master.yml">
    <img src="https://github.com/windx-foobar/express-typescript-wxplate/actions/workflows/test_on_push_master.yml/badge.svg?branch=master" alt="github workflows" />
  </a>
  <a href="https://github.com/windx-foobar/express-typescript-wxplate/tree/master">
    <img src="https://img.shields.io/github/package-json/v/windx-foobar/express-typescript-wxplate/master" alt="Master Version">
  </a>
  <a href="https://stackshare.io/windx-foobar/express-typescript-wxplate">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<br />

![divider](./windx-divider.png)

## ❯ Зачем?

Главная цель проекта — полнофункциональное серверное приложение. Данный репозиторий предоставляет готовую площадку для построения backend приложения. Не тратьте часы на настройку и разработку ядра!

Просто попробуйте!! Буду рад любому фидбэку. Нашли баг или есть предложение? Добро пожаловать в issue!

### Функционал

- **Easy API Testing** тесты писать просто, когда есть готовые примеры.
- **Dependency Injection** красивая реализация, используя [TypeDI](https://github.com/pleerock/typedi).
- **Simplified Database Query** используя [Sequelize v6](https://github.com/sequelize/sequelize/tree/v6.20.0).
- **Typescript Wrapping Sequelize**
  используя [Sequelize Typescript](https://github.com/RobinBuschmann/sequelize-typescript).
- **Laravel based structure** используя большинство нужных слоев, таких как Controller, Middleware, Model, Service, Auth.
- **Easy Exception Handling** используя [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Smart Validation** используя [class-validator](https://github.com/pleerock/class-validator). Просто добавьте декораторы!
- **Integrated Testing Tool** используя [Jest](https://facebook.github.io/jest).
- **E2E API Testing** используя [supertest](https://github.com/visionmedia/supertest).
- **Basic Security Features** используя [Helmet](https://helmetjs.github.io/).
- **Easy event dispatching** используя [event-dispatch](https://github.com/pleerock/event-dispatch).
- **Fast Database Building** используя собственные наработки и [Sequelize CLI](https://github.com/sequelize/cli).
- **Easy Data Seeding** используя cli и структуру, идентичную миграциям.
- **Basic Authorization** используя [passport](https://github.com/jaredhanson/passport).

### В будущем

- **API Documentation** используя [swagger](http://swagger.io/).
- **API Monitoring** используя [express-status-monitor](https://github.com/RafalWilinski/express-status-monitor).
- **Docker && Docker Compose** создать композицую нужных инструментов для быстрого старта.
- **Nodemailer** отправка писем на электронную почту [nodemailer](https://nodemailer.com/about/).

![divider](./windx-divider.png)

## ❯ Содержание

- [Начало установки](#-начало-установки)
- [Доступные CLI скрипты](#-доступные-cli-скрипты)
- [Маршруты API (routes)](#-маршруты-api)
- [Структура проекта](#-структура-проекта)
- [Логирование (logging)](#-логирование)
- [Вызов события (event dispatching)](#-вызов-события)
- [Заполнение базы данными (seeding)](#-заполнение-базы-данными)
- [Дополнительная документация](#-дополнительная-документация)
- [Связанные проекты](#-связанные-проекты)
- [Лицензия](#-лицензия)
- [TODO](#-todo)

![divider](./windx-divider.png)

## ❯ Начало установки

### Шаг 1: Установка окружения Разработчика

Нужно собрать окружение разработчика для начала чего-то великого.

Установите [Node.js >= 14 and NPM](https://nodejs.org/en/download/)

- в OSX используем [homebrew](http://brew.sh) `brew install node`
- в Windows используем [chocolatey](https://chocolatey.org/) `choco install nodejs`
- в Debian|Ubuntu используем [instruction](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)
- в Arch используем [pacman](https://wiki.archlinux.org/title/pacman) `sudo pacman -Sy nodejs npm`

Устанавливаем yarn в глобальную область видимости

```bash
sudo npm i -G yarn
```

Установите [MySQL](https://www.mysql.com/downloads/) или [PostgreSQL](https://www.postgresql.org/download/) по вашему желанию. Необязательно устанавливать сразу оба движка. Выберите какой больше
нравится!

> Если вы используете Unix системы, рекомендую устанавливать все, используя Package Manager.

### Шаг 2: Создание нового проекта

Склонируйте или скачайте данный репозиторий. Отредактируйте package.json под ваш проект.

Далее скопируйте `.env.example` в `.env`. В этом файле хранится вся конфигурация приложения (БД, Название и т.д.)

Создайте новую базу данных, используя наименование из `.env`-файла.

Настало время запустить скрипт установки приложения.

```bash
yarn setup
```

> Данный скрипт установит все зависимости, используя yarn. Дальше скрипт запустит начальные миграции и заполнит базу тестовыми данными.

### Шаг 3: Запускаем сервер

Перейдите в директорию проекта, если вы не в ней, и запустите приложение в DEV режиме, используя yarn скрипт.

```bash
yarn start serve
```

> Данный скрипт запустит локальный сервер, используя `nodemon`, который будет следить за измениями файлов приложения и перезапускать сервер.
> В вашей командной оболочке отобразится информация, на каком `{APP_HOST}:{APP_PORT}` запустился сервер.
> Попробуйте перейти по `http://{APP_HOST}:{APP_PORT}/api`. Вы должны увидеть информацию в JSON формате!

![divider](./windx-divider.png)

## ❯ Доступные CLI скрипты

Все скрипты определены в файле `package-scripts.js`, но самые важные описаны здесь.   
Так же все доступные скрипты можно увидеть, набрав `yarn nps help`

### Установка

- Для установки зависимостей используйте `yarn install`

### Анализ качества кода (Linting)

- Для запуска анализа качества кода используйте команду `yarn start lint`. Она запустит tslint.
- Для этого так же существует задача в JetBrains `lint`.

### Тестирование

- Для запуска unit тестов, используйте `yarn start test.unit`.
- Для запуска integration тестов, используйте `yarn start test.integration`.
- Для запуска e2e тестов, используйте `yarn start test.e2e`.
- Для запуска полного тестирования, используйте `yarn start test`
  (Так же можно запустить, используя JetBrains задачу `test`).

### Запуск в режиме разработчика (development)

- Запустите команду `yarn start serve` для запуска nodemon, который будет использовать ts-node, для работы вашего приложения.
- В консоли вы увидите `http://{APP_HOST}:{APP_PORT}`. Это хост и порт, на котором запущено приложение.

### Сборка приложения и запуск в боевом (production) режиме

- Запустите команду `yarn start build`, которая запустит транспиляцую всех TypeScript исходников в JavaScript код
  (Так же можно запустить, используя JetBrains задачу `build`).
- После транспиляции приложения и появления папки `dist`, используйте `yarn start`.

> Несколько слов о production режиме.
> Когда вы собрали и запустили приложение командой `yarn start`, логгирование в терминале не происходит.
> Это нормальное поведение. Боевой режим логгируется в файлах, которые автоматически создаются в директории logs.
> Их можно просматривать утилитой `tail` набрав `tail -f <projectDir>/logs/production-log-XXXX-XX-XX.log`(bash|sh|zsh) или аналогичным инструментом в других системах.

### Миграции базы данных (migrations)

- Для создания миграции используйте `yarn start "make.migration --name <migration-file-name>"` (обратите внимание на кавычки, они обязательны!).
- Для запуска миграций используйте `yarn start db.migrate`. Данный скрипт запустит миграции, которые еще не были запущены.
- Для отката миграций есть несколько вариантов
  1. `yarn start "db.revert --all"` (обратите внимание на кавычки, они обязательны!) откатит все миграции без исключения
  2. `yarn start db.revert` откатит только последние миграции
- Для того чтобы откатить все и заполнить снова (fresh) используйте `yarn start db.fresh`.

### Заполнение базы данных (seeding)

- Используйте команду `yarn start db.seed` для заполнения базы данных инструкциями ***всех*** сидеров.
- Используйте команду `yarn start "db.seed --last"` (обратите внимание на кавычки, они обязательны!) для заполнения базы данных инструкциями ***последнего*** сидеров.
- Используйте команду `yarn start "db.seed --run <file1WithoutExt>,<file2WithoutExt>,<...other>"` (обратите внимание на кавычки, они обязательны!) для заполнения базы данных инструкциями ***
  указанных*** сидеров.

![divider](./windx-divider.png)

## ❯ Маршруты API

По умолчанию префикс всех api маршрутов `/api`, но вы всегда можете изменить его в `.env`->`APP_ROUTE_PREFIX`
The swagger and the monitor route can be altered in the `.env` file.

| Маршрут        | Описание    |
| -------------- | ----------- |
| **/api**       | Покажет название, версию и описание приложения |
| **/api/users** | Маршруты с примером пользователей |
| **/api/pets**  | Маршруты с примером питомцев |

![divider](./windx-divider.png)

## ❯ Структура проекта

| Путь                                    | Описание    |
| --------------------------------------- | ----------- |
| **.jetbrains/**                         | Задачи для JetBrains IDE (WebStorm, PHPStorm и т.д.) |
| **.github/**                            | Github Workflows (CI) |
| **dist/**                               | Странспилированные исходники располагаются здесь |
| **{app,global,packages,public}/**       | Исходный код приложения |
| **app/http/controllers/**               | REST API Контроллеры |
| **app/errors/**                         | Пользовательские ошибки (пример: SimpleError.ts) |
| **app/http/middlewares/**               | Middleware для express (see: [Детальнее](https://github.com/typestack/routing-controllers#creating-your-own-express-middleware)) |
| **app/models/**                         | Модели Sequelize (примеры объявления моделей можно найти внутри) |
| **app/services/**                       | Здесь располагаются файлы для серверного слоя (пример сервиса: app/services/UserService.ts. пример использования: app/http/controllers/UserController.ts) |
| **app/http/subscribers/**               | Подписчики на события (пример подписчика: app/http/subscribers/UserEventSubscriber.ts. пример использования: app/services/UserService.ts) |
| **global/middlewares/** *Middleware.ts  | Глобальные middleware для express (о) |
| **packages/core/**                      | Ядро проекта |
| **packages/core/auth/**                 | Проверка авторизации и passportLoader в bootstrapFramework (see1: [Детальнее routing-controllers](https://github.com/typestack/routing-controllers#using-authorization-features), see2: [Детальнее passport](https://www.passportjs.org/docs/)) |
| **packages/core/decorators/**           | Пользовательские декораторы, например @Logger & @EventDispatch |
| **packages/core/loaders/**              | Расположение загрузчиков в bootstrapFramework |
| **packages/core/types/** *.d.ts         | Определение пользовательских типов, которых нет в DefinitelyTyped |
| **database/migrations**                 | Файлы с инструкциями миграций базы данных |
| **database/seeds**                      | Файлы с инструкциями заполнения базы данных |
| **public/**                             | Статика, которая отдается как есть (fonts, css, js, img). |
| **public/index.ts**                     | Входной файл приложения. |
| **test**                                | Директория тестов |
| **test/e2e/** *.test.ts                 | End-2-End тесты (like e2e) |
| **test/integration/** *.test.ts         | Интеграционные тесты, используя SQLite3 |
| **test/unit/** *.test.ts                | Unit тесты |
| .env.example                            | Пример переменных окружения |
| .env.test                               | Переменные окружения для тестовой среды |

![divider](./windx-divider.png)

## ❯ Логирование

Используемый logger [winston](https://github.com/winstonjs/winston). Для логирования http запросов используется
middleware [morgan](https://github.com/expressjs/morgan). Создан декоратор, который инъектит logger в ваш класс (например: сервис, контроллер)
(см. пример ниже).

```typescript
import { Logger, LoggerInterface } from '@packages/core/decorators/Logger';

@Service()
export class UserService {

  constructor(
    @Logger(__filename) private log: LoggerInterface
  ) { }
  
  ...
  
}
```

![divider](./windx-divider.png)

## ❯ Вызов события

Используется отличный репозиторий [event-dispatch](https://github.com/pleerock/event-dispatch), который решает проблему с вызовом событий.
Создан декоратор, который инъектит EventDispatch в ваш класс (например: сервис, контроллер) (см. пример ниже). Все события должны быть определены
в файле `<projectRoot>/app/http/subscribers/events.ts`.

```typescript
import { events } from '@app/http/subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '@packages/core/decorators/EventDispatcher';

@Service()
export class UserService {

  constructor(
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) { }

  public async create(user: User): Promise<User> {
  ...
    this.eventDispatcher.dispatch(events.user.created, newUser);
  ...
  }
  
  ...
  
}
```

![divider](./windx-divider.png)

## ❯ Заполнение базы данными

Как же утомительно заполнять данными таблицы в базе...

Как это работает? Просто создайте seed файл с инструкциями по заполнению.

### 1. Создание seed файла

Сид файлы определяют чем заполнять ваши таблицы, и какие таблицы заполнять.
Файлы будут выполнены по времени создания (от меньшего к большому), если вы запустили скрипт
без опций, но об этом ниже:)

> Совет:   
> Не создавайте файлы сидеров вручную, используйте консольную команду `yarn start "make.seed --name <SeedName>"`   
> Это поможет избежать лишних проблем и сэкономит время

```typescript
// 20220510161938-FillTable

import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    /**
     * Вводите код сидера сюда
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed
     */
    
    const records = [
      { name: 'foo', created_at: new Date(), updated_at: new Date() },
      { name: 'bar', created_at: new Date(), updated_at: new Date() },
      { name: 'baz', created_at: new Date(), updated_at: new Date() },
    ];
    
    return queryInterface.bulkInsert('table', records);
  }
}
```

Безусловно, нужно понимать как работает queryInterface из пакета sequelize.

### 2. Запуск сидера

Последний шаг - запуск сидеров из папки seeds.

```bash
yarn start db.seed
```

#### CLI Команды

| Команда                                                                               | Описание    |
| ------------------------------------------------------------------------------------- | ----------- |
| `yarn start "db.seed"`                                                                | Запустит все сидеры из папки seeds |
| `yarn start "db.seed --run 20220510161938-FillTableFoo,20220510201938-FillTableBar"`  | Запустит указанные сидеры (наименование файлов нужно указывать через запятую, с меткой времени, но без расширения) |
| `yarn start "db.seed --seeds <path>"`                                                 | Переопределить папку с сидерами (По умолчанию: `<projectRoot>/database/seeds/`) |

![divider](./windx-divider.png)

## ❯ Дополнительная документация

| Name & Link                       | Description                       |
| --------------------------------- | --------------------------------- |
| [Express](https://expressjs.com/) | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| [Microframework](https://github.com/pleerock/microframework) | Microframework is a simple tool that allows you to execute your modules in a proper order, helping you to organize bootstrap code in your application. |
| [TypeDI](https://github.com/pleerock/typedi) | Dependency Injection for TypeScript. |
| [routing-controllers](https://github.com/pleerock/routing-controllers) | Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework. |
| [class-validator](https://github.com/pleerock/class-validator) | Validation made easy using TypeScript decorators. |
| [class-transformer](https://github.com/pleerock/class-transformer) | Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors |
| [event-dispatcher](https://github.com/pleerock/event-dispatch) | Dispatching and listening for application events in Typescript |
| [Helmet](https://helmetjs.github.io/) | Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! |
| [Auth0 API Documentation](https://auth0.com/docs/api/management/v2) | Authentification service |
| [Jest](http://facebook.github.io/jest/) | Delightful JavaScript Testing Library for unit and e2e tests |
| [supertest](https://github.com/visionmedia/supertest) | Super-agent driven library for testing node.js HTTP servers using a fluent API |
| [nock](https://github.com/node-nock/nock) | HTTP mocking and expectations library |
| [SQLite Documentation](https://www.sitepoint.com/getting-started-sqlite3-basic-commands/) | Getting Started with SQLite3 – Basic Commands. |
| [Sequelize v6 Documentation](https://sequelize.org/docs/v6/) | Sequelize is a promise-based Node.js ORM tool for Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server, Amazon Redshift and Snowflake’s Data Cloud. |
| [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) | Decorators and some other features for sequelize (v6). |

![divider](./windx-divider.png)

# ❯ Связанные проекты

- [Microsoft/TypeScript-Node-Starter](https://github.com/Microsoft/TypeScript-Node-Starter) - A starter template for
  TypeScript and Node with a detailed README describing how to use the two together.
- [express-graphql-typescript-boilerplate](https://github.com/w3tecch/express-graphql-typescript-boilerplate) - A
  starter kit for building amazing GraphQL API's with TypeScript and express by @w3tecch
- [aurelia-typescript-boilerplate](https://github.com/w3tecch/aurelia-typescript-boilerplate) - An Aurelia starter kit
  with TypeScript
- [Auth0 Mock Server](https://github.com/hirsch88/auth0-mock-server) - Useful for e2e testing or faking an oAuth server
- [express-typescript-boilerplate](https://github.com/w3tecch/express-typescript-boilerplate) - A delightful way to building a Node.js RESTful API Services with beautiful code written in TypeScript

## ❯ Лицензия

[MIT](/LICENSE)

## ❯ TODO

[MIT](/TODO)
