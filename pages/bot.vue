<template>
    <div>
      <h1>Ask ChatGPT</h1>
      <form @submit.prevent>
        <input v-model="question" type="text" placeholder="Enter your question" required />
        <button type="button" @click="askQuestion" :disabled="isSubmitting">
          Ask
        </button>
      </form>
      <p v-if="response">{{ response }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const question = ref('');
  const response = ref('');
  const isSubmitting = ref(false);
  
  const askQuestion = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
  
    try {
      const res = await fetch('/api/ask-chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.value }),
      });
      const result = await res.json();
      response.value = result.answer;
    } catch (error) {
      console.error('Error asking question:', error);
      response.value = 'Failed to get an answer.';
    } finally {
      isSubmitting.value = false;
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
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  p {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  