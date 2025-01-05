import { Assets, NineSliceSprite } from "pixi.js";

export function box9Patch(x: number,y: number,w: number,h: number) {
  return new NineSliceSprite({
        texture: Assets.get('9slice'),
        leftWidth: 16,
        rightWidth: 16,
        topHeight: 16,
        bottomHeight: 16,
        width: w, 
        height: h,
        x: x,
        y: y,
      })
}