const reporter = require('k6-html-reporter');

const options = {
    jsonFile: "./summary.json",
    output: "output.html",
};

reporter.generateSummaryReport(options);
