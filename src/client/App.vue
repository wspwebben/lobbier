<template>
  <div>
    <button @click="create">Create</button>
    <button @click="join">Join room</button>
    <input v-model="code" >
  </div>
</template>

<script>
import { create, join } from './api';

export default {
  name: 'App',
  data() {
    return { 
      code: '',
    }
  },
  methods: {
    create() {
      create();
    },
    join() {
      join(this.code);
    }
  },
};
</script>