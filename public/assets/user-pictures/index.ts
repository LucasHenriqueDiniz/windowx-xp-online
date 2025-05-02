// Index file for user profile pictures
// This provides a collection of default Windows XP-style user profile images

// Define the path for user pictures
const basePath = "/assets/user-pictures";

// Default user pictures
export const defaultPictures = [
  { id: "default1", path: `${basePath}/user1.png`, name: "User 1" },
  { id: "default2", path: `${basePath}/user2.png`, name: "User 2" },
  { id: "default3", path: `${basePath}/user3.png`, name: "User 3" },
  { id: "default4", path: `${basePath}/user4.png`, name: "User 4" },
  { id: "default5", path: `${basePath}/user5.png`, name: "User 5" },
  { id: "default6", path: `${basePath}/user6.png`, name: "User 6" },
  { id: "default7", path: `${basePath}/user7.png`, name: "User 7" },
  { id: "default8", path: `${basePath}/user8.png`, name: "User 8" },
];

// Function to get a random default user picture
export const getRandomUserPicture = () => {
  const randomIndex = Math.floor(Math.random() * defaultPictures.length);
  return defaultPictures[randomIndex];
};

// Function to get a user picture by ID
export const getUserPictureById = (id: string) => {
  return defaultPictures.find((picture) => picture.id === id) || defaultPictures[0];
};

// Default user picture for when none is selected
export const defaultUserPicture = defaultPictures[0];

// Export individual pictures for direct imports
export const user1 = defaultPictures[0];
export const user2 = defaultPictures[1];
export const user3 = defaultPictures[2];
export const user4 = defaultPictures[3];
export const user5 = defaultPictures[4];
export const user6 = defaultPictures[5];
export const user7 = defaultPictures[6];
export const user8 = defaultPictures[7];
