// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("karma-junit-reporter"), // Plugin reporter para Bamboo
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      captureConsole: true, // Para ocultar los console.log
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false, // To avoid random order
      },
    },
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html-report' },
        { type: 'lcov', subdir: 'lcov-report' }
      ],
    },
    reporters: ["progress", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browserNoActivityTimeout: 400000,
    browsers: ["Chrome_without_security"],
    customLaunchers: {
      Chrome_without_security: {
        base: "ChromeHeadless",
        flags: ["--disable-web-security", "--disable-site-isolation-trials"],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
    alertmanager: {
      servers: {
        proxy: true,
      },
    },
    junitReporter: {
      outputDir: "test-reports",
      outputFile: "test-results.xml",
      useBrowserName: false,
      suite: "",
    },
  });
};
