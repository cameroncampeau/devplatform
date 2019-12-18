<template>
  <div>
    <h2>Have a project?</h2>
    <h4>Let's talk!</h4>
    <div class="project-form">
      <form id="projectForm">
        <h5>Timeline</h5>
        <label>
          Start
          <input type="date" class="data start" />
        </label>
        <label>
          End
          <input type="date" class="date end" />
        </label>
        What should I include?:
        - budget
        - Timeline
        - deliverables
        - technologies
        <textarea
          name
          id
          cols="30"
          rows="10"
        >Project Description</textarea>
      </form>
    </div>
  </div>
</template>
<script>
export default {};
</script>