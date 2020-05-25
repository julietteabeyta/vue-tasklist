<template>
  <div class="wrapper">
    <div class="task-container">
      <h1>To Do</h1>
      <div>
        <div contenteditable="true" type="text" class="form-control task-add-input" ref="newTaskInput" data-placeholder="Add task" @keyup.enter="addTask"></div>
      </div>
      <ul>
        <li class="list-group-item incomplete" v-for="(task,index) in tasks" v-show="!task.completed" :ref="'taskListItem'+index" v-bind:key="index + 'incomplete'">
          <div class="check-container">
            <input type="checkbox" :id="'incompleted-task-id-' + index " v-model="task.completed">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90.048 35C91.3168 39.1088 92 43.4746 92 48C92 72.3005 72.3005 92 48 92C23.6995 92 4 72.3005 4 48C4 23.6995 23.6995 4 48 4C58.0262 4 67.2692 7.35349 74.6684 13" stroke="#808080" stroke-width="8"/>
              <path d="M24.0338 43.3349L45.007 65.4992C45.4155 65.9308 46.108 65.9131 46.4938 65.4612L87.7866 17.1036" stroke="#808080" stroke-width="10"/>
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
      Vue.use(Toasted, { duration: 2000 });
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
          Vue.toasted.show('Task successfully edited!')
        } else {
          this.removeTask(index);
          Vue.toasted.show('Task successfully removed')
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