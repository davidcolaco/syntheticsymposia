<template>
    <div class="header">
      <span v-if="username">Logged in as: {{ username }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const username = ref(localStorage.getItem('username'));
  </script>
  
  <style scoped>
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #f8f8f8;
    padding: 10px;
    text-align: right;
    border-bottom: 1px solid #ddd;
  }
  </style>
  