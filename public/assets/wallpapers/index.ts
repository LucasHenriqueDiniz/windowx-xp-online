// List of all xp wallpapers
export { default as Ascend } from "./Ascent.webp";
export { default as Autumn } from "./Autumn.jpg";
export { default as Azul } from "./Azul.jpg";
export { default as Bliss } from "./Bliss.jpg";
export { default as Crystal } from "./Crystal.webp";
export { default as Follow } from "./Follow.webp";
export { default as Friend } from "./Friend.jpg";
export { default as Home } from "./Home.jpg";
export { default as MoonFlower } from "./Moon_flower.webp";
export { default as Peace } from "./Peace.webp";
export { default as Power } from "./Power.webp";
export { default as PurpleFlower } from "./Purple_flower.webp";
export { default as Radiance } from "./Radiance.jpg";
export { default as RedMoonDesert } from "./Red_moon_desert.webp";
export { default as Ripple } from "./Ripple.webp";
export { default as Stonehenge } from "./Stonehenge.webp";
export { default as Tulips } from "./Tulips.webp";
export { default as VortecSpace } from "./Vortec_space.jpg";
export { default as Wind } from "./Wind.webp";
export { default as DefaultWallpaper } from "./Windows_XP_Professional.webp";

// Import icons
import { None, JPEGFile, BitmapImage, TIFFFile } from "../icons";

const WALLPAPER_BASE_PATH = "/assets/wallpapers";

export const AVAILABLE_WALLPAPERS = [
  { name: "(None)", path: null, icon: None.src },
  { name: "Ascend", path: `${WALLPAPER_BASE_PATH}/Ascent.webp`, icon: TIFFFile.src },
  { name: "Autumn", path: `${WALLPAPER_BASE_PATH}/Autumn.jpg`, icon: BitmapImage.src },
  { name: "Azul", path: `${WALLPAPER_BASE_PATH}/Azul.jpg`, icon: BitmapImage.src },
  { name: "Bliss", path: `${WALLPAPER_BASE_PATH}/Bliss.jpg`, icon: BitmapImage.src },
  { name: "Crystal", path: `${WALLPAPER_BASE_PATH}/Crystal.webp`, icon: BitmapImage.src },
  { name: "Follow", path: `${WALLPAPER_BASE_PATH}/Follow.webp`, icon: BitmapImage.src },
  { name: "Friend", path: `${WALLPAPER_BASE_PATH}/Friend.jpg`, icon: JPEGFile.src },
  { name: "Home", path: `${WALLPAPER_BASE_PATH}/Home.jpg`, icon: JPEGFile.src },
  { name: "Moon Flower", path: `${WALLPAPER_BASE_PATH}/Moon_flower.webp`, icon: JPEGFile.src },
  { name: "Peace", path: `${WALLPAPER_BASE_PATH}/Peace.webp`, icon: JPEGFile.src },
  { name: "Power", path: `${WALLPAPER_BASE_PATH}/Power.webp`, icon: JPEGFile.src },
  { name: "Purple Flower", path: `${WALLPAPER_BASE_PATH}/Purple_flower.webp`, icon: JPEGFile.src },
  { name: "Radiance", path: `${WALLPAPER_BASE_PATH}/Radiance.jpg`, icon: JPEGFile.src },
  { name: "Red Moon Desert", path: `${WALLPAPER_BASE_PATH}/Red_moon_desert.webp`, icon: JPEGFile.src },
  { name: "Ripple", path: `${WALLPAPER_BASE_PATH}/Ripple.webp`, icon: JPEGFile.src },
  { name: "Stonehenge", path: `${WALLPAPER_BASE_PATH}/Stonehenge.webp`, icon: JPEGFile.src },
  { name: "Tulips", path: `${WALLPAPER_BASE_PATH}/Tulips.webp`, icon: JPEGFile.src },
  { name: "Vortec Space", path: `${WALLPAPER_BASE_PATH}/Vortec_space.jpg`, icon: JPEGFile.src },
  { name: "Wind", path: `${WALLPAPER_BASE_PATH}/Wind.webp`, icon: JPEGFile.src },
  { name: "Windows XP", path: `${WALLPAPER_BASE_PATH}/Windows_XP_Professional.webp`, icon: JPEGFile.src },
];
