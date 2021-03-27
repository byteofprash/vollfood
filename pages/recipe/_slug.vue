<template>
  <section class="section">
    <nuxt-link to="/recipes"> <span> all recipes </span> </nuxt-link>
    <h1 class="title"> {{ingredient.title}} </h1>
    <div class="tile box is-ancestor">
      <h3> Tags: </h3>
      <div class="tile is-10" >
        <span v-for="tag in tags" tag="href">  <a href="#" class="tag-item"> #{{tag}} </a> </span>
      </div>
      <div class="tile">
        Author: {{ingredient.author}}
      </div>
      <br/>
    </div>
    <div class="tile is-mobile">
      <card title="Ingredients" >
        <nuxt-content :document="ingredient" /> 
      </card>

      <card title="Procedure" >
        <nuxt-content :document="procedure" /> 
      </card>

    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  /* name: 'HomePage', */

  components: {
    Card
  },
  async asyncData({$content, params, error}) {
    const slug = params.slug || "index";
    console.log(slug, "is slug");
    const ingredient = await $content(`recipe/${slug}/ingredients`).fetch()
    const procedure= await $content(`recipe/${slug}/procedure`).fetch()
    console.log(ingredient)
    return {
      ingredient: ingredient,
      procedure: procedure
    }
  },
  computed: {
    tags: function(){
      console.log(this.ingredient.tags.split(','))
      return this.ingredient.tags.split(',')
    }
  },
  methods: {
    tagClicked(item){
      console.log(item)
    }
  }
}
</script>

<style>
.nuxt-content {
    text-align: left;
 }
.nuxt-content ul li::before {
  margin-right: 0.5rem;
  color: #ff6f00;
}

.nuxt-content ul {
  list-style-type: "→ ";
  list-style-position: inside;
}
.title{
    letter-spacing: 40px;
    text-transform: uppercase;
    color: #DCDCDC !important;
    font-family: "Merriweather";
    text-align: center;
}
.tag-item a{
    color: red;
}
</style>
