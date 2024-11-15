
function clearChat() {
    if (pageURL.includes('admin.html')) {
      var adminChatbox = document.getElementById('chatbox');
      adminChatbox.innerHTML = '';
      sessionStorage.removeItem('chatMessages'); // Remove chat messages from sessionStorage
    localStorage.removeItem('chatMessages');// Remove admin chat messages from sessionStorage
    } else {
      var customerChatbox = document.getElementById('chatbox');
      customerChatbox.innerHTML = '';
      sessionStorage.removeItem('chatMessages'); // Remove chat messages from sessionStorage
      localStorage.removeItem('chatMessages');// Remove customer chat messages from sessionStorage
    }
  }
  
  // Get the clear button element
  const clearButton = document.getElementById('clearButton');
  
  // Attach an event listener to the clear button
  clearButton.addEventListener('click', clearChat);
  
  // Get the current page URL
  const pageURL = window.location.href;
  
  // Determine the WebSocket URL based on the page URL
  let socketURL;
  if (pageURL.includes('admin.html')) {
    socketURL = 'ws://192.168.11.72:9201/admin';
  } else {
    socketURL = 'ws://192.168.11.72:9201/customer';
  }
  
  // WebSocket connection
  const socket = new WebSocket(socketURL);
  
  // Track displayed messages
  let displayedMessages = [];
  
  function displayMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
  
    // Check for duplicate messages
    const isDuplicate = displayedMessages.some(
      (msg) => msg.sender === sender && msg.message === message
    );
  
    if (!isDuplicate) {
      let formattedMessage = message;
      if (sender === 'Admin') {
        formattedMessage = `<strong>Admin:</strong> ${message}`;
      } else {
        formattedMessage = `<strong>${sender}:</strong> ${message}`;
      } 
  
      const newMessage = document.createElement('p');
      newMessage.innerHTML = formattedMessage;
      chatbox.appendChild(newMessage);
      chatbox.scrollTop = chatbox.scrollHeight;
  
      // Add the message to the displayed messages
      displayedMessages.push({ sender, message });
    }
  }
  

  // Event listener for receiving messages
  socket.addEventListener('message', function (event) {
    const data = event.data;
  
    // Split the message into sender and message content
    const [sender, message] = data.split(':');
  
    // Display the received message in the chatbox
    displayMessage(sender, message);
  });

  function sendMessage() {
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value.trim();
  
    if (message !== "") {
      var chatbox = document.getElementById("chatbox");
      var newMessage = document.createElement("p");
  
      // Get the sender name based on the page URL
      var sender = pageURL.includes("admin.html") ? "Admin" : "Customer";
  
      if (sender === "Customer") {
        var customerName = localStorage.getItem("customerName");
        newMessage.innerHTML = `<strong>${customerName}:</strong> ${message}`;
      } else {
        newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
      }
  
      chatbox.appendChild(newMessage);
  
      messageInput.value = "";
  
      // Save the message to localStorage
      var messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      messages.push({ sender: sender, message: message });
      localStorage.setItem("chatMessages", JSON.stringify(messages));
  
      // Send the message to the server
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  }
  
  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach((msg) => {
      displayMessage(msg.sender, msg.message);
      displayedMessages.push({ sender: msg.sender, message: msg.message });
    });
  }
  
  // Load messages from sessionStorage when the page loads
  loadMessages();
  

  
  $(document).ready(function () {
    var tmo = null;
    $('#message').on('input', function () {
      document.getElementById('typing').innerHTML = 'Typing...';
  
      if (tmo) {
        clearTimeout(tmo);
      }
      tmo = setTimeout(function () {
        document.getElementById('typing').innerHTML = '';
      }, 1000);
    });
  });
  