const Jimp = require('jimp');

async function removeBg(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // Check pixel at 0,0 to determine background color
    const hex = image.getPixelColor(0, 0);
    const rgba = Jimp.intToRGBA(hex);
    
    let bgType = 'unknown';
    if (rgba.r > 230 && rgba.g > 230 && rgba.b > 230) bgType = 'white';
    if (rgba.r < 25 && rgba.g < 25 && rgba.b < 25) bgType = 'black';
    
    // Convert black/white pixels to transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      if (bgType === 'white') {
        if (red > 230 && green > 230 && blue > 230) {
          this.bitmap.data[idx + 3] = 0; // set alpha to 0
        }
      } else if (bgType === 'black') {
        if (red < 25 && green < 25 && blue < 25) {
          this.bitmap.data[idx + 3] = 0; // set alpha to 0
        }
      }
    });
    
    await image.writeAsync(outputPath);
    console.log(`Successfully processed ${inputPath} to ${outputPath} (Detected BG: ${bgType})`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node remove_bg.js <input> <output>");
  process.exit(1);
}

removeBg(args[0], args[1]);
