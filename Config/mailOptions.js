const createMailOptions = (to, username, password) => ({
  from: "prathameshk990@gmail.com", // Sender's email address
  to: to, // Recipient's email address
  subject: "Welcome to Fish Catch Repository - Your Login Details",
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #097BED; text-align: center;">Welcome to Fish Catch Repository</h2>
      <p style="text-align: center;">Thank you for signing up! We're excited to have you on board.</p>
      <div style="border: 1px solid #097BED; border-radius: 8px; padding: 15px; background-color: #ffffff; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Your login credentials:</p>
        <p>
          <strong>Username:</strong> 
          <span id="username" style="color: #097BED;">${username}</span>
          <button 
            style="background-color: #097BED; color: white; border: none; border-radius: 4px; padding: 5px 10px; margin-left: 10px; cursor: pointer;" 
            onclick="copyToClipboard('username')">Copy</button>
        </p>
        <p>
          <strong>Password:</strong> 
          <span id="password" style="color: #097BED;">${password}</span>
          <button 
            style="background-color: #097BED; color: white; border: none; border-radius: 4px; padding: 5px 10px; margin-left: 10px; cursor: pointer;" 
            onclick="copyToClipboard('password')">Copy</button>
        </p>
      </div>
      <p style="text-align: center;">Please keep this information safe and do not share it with anyone.</p>
      <p style="text-align: center;">If you have any questions, feel free to contact our support team.</p>
      <footer style="text-align: center; margin-top: 20px; color: #888;">
        <p>Fish Catch Repository © 2024</p>
        <p>All Rights Reserved</p>
      </footer>
    </div>

    <script>
      // Function to copy content to clipboard
      function copyToClipboard(elementId) {
        const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text).then(() => {
          alert('Copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      }
    </script>
  `,
});

export default createMailOptions;
