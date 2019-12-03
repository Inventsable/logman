#!/usr/bin/env node
let message = process.argv;
const fs = require("fs");
const path = require("path");
const format = require("date-fns/format");
const chalk = require("chalk");
const inquirer = require("inquirer");

async function init() {
  const now = getTime();
  const today = getDate();
  const check = await ensureHasLogger();
  let printResults = false,
    printData;
  let res = await checkHasToday(today);
  res = res
    ? fs.readFileSync(`./.logger/${today}.md`, { encoding: "utf-8" })
    : ``;
  res = sanitizeRes(res);
  let answer = {};
  if (message.length > 2) {
    printResults = true;
    answer["change"] = message.splice(2, message.length).join(" ");
    printData = `${chalk.black.bgBlue(` ✓ ${now} `)} ${sanitizeString(
      answer.change
    )}`;
  } else {
    answer = await inquirer.prompt([
      {
        type: "input",
        name: "change",
        message: `${today} > [${now}]:`
      }
    ]);
  }
  let text = ` **[${now}]** ${sanitizeString(answer.change)}\r\n`;
  res.unshift(text);
  let file = `### ${today}

${res
  .map(item => {
    return `-${item}`;
  })
  .join("")}`;
  fs.writeFileSync(`./.logger/${today}.md`, file);
  writeAll();
  if (printResults) {
    console.log("");
    console.log(printData);
    console.log("");
  }
}

function sanitizeString(str) {
  return /^[a-z]/.test(str) ? str.charAt(0).toUpperCase() + str.slice(1) : str;
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
  return format(new Date(), "hh:mm a");
}
function getDate() {
  return format(new Date(), "MM.dd.yy");
}

init();
