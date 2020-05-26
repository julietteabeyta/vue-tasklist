<template>
  <div class="wrapper">
    <div class="task-container">
      <h1>To Do</h1>
      <div class="task-add-input-container">
        <div contenteditable="true" type="text" class="form-control task-add-input" ref="newTaskInput" data-placeholder="Add task" @keydown.enter="(e) => { e.preventDefault(); addTask(e); }"></div>
      </div>
      <li class="task-total">Total tasks: {{ tasks.filter(task => !task.completed).length }}</li>
      <ul class="list-incomplete">
        <li class="list-group-item incomplete" v-for="(task,index) in tasks" v-show="!task.completed" :ref="'taskListItem'+index" v-bind:key="index + 'incomplete'">
          <div class="check-container">
            <input type="checkbox" :id="'incompleted-task-id-' + index " v-model="task.completed">
            <svg height="20" width="20" viewBox="0 0 100 100">
              <use href="/checkcircle.svg#icon"/>
            </svg>
          </div>
          <div contenteditable="true" type="text" class="form-control" v-on:blur="(e) => editTask(e, index)" @keydown.enter="(e) => { e.preventDefault(); e.target.blur(); }" v:model="task.description" >{{ task.description }}</div>
        </li>
      </ul>
    </div>
    <div class="task-container">
      <h1>Completed</h1>
      <ul class="list-completed">
        <li class="list-group-item" v-for="(task,index) in tasks" v-show="!!task.completed" :ref="'taskListItem'+index" v-bind:key="index + 'complete'">
          {{task.description}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Toasted from 'vue-toasted';

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
    watch: {
      tasks: {
        deep: true,
        handler(newTaskList) {
          localStorage.setItem("tasks", JSON.stringify(newTaskList));
        }
      }
    },
    methods: {
      addTask(e) {
        const isValid = this.validateEdit(e);
        if (isValid) {
          this.tasks.unshift({ description: e.target.textContent, completed: false });
          this.$refs.newTaskInput.innerHTML = '';
        }
      },
      editTask(e, index) {
        const isValid = this.validateEdit(e, index);
        if (this.tasks[index].description === e.target.textContent) return;
        if (isValid){
          this.tasks[index].description = e.target.textContent;
          Vue.toasted.success('Task successfully edited!', { duration: 2000, closeOnSwipe: true, keepOnHover: true, position: 'top-center' });
        } else {
          this.removeTask(index);
          Vue.toasted.success('Task successfully removed', { duration: 2000, closeOnSwipe: true, keepOnHover: true, position: 'top-center' });
        }
      },
      removeTask(index) {
        this.$refs[`taskListItem${index}`][0].classList.add('deleted');
        setTimeout(() => {
          this.tasks.splice(index, 1);
        }, 200);
      },
      validateEdit(e, index) {
        if (e.target.textContent.trim() === '') {
          if (e.type === 'blur') {
            this.removeTask(index);
          }
          return false;
        }
        return true;
      }
    }
  });
</script>