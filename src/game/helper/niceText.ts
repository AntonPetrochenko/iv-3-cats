import { Text } from "pixi.js";
import { FONT_FAMILY } from "../constants";

export function niceText(text: string, x: number, y: number, size = 8) {
  return new Text({
      text: text,
      style: {
        fill: '#ffffff',
        fontSize: size,
        fontFamily: FONT_FAMILY
      },
      x, y
    })
}