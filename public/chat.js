// Initialize Gun.js and set up a peer-to-peer connection
const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']); // You can add more peers or use your own Gun server

// Select DOM elements
const loginSection = document.getElementById('login');
const chatSection = document.getElementById('input');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-button');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const usernameDisplay = document.getElementById('username-display');

let username = '';  // To store the user's name
const displayedMessages = new Set(); // To track displayed messages

// Handle user login
loginButton.addEventListener('click', () => {
  username = usernameInput.value.trim();

  if (username !== '') {
    usernameDisplay.textContent = `Username: ${username}`; // Display username in navbar
    loginSection.style.display = 'none'; // Hide login section
    chatSection.style.display = 'flex';  // Show chat section
    loadMessages();  // Load existing chat messages
  }
});

// Send a message
sendButton.addEventListener('click', () => {
  const messageText = messageInput.value.trim();

  if (messageText !== '') {
    // Store the message in Gun database with a timestamp
    gun.get('chat-messages').set({
      username: username,
      message: messageText,
      timestamp: Date.now() // Use this timestamp for tracking
    });

    messageInput.value = '';  // Clear the message input
  }
});

// Load messages from Gun database
function loadMessages() {
  gun.get('chat-messages').map().on((message) => {
    // Check if the message exists and hasn't been displayed yet
    if (message && !displayedMessages.has(message.timestamp)) {
      displayMessage(message);
      displayedMessages.add(message.timestamp); // Mark this message as displayed
    }
  });
}

// Display message in chat box
function displayMessage({ username: sender, message, timestamp }) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // Check if the message was sent by the current user
  if (sender === username) {
    messageDiv.classList.add('sent'); // Sent messages
    messageDiv.textContent = `${message}`; // Only display message without username
  } else {
    messageDiv.classList.add('received'); // Received messages
    messageDiv.textContent = `${sender}: ${message}`; // Display sender and message
  }

  messagesDiv.appendChild(messageDiv);

  // Scroll to the bottom of the messages div
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Press Enter to send message
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});
