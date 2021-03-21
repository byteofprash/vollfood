<template>
  <section class="section">
    <div class="columns is-mobile">

      <card>
        <nuxt-link to="/recipes"> All recipes </nuxt-link>
      </card>
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card
  }
}
</script>
