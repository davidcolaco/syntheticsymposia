<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
  
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="registerUsername" type="text" placeholder="Username" required />
        <input v-model="registerPassword" type="password" placeholder="Password" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <button type="submit">Register</button>
      </form>
      <p v-if="registerError" class="error">{{ registerError }}</p>
      <p v-if="registerSuccess" class="success">{{ registerSuccess }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();
  
  const login = async () => {
    error.value = '';
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.value, password: password.value }),
      });
      const result = await res.json();
  
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);
        router.push('/ss');
      } else {
        error.value = 'Invalid username or password';
      }
    } catch (err) {
      console.error('Error logging in:', err);
      error.value = 'An error occurred';
    }
  };
  
  // Registration related code
  const registerUsername = ref('');
  const registerPassword = ref('');
  const email = ref('');
  const registerError = ref('');
  const registerSuccess = ref('');
  
  const register = async () => {
    registerError.value = '';
    registerSuccess.value = '';
  
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: registerUsername.value, password: registerPassword.value, email: email.value }),
      });
      const result = await res.json();
  
      if (result.success) {
        registerSuccess.value = 'Registration successful! You can now log in.';
        registerUsername.value = '';
        registerPassword.value = '';
        email.value = '';
      } else {
        registerError.value = result.error;
      }
    } catch (err) {
      console.error('Error registering:', err);
      registerError.value = 'An error occurred';
    }
  };
  </script>
  
  <style scoped>
  h1, h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
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
  
  p.error {
    color: red;
  }
  
  p.success {
    color: green;
  }
  </style>
  