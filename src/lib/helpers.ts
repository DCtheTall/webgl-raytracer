export function isImagePowerOfTwo(image: HTMLImageElement): boolean {
  return !((image.width & (image.width - 1)) || (image.height & (image.height - 1)));
}
