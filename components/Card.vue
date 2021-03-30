<template>
  <div class="column">
    <div class="card">
      <header v-if="title" class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <slot> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
  }
}
</script>

<style>
.content {
    text-align: left;
 }
.content ul li::before {
  margin-right: 0.5rem;
  color: #ff6f00;
}
</style>
