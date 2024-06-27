<template>
    <div>
      <h1>Send Message to Google Sheets</h1>
      <form @submit.prevent="sendMessage">
        <input v-model="message" type="text" placeholder="Enter your message" required />
        <button type="submit">Send</button>
      </form>
      <p v-if="status">{{ status }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const message = ref('');
  const status = ref('');
  
  const sendMessage = async () => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.value }),
      });
      const result = await response.json();
      status.value = result.status;
    } catch (error) {
      console.error('Error sending message:', error);
      status.value = 'Failed to send message.';
    }
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  input {
    padding: 10px;
    margin-bottom: 10px;
    width: 300px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
  }
  
  p {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  