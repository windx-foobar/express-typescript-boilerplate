<p align="center">
  <img src="./windx-logo.jpg" alt="windx-foobar" width="400" />
</p>

<h1 align="center">Express Typescript WXPlate</h1>

<p align="center">
  <a href="https://app.travis-ci.com/github/windx-foobar/express-typescript-wxplate">
    <img src="https://api.travis-ci.org/windx-foobar/express-typescript-wxplate.svg?branch=master" alt="travis" />
  </a>
  <a href="https://stackshare.io/windx-foobar/express-typescript-wxplate">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<br />

![divider](./windx-divider.png)

## ❯ Зачем?

Главная цель проекта — полнофункциональное серверное приложение. Данный репозиторий предоставляет готовую площадку для
построения backend приложения. Не тратьте часы на настройку и разработку ядра!

Просто попробуйте!! Буду рад любому фидбэку. Нашли баг или есть предложение? Добро пожаловать в issue!

### Функционал

- **Easy API Testing** тесты писать просто, когда есть готовые примеры.
- **Dependency Injection** красивая реализация, используя [TypeDI](https://github.com/pleerock/typedi).
- **Simplified Database Query** используя [Sequelize v6](https://github.com/sequelize/sequelize/tree/v6.20.0).
- **Laravel based structure** используя большинство нужных слоев, таких как Controller, Middleware, Model, Service,
  Auth.
- **Easy Exception Handling** используя [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Smart Validation** используя [class-validator](https://github.com/pleerock/class-validator). Просто добавьте
  декораторы!
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

![divider](./windx-divider.png)

## ❯ Содержание

- [Начало установки](#-начало-установки)
- [Скрипты и задачи](#-scripts-and-tasks)
- [Маршруты API (routes)](#-api-routes)
- [Структура проекта](#-project-structure)
- [Логирование (logging)](#-logging)
- [Эвенты (evnts dispatchers)](#-event-dispatching)
- [Заполнение данными (seeding)](#-seeding)
- [Дополнительная документация](#-further-documentation)
- [Связанные проекты](#-related-projects)
- [Лицензия](#-license)

![divider](./w3tec-divider.png)

## ❯ Начало установки

### Шаг 1: Установка окружения Разработчика

Нужно собрать окружение разработчика для начала чего-то великого.

Установите [Node.js >= 14 and NPM](https://nodejs.org/en/download/)

- в OSX используем [homebrew](http://brew.sh) `brew install node`
- в Windows используем [chocolatey](https://chocolatey.org/) `choco install nodejs`
- в Debian|Ubuntu
  используем [instruction](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)
- в Arch используем [pacman](https://wiki.archlinux.org/title/pacman) `sudo pacman -Sy nodejs npm`

Устанавливаем yarn в глобальную область видимости

```bash
sudo npm i -G yarn
```

Установите [MySQL](https://www.mysql.com/downloads/) или [PostgreSQL](https://www.postgresql.org/download/) по вашему
желанию. Необязательно устанавливать сразу оба движка. Выберите какой больше нравится!

> Если вы исользуете Unix системы, рекомендую устанавливать все, используя Package Manager.
