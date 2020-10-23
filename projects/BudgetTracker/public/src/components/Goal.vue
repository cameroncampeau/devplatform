<template>
  <article class="p-3 shadow bg-white">
    <h4 class="mb-3">
      {{name}} (${{target}})
      <button
        class="btn btn-sm btn-danger float-right"
        v-on:click="removeGoal"
      >Delete</button>
    </h4>
    <div class="saved">
      <form id="save" v-on:submit.prevent="addSaving">
        <div class="input-group">
          <input id="amount" type="number" class="form-control" placeholder="$" />
          <select id="account">
            <option>Chequeing</option>
            <option>Savings</option>
          </select>
          <button class="btn btn-primary" type="submit">Add saving</button>
        </div>
      </form>
      <div id="saved" class="d-block border-top border-bottom my-2 py-3">
        <div v-for="save in saved" v-bind:key="save.date">
          <p class="ml-4 my-0">
            <b>${{save.amount}}</b>
            <small>
              to {{save.account}} on
              {{new Date(save.date).toLocaleString()}}
            </small>
            <i class="fa fa-times float-right text-danger" v-on:click="removeSaving(save)"></i>
          </p>
        </div>
      </div>
      <div class="progress" style="height:3em">
        <div
          class="progress-bar"
          v-bind:class="{'bg-success': progressPercent == 100, 'bg-info': progressPercent > 75 && progressPercent < 100, 'bg-warning text-dark': progressPercent < 75 && progressPercent > 30, 'bg-danger text-dark': progressPercent <= 30}"
          role="progressbar"
          v-bind:style="`width: ${progressPercent}%;overflow:visible`"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >Saved ${{totalSaved}} of ${{target}} ({{progressPercent}}%)</div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  computed: {
    progressPercent() {
      let total = 0;
      this.saved.forEach(save => (total += save.amount));
      return Math.min(Math.floor((total / this.target) * 100), 100);
    },
    totalSaved() {
      let total = 0;
      this.saved.forEach(save => (total += save.amount));

      return total;
    },
  },
  props: {
    _id: String,
    name: String,
    target: Number,
    saved: Array,
  },
  methods: {
    async addSaving() {
      const amount = parseFloat(this.$el.querySelector('#amount').value);
      const $account = this.$el.querySelector('#account');
      const account = $account.options[$account.selectedIndex].innerHTML;
      await fetch(`/budget/api/goal/${this.name}/save`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, account }),
      });
      this.$emit('change', 'saved');
      this.$el.querySelector('form#save').reset();
    },
    async removeGoal() {
      if (!confirm(`Are you sure you want to delete ${this.name} ?`)) return;
      fetch(`/budget/api/goal/${this._id}`, { method: 'DELETE' });
      this.$emit('change', 'removed');
    },
    async removeSaving({ amount, account }) {
      await fetch(`/budget/api/goal/${this.name}/save`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, account }),
      });
      this.$emit('change');
    },
  },
  mounted() {},
};
</script>

 <style>
#saved {
  overflow: auto;
  max-height: 6em;
}
</style>
