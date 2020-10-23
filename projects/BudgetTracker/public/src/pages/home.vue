<template>
  <section class="container py-4">
    <button
      class="btn btn-success"
      v-on:click="(create_menu_open = !create_menu_open)"
    >{{!create_menu_open ? 'Create' : 'Close' }}</button>
    <div v-if="create_menu_open" class="m-3 p-4 border rounded bg-white">
      <h4>Create Goal</h4>
      <form v-on:submit.prevent="createGoal">
        <div class="input-group">
          <input
            id="goalName"
            class="form-control"
            type="text"
            style="max-width:200px"
            placeholder="Name"
          />
          <input
            id="goalTarget"
            class="form-control"
            type="number"
            style="max-width:100px"
            placeholder="Target"
          />
          <button class="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
      <div id="totals">
        <h4>Account Saving Totals</h4>
        Savings: {{total_savings}}
        Chequeing: {{total_chequeing}}
      </div>
    <div class="row">
      <div v-for="goal in goals" v-bind:key="goal.name" class="col-12 col-md-6 col-lg-4 py-3">
        <goal v-bind="goal" v-on:change="syncGoals"></goal>
      </div>
    </div>
  </section>
</template>

<script>
import GoalComponent from '@/components/Goal';

export default {
  components: {
    Goal: GoalComponent,
  },
  data() {
    return {
      goals: [],
      create_menu_open: false,

      total_chequeing: 0,
      total_savings: 0,
    };
  },
  methods: {
    async createGoal() {
      const name = this.$el.querySelector('#goalName').value;
      const target = this.$el.querySelector('#goalTarget').value;
      await fetch('/budget/api/goal', {
        method: 'POST',
        body: JSON.stringify({ name, target }),
        headers: { 'content-type': 'application/json' },
      });
      this.syncGoals();
    },
    setGoalSavingTotals() {
      this.total_savings = 0;
      this.total_chequeing = 0;
      for (const goal of this.goals) {
        console.log(goal);
        for (const saving of goal.saved) {
          if (saving.account == 'Savings') this.total_savings += saving.amount;
          else this.total_chequeing += saving.amount;
        }
      }
    },
    async syncGoals() {
      this.goals = (
        await fetch('/budget/api/goal').then(res => res.json())
      ).goals;
      this.setGoalSavingTotals();
    },
  },
  mounted() {
    this.syncGoals();
  },
};
</script>

<style>
</style>
