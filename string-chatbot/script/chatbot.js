let conversationHistory = [
  {
    role: "system",
    parts: [{
      text: `You are a professional AI assistant for String Metaverse. 
You are ONLY allowed to answer questions about:

- The company String Metaverse
- Its services and technologies
- Its leadership team
- Its mission, address, and contact details

If the user asks anything unrelated to the company (such as definitions of finance, science, etc.), politely respond with:
"I'm here to help you with information about String Metaverse. Please ask something related to the company."

Company Overview:
String Metaverse is revolutionizing the virtual world by creating innovative gaming platforms for global audiences. 
It invests in Web 3.0 community tech platforms and protocols, and offers liquidity and market-making services for community-driven digital assets.

Leadership Team:
- Ghanshyam Dass – Chairman
- Krishna Mohan Meenavalli – Founder
- Sai Santosh Althuru – Co-Founder & CEO
- Arvind Jadhav – Independent Director

Address:
Plot No.114, 2nd Floor, TVS Avenue, Survey No.66/2,
Raidurgam, Prashant Hills, Gachibowli, Nav Khalsa,
Serilingampally, Ranga Reddy, Hyderabad – 500008,
Telangana, India

Email: info@stringmetaverse.com`
    }]
  }
];

const apiKey = "AIzaSyAACLa2L6qX-oK4Z9xjF4qYQhypVhKJGOY"; // Replace with secure method for production
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

let isChatOpen = false;

function toggleChatbot() {
  const popup = document.getElementById("chatbot-popup");
  isChatOpen = !isChatOpen;
  popup.classList.toggle("hidden");
}

function closeChatbot() {
  const popup = document.getElementById("chatbot-popup");
  popup.classList.add("hidden");
  isChatOpen = false;
}
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  conversationHistory.push({ role: "user", parts: [{ text: userInput }] });
  displayMessage(userInput, "user-message");
  document.getElementById("user-input").value = "";
  fetchGeminiResponse();
}

function displayMessage(message, className) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = className;
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchGeminiResponse() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: conversationHistory.map(msg => msg.parts[0].text).join("\n") }]
        }]
      })
    });

    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const data = await response.json();

    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    conversationHistory.push({ role: "assistant", parts: [{ text: botMessage }] });
    displayMessage(botMessage, "bot-message");
  } catch (error) {
    console.error("Error fetching response:", error);
    displayMessage("Error fetching response. Please check API key or network.", "bot-message");
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") sendMessage();
}
// Close chatbot when clicking outside
document.addEventListener("click", function (event) {
  const popup = document.getElementById("chatbot-popup");
  const toggleBtn = document.getElementById("chatbot-button");

  if (
    isChatOpen &&
    !popup.contains(event.target) &&
    !toggleBtn.contains(event.target)
  ) {
    closeChatbot();
  }
});