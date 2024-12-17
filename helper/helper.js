export const generateCredentials = () => {
  // Helper function to generate a 5-character random string
  const generateRandomString = () => Math.random().toString(36).substring(2, 7); // 5-character string
  
  // Generate unique username based on the current timestamp and random string
  const timestamp = Date.now().toString(36); // Timestamp as a base-36 string
  const simpleUsername = `user_${timestamp}_${generateRandomString()}`;  // e.g., user_15k0b8_4r23d

  // Generate simple password (5 characters long)
  const simplePassword = generateRandomString();  // e.g., 3d1d7

  return {
    username: simpleUsername,
    password: simplePassword,
  };
};
