import { BaseObject } from "../world/baseObject";

const locationS = 'location'

export function isLocation(a: any): a is BaseLocation {
  return a.objectName == locationS;
}

export abstract class BaseLocation extends BaseObject {
  abstract locationType: string

  size = 16;

  public update(dt: number) {
    /** */
  }

  public objectName: string = locationS

  public abstract use(): void
}

