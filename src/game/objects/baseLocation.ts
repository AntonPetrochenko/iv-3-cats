import { BaseObject } from "../world/baseObject";

const locationS = 'location'

export function isLocation(a: any): a is BaseLocation {
  console.log(a.objectName, locationS)
  return a.objectName == locationS;
}

export abstract class BaseLocation extends BaseObject {
  abstract locationType: string

  public update() {
    /** */
  }

  public objectName: string = locationS

  public abstract use(): void
}

