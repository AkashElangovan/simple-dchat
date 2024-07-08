// Initialize Gun
const gun = Gun(['http://localhost:3000/gun']);

// Elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const loginDiv = document.getElementById('login');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-button');

// Variables
let username = null;

// Event Listeners
loginButton.addEventListener('click', handleLogin);
sendButton.addEventListener('click', sendMessage);

// Handle login
function handleLogin() {
  username = usernameInput.value.trim();
  if (username) {
    loginDiv.style.display = 'none';
    messagesDiv.style.display = 'block';
    document.getElementById('input').style.display = 'flex';
    initializeMessages();
  }
}

// Initialize messages display
function initializeMessages() {
  // Clear existing messages
  messagesDiv.innerHTML = '';

  // Get a reference to the messages node
  const messages = gun.get('messages');

  // Display messages from Gun
  messages.map().once((data, id) => {
    if (data && data.username && data.message) {
      displayMessage(data);
    } else {
      console.error('Invalid data:', data);
    }
  });
}

// Display a message
function displayMessage(data) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.username}: ${data.message}`;
  messageElement.style.backgroundColor = data.username === username ? '#d4edda' : '#f8d7da';
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

// Send a new message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message && username) {
    const messages = gun.get('messages');
    messages.set({ username, message });
    messageInput.value = '';
  } else {
    console.error('Message or username is missing');
  }
}
