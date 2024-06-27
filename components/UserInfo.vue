<template>
    <div class="user-info-container">
      <div @click="toggleDropdown" class="user-info-button">
        <span class="user-icon">&#x1F464;</span>
        <span class="username">{{ username }}</span>
        <span class="dropdown-icon">&#x25BC;</span>
      </div>
      <div v-if="showDropdown" class="user-info-dropdown">
        <div class="user-info-details">
          <p><strong>Username:</strong> {{ username }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
        </div>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const email = ref('');
  const showDropdown = ref(false);
  const router = useRouter();
  
  onMounted(async () => {
    if (typeof window !== 'undefined') {
      username.value = localStorage.getItem('username');
      console.log('Username:', username.value);
  
      if (username.value) {
        try {
          const res = await fetch(`/api/get-user-info?username=${username.value}`);
          const result = await res.json();
          if (result.success) {
            email.value = result.email;
            localStorage.setItem('email', result.email); // Optionally store the email in localStorage
            console.log('Email:', email.value);
          } else {
            console.error('Error fetching email:', result.error);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
  
      console.log('UserInfo component mounted');
    }
  });
  
  const toggleDropdown = () => {
    console.log('Toggle Dropdown');
    showDropdown.value = !showDropdown.value;
  };
  
  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .user-info-container {
    position: fixed;
    top: 10px;
    right: 10px;
    display: inline-block;
    z-index: 1000;
  }
  
  .user-info-button {
    display: flex;
    align-items: center;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .user-info-button:hover {
    background-color: #0056b3;
  }
  
  .user-icon {
    margin-right: 10px;
    font-size: 20px;
  }
  
  .username {
    margin-right: 10px;
  }
  
  .dropdown-icon {
    font-size: 14px;
  }
  
  .user-info-dropdown {
    position: absolute;
    top: 40px; /* Adjust this value if needed */
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
    width: 200px;
  }
  
  .user-info-details {
    margin-bottom: 10px;
  }
  
  .logout-button {
    background-color: #ff4d4d;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    text-align: center;
    transition: background-color 0.3s;
  }
  
  .logout-button:hover {
    background-color: #cc0000;
  }
  </style>
  