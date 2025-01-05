import { Assets } from "pixi.js";

export const lateConsts = {
  FONT_FAMILY: ''
};


export async function loadLateConsts() {
  lateConsts.FONT_FAMILY = (await Assets.load({
    alias: "font",
    src: "assets/font/nes-cyrillic.ttf",
  },)).family
}