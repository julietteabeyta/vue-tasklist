<template>
  <div class="wrapper">
    <div class="task-container">
      <h1>To Do</h1>
      <div class="task-add-input-container">
        <div contenteditable="true" type="text" class="form-control task-add-input" ref="newTaskInput" data-placeholder="Add task" v-on:blur="addTask" @keydown.enter="(e) => { e.preventDefault(); addTask(e); }"></div>
      </div>
      <li class="task-total">Total tasks: {{ incompleteTasks.length }}</li>
      <ul class="list-incomplete">
        <li class="list-group-item incomplete" v-for="(task,index) in incompleteTasks" :ref="'taskListItem'+index" v-bind:key="task.id">
          <div class="check-container">
            <input type="checkbox" :id="'incompleted-task-id-' + index " v-on:click="() => markCompleted(task)">
            <svg height="20" width="20" viewBox="0 0 100 100">
              <use href="/checkcircle.svg#icon"/>
            </svg>
          </div>
          <div contenteditable="true" type="text" class="form-control" v-on:blur="(e) => editTask(e, task)" @keydown.enter="(e) => { e.preventDefault(); e.target.blur(); }">{{ task.description }}</div>
        </li>
      </ul>
    </div>
    <div class="task-container">
      <h1>Completed</h1>
      <ul class="list-completed">
        <li class="list-group-item" v-for="(task,index) in completeTasks" :ref="'taskListItem'+index" v-bind:key="task.id">
          {{task.description}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Toasted from 'vue-toasted';
  import _ from 'lodash';
  import { v4 as uuidv4 } from 'uuid';

  export default Vue.extend({
    data() {
      return {
        tasks: [],
        title: 'Tasks',
      };
    },
    mounted() {
      Vue.use(Toasted);
      if (localStorage.tasks) {
        this.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      }
    },
    computed: {
      incompleteTasks() {
        return this.tasks.filter(task => !task.completed);
      },

      completeTasks() {
        return _.sortBy(this.tasks.filter(task => !!task.completed), 'completedAt').reverse();
      }
    },
    watch: {
      tasks: {
        deep: true,
        handler(newTaskList) {
          localStorage.setItem("tasks", JSON.stringify(newTaskList));
        }
      },

      completeTasks: {
        handler(newTaskList) {
          console.log('what is the new task list ', newTaskList);
          return _.sortBy(newTaskList, 'completedAt').reverse();
        }
      },
    },
    methods: {
      addTask(e) {
        const isValid = this.validateTask(e);
        if (isValid) {
          this.tasks.unshift({ id: uuidv4(), description: e.target.textContent, completed: false });
          this.$refs.newTaskInput.innerHTML = '';
        }
      },

      markCompleted(task) {
        const newTask = task;
        newTask.completed = true;
        newTask.completedAt = Date.now();
      },

      editTask(e, task) {
        const found = task;
        if (found.description === e.target.textContent) return;
        const isValid = this.validateTask(e);
        if (isValid){
          found.description = e.target.textContent;
          Vue.toasted.success('Task successfully edited!', { duration: 2000, closeOnSwipe: true, keepOnHover: true, position: 'top-center' });
        } else {
          this.removeTask(task.id);
        }
      },

      validateTask(e) {
        if (e.target.textContent.trim() === '') {
          return false;
        }
        return true;
      },

      removeTask(id) {
        const found = this.tasks.findIndex((task) => task.id === id);

        this.$delete(this.tasks, found);
        Vue.toasted.success('Task successfully removed', { duration: 2000, closeOnSwipe: true, keepOnHover: true, position: 'top-center' });
      },
    }
  });
</script>