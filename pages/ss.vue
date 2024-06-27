<template>
    <div class="container">
      <UserInfo />
      <header>
        <h1>Synthetic Symposium</h1>
      </header>
      <main>
        <div v-if="experts.length && !symposiumCreated" class="expert-selection">
          <h2>Select Up to 3 Experts</h2>
          <div class="expert-grid">
            <div v-for="expert in experts" :key="expert.name" class="expert-card">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedExperts"
                  :value="expert.name"
                  :disabled="selectedExperts.length >= 3 && !selectedExperts.includes(expert.name)"
                />
                <img :src="expert.imageUrl" alt="Expert Image" class="expert-image" />
                <div class="expert-info">
                  <h3>{{ expert.name }}</h3>
                  <p>{{ expert.description }}</p>
                </div>
              </label>
            </div>
          </div>
          <button @click="createSymposium" :disabled="selectedExperts.length === 0">Create Symposium</button>
        </div>
        <div v-if="symposiumCreated" class="chat-section">
          <h2>Ask a Question</h2>
          <p>Talking to: {{ selectedExperts.join(', ') }}</p>
          <textarea v-model="question" placeholder="Ask your question here"></textarea>
          <button @click="askQuestion">Ask</button>
        </div>
        <div v-if="chatLog.length" class="chat-log">
          <h2>Chat Log</h2>
          <div v-for="(log, index) in chatLog" :key="index" class="chat-log-entry">
            <p><strong>You:</strong> {{ log.question }}</p>
            <p><strong>Symposium:</strong> {{ log.answer }}</p>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import UserInfo from '~/components/UserInfo.vue';

  definePageMeta({
  middleware: 'auth',
});
  
  const experts = ref([]);
  const selectedExperts = ref([]);
  const symposiumCreated = ref(false);
  const question = ref('');
  const response = ref('');
  const chatLog = ref([]);
  const username = ref('');
  
  onMounted(async () => {
    if (typeof window !== 'undefined') {
      username.value = localStorage.getItem('username');
    }
  
    try {
      const res = await fetch('/api/get-experts');
      const result = await res.json();
      if (result.success) {
        experts.value = result.experts;
      } else {
        console.error('Error fetching experts:', result.error);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  });
  
  const createSymposium = () => {
    if (selectedExperts.value.length > 0) {
      symposiumCreated.value = true;
    } else {
      alert('Please select at least one expert.');
    }
  };
  
  const askQuestion = async () => {
    if (!selectedExperts.value.length || !question.value) {
      alert('Please enter a question.');
      return;
    }
  
    const starterPrompt = `You are a synthetic symposium consisting of the following experts: ${selectedExperts.value.join(', ')}. Answer the following question as if the experts are discussing it:`;
  
    try {
      const res = await fetch('/api/ask-chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ starterPrompt, question: question.value, username: username.value }),
      });
      const result = await res.json();
      if (result.success) {
        response.value = result.answer;
        chatLog.value.push({ question: question.value, answer: result.answer });
      } else {
        console.error('Error getting response from ChatGPT:', result.error);
      }
    } catch (error) {
      console.error('Error asking ChatGPT:', error);
    }
  
    question.value = ''; // Clear the question field
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  h1 {
    font-size: 2.5rem;
    color: #333;
  }
  
  .expert-selection, .chat-section, .chat-log {
    margin-bottom: 40px;
  }
  
  h2 {
    font-size: 2rem;
    color: #555;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .expert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .expert-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .expert-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .expert-card label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  
  .expert-card input[type='checkbox'] {
    margin-bottom: 10px;
  }
  
  .expert-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .expert-info {
    text-align: center;
  }
  
  .expert-info h3 {
    margin: 10px 0 5px;
    font-size: 1.2rem;
    color: #333;
  }
  
  .expert-info p {
    font-size: 0.9rem;
    color: #666;
  }
  
  button {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:disabled {
    background: #bbb;
    cursor: not-allowed;
  }
  
  button:not(:disabled):hover {
    background: #0056b3;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
    margin-bottom: 20px;
  }
  
  .chat-log-entry {
    background: #f9f9f9;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .chat-log-entry p {
    margin: 0;
    padding: 5px 0;
  }
  
  .chat-log-entry p strong {
    color: #333;
  }
  </style>
  