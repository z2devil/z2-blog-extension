const webpack = require('webpack');
const chalk = require('chalk');
const copy = require('recursive-copy');
const fs = require('fs-extra');

const formatWebpackMessages = require('../formatWebpackMessages');

const paths = require('../paths');

const configFactory = require('../webpack.config');

const config = configFactory('production');

// 复制一些文件到发布目录
const copys = async () => {
    return new Promise(async (resolve, reject) => {
        // 复制静态文件
        await copy('./src/static', './build/static', {
            overwrite: true,
        }).catch(function (error) {
            console.error('Copy failed: ' + error);
            reject();
        });

        // 复制 popup 文件
        await copy('./src/popup', './build/popup', {
            overwrite: true,
        }).catch(function (error) {
            console.error('Copy failed: ' + error);
            reject();
        });

        // 复制 manifest
        await copy('./src', './build', {
            overwrite: true,
            filter: ['manifest.json'],
        })
            .then(function (results) {
                resolve();
                console.log('Copy success');
            })
            .catch(function (error) {
                console.error('Copy failed: ' + error);
                reject();
            });
    });
};

// 打包发布目录
const build = async () => {
    console.log('Creating an optimized production build...');
    const compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }

                let errMessage = err.message;

                // Add additional information for postcss errors
                if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                    errMessage +=
                        '\nCompileError: Begins at CSS selector ' +
                        err['postcssNode'].selector;
                }

                messages = formatWebpackMessages({
                    errors: [errMessage],
                    warnings: [],
                });
            } else {
                messages = formatWebpackMessages(
                    stats.toJson({ all: false, warnings: true, errors: true })
                );
            }
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }
            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                    process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
            ) {
                // Ignore sourcemap warnings in CI builds. See #8227 for more info.
                const filteredWarnings = messages.warnings.filter(
                    w => !/Failed to parse source map/.test(w)
                );
                if (filteredWarnings.length) {
                    console.log(
                        chalk.yellow(
                            '\nTreating warnings as errors because process.env.CI = true.\n' +
                                'Most CI servers set it automatically.\n'
                        )
                    );
                    return reject(new Error(filteredWarnings.join('\n\n')));
                }
            }

            const resolveArgs = {
                stats,
                warnings: messages.warnings,
            };

            return resolve(resolveArgs);
        });
    });
};

// 构建
const main = async () => {
    await fs.emptyDir(paths.appBuild);
    await copys();
    const { stats, warnings } = await build();
    if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
            '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
        );
        console.log(
            'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
        );
    } else {
        console.log(chalk.green('Compiled successfully.\n'));
    }
};

main();

console.log('Start pack');
