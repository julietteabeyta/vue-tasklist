import Vue from 'vue';
import app from './app.vue'

new Vue({ render: createElement => createElement(app) }).$mount('#app');