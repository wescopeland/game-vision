import Jimp = require("jimp");
import { platform } from "os";

export class ScreenParser {
  constructor(public buffer?: Buffer) {}

  async compareBlockToTiles(
    blockBuffer: Buffer,
    tileImages: Array<{ id: string; image: Jimp }>
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let block = await Jimp.read(blockBuffer);
      let distances: Array<{ id: string; distance: number }> = [];

      tileImages.forEach(tileImage => {
        distances.push({
          id: tileImage.id,
          distance: Jimp.distance(block, tileImage.image)
        });
      });

      // Get the smallest value.
      let smallest = distances.reduce(
        (min, p) => (p.distance < min ? p.distance : min),
        distances[0].distance
      );

      let closest = distances.filter(d => {
        return d.distance === smallest;
      });

      resolve(closest);
    });
  }
}
