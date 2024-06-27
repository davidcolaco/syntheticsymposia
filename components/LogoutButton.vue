<template>
    <button @click="logout" class="logout-button">
      Logout
    </button>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .logout-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px 20px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .logout-button:hover {
    background-color: #ff1a1a;
  }
  </style>
  