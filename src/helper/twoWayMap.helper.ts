export class TwoWayMap {
  private readonly map: Map<string, string>;
  private readonly reverseMap: Map<string, string>;

  constructor(map) {
    this.map = map;
    this.reverseMap = new Map<string, string>();

    for (const key in map) {
      const value = map[key];
      this.reverseMap[value] = key;
    }
  }

  public get(key: string) {
    return this.map[key];
  }

  public getReverse(key: string) {
    return this.reverseMap[key];
  }
}
