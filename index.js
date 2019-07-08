const Crawler = require('crawler');
const chalk = require('chalk');
const readline = require('readline');
const log = console.log;
const baseUrl =
  'http://trash.lhsr.cn/sites/feiguan/trashTypes_2/TrashQuery.aspx?kw=';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sortRubbish = kw => {
  const crawler = new Crawler({
    maxConnections: 10,
    callback(error, res, done) {
      if (error) {
        log(chalk.bold.red(error));
      } else {
        const $ = res.$;

        const target = chalk.magenta.bold(
          $('.info')
            .text()
            .trim(),
        );

        if (target) {
          const title = `${chalk.white(kw)}是${target}`;

          const desc = `${target}是指: ${chalk.yellow(
            $('.title div')
              .text()
              .trim()
              .split('：')
              .splice(1)
              .toString()
              .replace(/\s+/g, ''),
          )}`;

          const include = `${target}主要包括: ${chalk.red(
            $('.desc')
              .text()
              .trim()
              .replace(/\s+/g, ''),
          )}`;

          const tips = Object.values($('li'))
            .map(val => val.children)
            .map(val => (Array.isArray(val) ? val[0].data : null));

          const requrst = `${target}投放要求: ${chalk.magenta(
            tips.filter(f => f).join('; '),
          )}`;

          log(
            '\n\n' +
              title +
              '\n\n' +
              desc +
              '\n\n' +
              include +
              '\n\n' +
              requrst +
              '\n',
          );
        } else {
          log('暂未收录该垃圾');
        }

        done();
        rl.close();
      }
    },
  });
  crawler.queue(encodeURI(baseUrl + kw));
};

rl.question(chalk.red('Iuput the name of rubbish. >>> '), function(answer) {
  sortRubbish(answer);
});

rl.on('close', function() {
  process.exit(0);
});
