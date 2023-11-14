import 'dotenv/config'
import {openai} from './openai.js'
//readline module for handling user input/output
import readline from 'node:readline' ;
import colors from 'colors' ;


const rl =readline.createInterface({
    input:process.stdin ,
    output:process.stdout ,
}) ;
const newMessage = async (history, message) => {
  try {
    // Make a request to the OpenAI API to get a chat completion
    const chatCompletion = await openai.chat.completions.create({
      messages: [...history, message],
      model: 'gpt-3.5-turbo',
    });

    // Return the AI's response
    return chatCompletion.choices[0].message;
  } catch (error) {
    // Handle errors and log them to the console
    console.error('Error in newMessage:', error.message);
    throw error;
  }
};

// Function to format user messages
const formatUserMessage = userInput => ({ role: 'user', content: userInput });

const handleUserInput = async userInput => {
  if (userInput.toLowerCase() === 'exit') {
    rl.close();
    return;
  }
    const userMessage = formatUserMessage(userInput);

  // Send the user's message to the OpenAI API and get the AI's response
  const response = await newMessage(history, userMessage);

  // Update the chat history with the user's input and the AI's response
  history.push(userMessage, response);

  console.log( `\n\n` +colors.bold.magenta ("AI : ") +`${response.content}\n\n`);

  // Prompt the user for the next input
  start();
};

const start = () => {
  rl.question('You: ', handleUserInput);
};

// Initial chat history with a system message
const history = [
  {
    role: 'system',
    content: `You are an AI assistant.`,
  },
];

// Function to initialize the chat
const chat = () => {
  // Start the chat
  start();

  // Display the initial message from the AI
  console.log(colors.bold.magenta('\n\nAI') +`:  How can I help you?\n\n`);
};

// Log a message indicating that the chatbot has been initialized
console.log("Chatbot initialized. Type 'exit' to end the chat.");

// Start the chat
chat();