<template>
  <div>
    <nav
      class="navbar header has-shadow is-black"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
          <img
            class="logo"
            src="~assets/vollfood.png"
            alt="Vollfood"
            height="28"
          >
        </a>
      </div>
    </nav>

    <section class="main-content">
      <div class="container column is-12">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300&display=swap');
.logo{
  justify-content: center
}
</style>
