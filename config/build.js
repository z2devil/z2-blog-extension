import fs from 'fs-extra';
import copy from 'recursive-copy';
import webpack from 'webpack';
import ora from 'ora';
import config from './webpack.config.js';

const spinner = ora();

main();

// 构建
async function main() {
  spinner.start('准备打包...');
  try {
    await fs.emptyDir('build');
    spinner.start('拷贝静态文件...');
    await copys();
    spinner.start('打包中...');
    const stats = await build(config);
    console.log(stats);
  } catch (error) {
    spinner.fail('打包失败：' + JSON.stringify(error));
    return process.exit(0);
  }
  spinner.succeed('打包成功！');
  process.exit(0);
}

// 复制静态文件
async function copys() {
  return new Promise(async (resolve, reject) => {
    // 复制静态文件
    await copy('./src/static', './build/static', {
      overwrite: true,
    }).catch(function (error) {
      console.error('Copy failed: ' + error);
      reject();
    });

    // 复制 popup.html
    await copy('./src/popup', './build/popup', {
      overwrite: true,
      filter: ['popup.html'],
    }).catch(function (error) {
      console.error('Copy failed: ' + error);
      reject();
    });

    // 复制 manifest.json
    await copy('./src', './build', {
      overwrite: true,
      filter: ['manifest.json'],
    })
      .then(function (results) {
        resolve();
      })
      .catch(function (error) {
        console.error('Copy failed: ' + error);
        reject();
      });
  });
}

// 打包
async function build(config) {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(stats);
    });
  });
}
