<template>
  <section class="section">
    <h1 class="title"> {{ingredient.title}} </h1>
    <div class="columns is-mobile">
            <nuxt-link to="/recipe/bulgar">
            Bulgar
            </nuxt-link>
      <b-table :data="data">
        <b-table-column field="name" label="Name" v-slot="props">
        <a :href="`/recipe/${props.row.name}`">
            {{props.row.name}}
        </a>
        </b-table-column>
        <b-table-column field="category" label="Category" v-slot="props">
            {{props.row.category}} 
        </b-table-column>
        <b-table-column field="added_on" label="Added on" v-slot="props">
            {{props.row.added_on}} 
        </b-table-column>
    </b-table>
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
    const ingredient = await $content(`recipe`, { deep: true }).where({slug: 'ingredients'}).fetch()
    console.log(ingredient)
    return {
      ingredient: ingredient,
    }
  },
  data (){
    return {
        columns: [
          { 
            field: "name", 
            label: "Name",
          },
          {
            field: "category", 
            label: "Category",
          },
          {
            field: "added_on", 
            label: "Added on",
          }
        ]
    }
  },
  computed: {
      data: function() {
        console.log(this.ingredient, typeof(this.ingredient))
        var data = []
        for (var i=0; i < this.ingredient.length; i++){
            data.push({"name": this.ingredient[i].title, "category": "Carb", "added_on": this.ingredient[i].createdAt, "dir": this.ingredient[i].dir})
        }
        console.log(data)
        return data
      }
  },
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
</style>

