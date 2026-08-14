import { getJitsiLinkDiv } from "../utils/DOMHelper";
import { Config } from "../models/Config";

/* global document, HTMLInputElement, console, window */

const testConfigOnFooter = (): string => {
  let output: string = "";
  const configString = (document.getElementById("input") as HTMLInputElement).value;
  const config: Config = JSON.parse(configString);
  config.currentLanguage = (document.getElementById("lang") as HTMLInputElement).value;
  const indexA = (document.getElementById("index") as HTMLInputElement).value;
  let index = undefined;
  if (indexA != "" && /^\d+$/.test(indexA)) index = +indexA;
  output = getJitsiLinkDiv("temp.link", config, index);
  return output;
};

const writeToHTML = () => {
  const footer: string = testConfigOnFooter();
  console.log(footer);
  document.getElementById("output")!.innerHTML = footer;
};

declare global {
  interface Window {
    writeToHTML: () => void;
  }
}
window.writeToHTML = writeToHTML;
