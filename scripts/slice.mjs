// Dev helper: cut a tall screenshot into viewport-sized slices for review.
import sharp from 'sharp';
const [file, h = '1000'] = process.argv.slice(2);
const img = sharp(file);
const { width, height } = await img.metadata();
const H = Number(h);
for (let i = 0, y = 0; y < height; i++, y += H) {
  await sharp(file).extract({ left: 0, top: y, width, height: Math.min(H, height - y) }).toFile(file.replace('.png', `.s${i}.png`));
}
