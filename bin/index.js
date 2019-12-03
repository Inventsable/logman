#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const format = require("date-fns/format");
const inquirer = require("inquirer");

async function init() {
  const now = getTime();
  const today = getDate();
  const check = await ensureHasLogger();

  let res = await checkHasToday(today);
  res = res
    ? fs.readFileSync(`./.logger/${today}.md`, { encoding: "utf-8" })
    : ``;
  res = sanitizeRes(res);
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "change",
      message: `${today} > [${now}]:`
    }
  ]);
  let text = ` **[${now}]** ${
    /^[a-z]/.test(answer.change)
      ? answer.change.charAt(0).toUpperCase() + answer.change.slice(1)
      : answer.change
  }\r\n`;
  res.unshift(text);
  let file = `### ${today}

${res
  .map(item => {
    return `-${item}`;
  })
  .join("")}`;
  fs.writeFileSync(`./.logger/${today}.md`, file);
  writeAll();
}

function sanitizeRes(res) {
  let result = /\-/.test(res)
    ? res
        .replace(/\#{3}\s[^\-]*/gm, "")
        .trim()
        .split(/^-/m)
    : [];
  return result.length
    ? result.filter(item => {
        return item.length;
      })
    : [];
}

async function checkHasToday(today) {
  let res = await readDir("./.logger");
  return res && res.length ? res.includes(`${today}.md`) : false;
}

async function ensureHasLogger() {
  let res = await readDir("./");
  return res.includes(".logger") ? true : fs.mkdirSync("./.logger");
}

async function readDir(thispath) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(thispath), { encoding: "utf-8" }, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

async function writeAll() {
  let folder = await readDir("./.logger");
  let master = [];
  folder.forEach(file => {
    let data = fs.readFileSync(`./.logger/${file}`, "utf8");
    master.unshift(data);
  });
  fs.writeFileSync("./CHANGELOG.md", master.join("\r\r"));
}

function getTime() {
  return format(new Date(), "hh:mma");
}
function getDate() {
  return format(new Date(), "MM.dd.yy");
}

init();
