/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps start',
    /**
     * Starts the builded app from the dist directory.
     */
    start: {
      script: 'cross-env NODE_ENV=production TS_NODE_BASEURL=./dist node -r tsconfig-paths/register dist/public/index.js',
      description: 'Starts the builded app'
    },
    /**
     * Serves the current app and watches for changes to restart it
     */
    serve: {
      inspector: {
        script: series(
          'nps banner.serve',
          'nodemon --inspect'
        ),
        description: 'Serves the current app and watches for changes to restart it, you may attach inspector to it.'
      },
      script: series(
        'nps banner.serve',
        'nodemon'
      ),
      description: 'Serves the current app and watches for changes to restart it'
    },
    /**
     * Setup of the development environment
     */
    setup: {
      script: series(
        'yarn install',
        'nps db.setup'
      ),
      description: 'Setup`s the development environment(yarn & database)'
    },
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: series.nps(
        'banner.build',
        'make.tsconfig',
        'lint',
        'clean.dist',
        'transpile',
        'copy',
        'copy.tmp',
        'clean.tmp'
      ),
      description: 'Builds the app into the dist directory'
    },
    /**
     * Runs TSLint over your project
     */
    lint: {
      script: tslint(`./{app,public,packages,global}/**/*.ts`),
      hiddenFromHelp: true
    },
    /**
     * Transpile your app into javascript
     */
    transpile: {
      script: `tsc --project ./tsconfig.build.json`,
      hiddenFromHelp: true
    },
    /**
     * Clean files and folders
     */
    clean: {
      default: {
        script: series(
          `nps banner.clean`,
          `nps clean.dist`
        ),
        description: 'Deletes the ./dist folder'
      },
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true
      },
      tmp: {
        script: rimraf('./.tmp'),
        hiddenFromHelp: true
      }
    },
    /**
     * Copies static files to the build folder
     */
    copy: {
      default: {
        script: series(
          // `nps copy.swagger`,
          `nps copy.public`
        ),
        hiddenFromHelp: true
      },
      swagger: {
        script: copy(
          './src/api/swagger.json',
          './dist'
        ),
        hiddenFromHelp: true
      },
      public: {
        script: copy(
          './public/*[!.ts]',
          './dist'
        ),
        hiddenFromHelp: true
      },
      tmp: {
        script: copyDir(
          './.tmp',
          './dist'
        ),
        hiddenFromHelp: true
      }
    },
    /**
     * Database scripts
     */
    db: {
      migrate: {
        default: {
          script: series(
            'nps banner.migrate',
            runFast('./packages/core/commands/db.migrate.ts')
          ),
          description: 'Выполнение миграций, которые еще не выполнены'
        },
        verbose: {
          script: series(
            'nps banner.migrate',
            runFast('./packages/core/commands/db.migrate.ts') + ' --verbose'
          ),
          description: 'Выполнение миграций, которые еще не выполнены (verbose mode)'
        }
      },
      revert: {
        default: {
          script: series(
            'nps banner.revert',
            runFast('./packages/core/commands/db.revert.ts')
          ),
          description: 'Откат миграций'
        },
        verbose: {
          script: series(
            'nps banner.revert',
            runFast('./packages/core/commands/db.revert.ts') + ' --verbose'
          ),
          description: 'Откат миграций (verbose mode)'
        }
      },
      fresh: {
        default: {
          script: series(
            'nps banner.fresh',
            runFast('./packages/core/commands/db.revert.ts'),
            runFast('./packages/core/commands/db.migrate.ts')
          ),
          description: 'Откат и миграция базы данных'
        },
        verbose: {
          script: series(
            'nps banner.fresh',
            runFast('./packages/core/commands/db.revert.ts') + ' --verbose',
            runFast('./packages/core/commands/db.migrate.ts') + ' --verbose'
          ),
          description: 'Откат и миграция базы данных (verbose mode)'
        }
      },
      seed: {
        default: {
          script: series(
            'nps banner.seed',
            runFast(`./packages/core/commands/db.seed.ts`)
          ),
          description: 'Заполнить базу инструкциями из сидера'
        },
        verbose: {
          script: series(
            'nps banner.seed',
            runFast(`./packages/core/commands/db.seed.ts`) + ' --verbose'
          ),
          description: 'Заполнить базу инструкциями из сидера (verbose)'
        }
      },
      setup: {
        default: {
          script: series.nps(
            'db.fresh',
            'db.seed'
          ),
          description: 'Пересоздать базу данных с заполненными данными'
        },
        verbose: {
          script: series.nps(
            'db.fresh.verbose',
            'db.seed.verbose'
          ),
          description: 'Пересоздать базу данных с заполненными данными (verbose mode)'
        }
      }
    },
    /**
     * These run various kinds of tests. Default is unit.
     */
    test: {
      default: series.nps('test.unit', 'test.integration', 'test.e2e'),
      unit: {
        default: {
          script: series(
            'nps banner.testUnit',
            'nps test.unit.pretest',
            'nps test.unit.run'
          ),
          description: 'Runs the unit tests'
        },
        pretest: {
          script: tslint(`./test/unit/**.ts`),
          hiddenFromHelp: true
        },
        run: {
          script: 'cross-env NODE_ENV=test jest --testPathPattern=unit --testPathIgnorePatterns=__tests',
          hiddenFromHelp: true
        },
        verbose: {
          script: 'nps "test.unit --verbose"',
          hiddenFromHelp: true
        },
        coverage: {
          script: 'nps "test.unit --coverage"',
          hiddenFromHelp: true
        }
      },
      integration: {
        default: {
          script: series(
            'nps banner.testIntegration',
            'nps test.integration.pretest',
            'nps test.integration.run'
          ),
          description: 'Runs the integration tests'
        },
        pretest: {
          script: tslint(`./test/integration/**.ts`),
          hiddenFromHelp: true
        },
        run: {
          // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
          script: 'cross-env NODE_ENV=test jest --testPathPattern=integration -i --testPathIgnorePatterns=__tests',
          hiddenFromHelp: true
        },
        verbose: {
          script: 'nps "test.integration --verbose"',
          hiddenFromHelp: true
        },
        coverage: {
          script: 'nps "test.integration --coverage"',
          hiddenFromHelp: true
        }
      },
      e2e: {
        default: {
          script: series(
            'nps banner.testE2E',
            'nps test.e2e.pretest',
            'nps test.e2e.run'
          ),
          description: 'Runs the e2e tests'
        },
        pretest: {
          script: tslint(`./test/e2e/**.ts`),
          hiddenFromHelp: true
        },
        run: {
          // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
          script: 'cross-env NODE_ENV=test jest --testPathPattern=e2e --testPathIgnorePatterns=__tests -i',
          hiddenFromHelp: true
        },
        verbose: {
          script: 'nps "test.e2e --verbose"',
          hiddenFromHelp: true
        },
        coverage: {
          script: 'nps "test.e2e --coverage"',
          hiddenFromHelp: true
        }
      }
    },
    make: {
      migration: {
        default: {
          script: series(
            'nps banner.makeMigration',
            runFast(`./packages/core/commands/make.migration.ts`)
          ),
          description: 'Генерация файла миграции'
        },
        verbose: {
          script: series(
            'nps banner.makeMigration',
            runFast(`./packages/core/commands/make.migration.ts`) + ' --verbose'
          ),
          description: 'Генерация файла миграции (verbose mode)'
        }
      },
      seed: {
        default: {
          script: series(
            'nps banner.makeSeed',
            runFast(`./packages/core/commands/make.seed.ts`)
          ),
          description: 'Генерация файла сидера'
        },
        verbose: {
          script: series(
            'nps banner.makeSeed',
            runFast(`./packages/core/commands/make.seed.ts`) + ' --verbose'
          ),
          description: 'Генерация файла сидера (verbose mode)'
        }
      },
      /**
       * Creates the needed configuration files
       */
      tsconfig: {
        default: {
          script: runFast(`./packages/core/commands/make.tsconfig.ts`),
          description: 'Генерация файла tsconfig.build.json',
          hiddenFromHelp: true
        },
        verbose: {
          script: runFast(`./packages/core/commands/make.tsconfig.ts`) + ' --verbose',
          description: 'Генерация файла tsconfig.build.json (verbose mode)',
          hiddenFromHelp: true
        }
      }
    },
    /**
     * This creates pretty banner to the terminal
     */
    banner: {
      build: banner('build'),
      serve: banner('serve'),
      testUnit: banner('test.unit'),
      testIntegration: banner('test.integration'),
      testE2E: banner('test.e2e'),
      migrate: banner('migrate'),
      makeMigration: banner('make.migration'),
      makeSeed: banner('make.seed'),
      seed: banner('seed'),
      revert: banner('revert'),
      fresh: banner('fresh'),
      clean: banner('clean')
    }
  }
};

function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: runFast(`./packages/core/commands/banner.ts ${name}`)
  };
}

function copy(source, target) {
  return `copyfiles --up 1 ${source} ${target}`;
}

function copyDir(source, target) {
  return `ncp ${source} ${target}`;
}

function run(path) {
  return `ts-node -r tsconfig-paths/register ${path}`;
}

function runFast(path) {
  return `ts-node -r tsconfig-paths/register -T ${path}`;
}

function tslint(path) {
  return `tslint -c ./tslint.json ${path} --format stylish`;
}
