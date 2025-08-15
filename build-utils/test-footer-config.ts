import { getJitsiLinkDiv } from "../src/utils/DOMHelper";
import { Config } from "../src/models/Config"
import { readFileSync, writeFileSync } from 'fs';

const args = process.argv.slice(2);
const configArg = args.find((arg) => arg.startsWith("config="));
const configPath = configArg ? configArg.split("=")[1] : __dirname + "/../__tests__/controll.test.json";
const indexArg = args.find((arg) => arg.startsWith("index="));
const indexA = indexArg ? indexArg.split("=")[1] : undefined;
const languageArg = args.find((arg) => arg.startsWith("lang="));
const language = languageArg ? languageArg.split("=")[1] : undefined;

const testConfigOnFooter = (): string => {
  let output: string = "";
  const configString = readFileSync(configPath, "utf-8");
  let config: Config = JSON.parse(configString);
  config.currentLanguage = language;
  let index: number = undefined
  if (indexA) {
    index = +indexA;
  }
  output = getJitsiLinkDiv("temp.link", config, index);
  return output;
};

const writeToHTML = () => {
  let footer: string = testConfigOnFooter();
  console.log(footer);
  writeFileSync(__dirname + "/footer.html", footer, "utf-8");
}

writeToHTML();
