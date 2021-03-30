.items<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <b-table 
        :data="data"
        mobile-cards
        detailed
        striped
        default-sort="added_on"
        default-sort-direction="asc">
        <b-table-column field="name" label="Name" v-slot="props" sortable>
        <nuxt-link :to="`/recipe/${props.row.entryId}`">
            {{props.row.name}}
        </nuxt-link>
        </b-table-column>
        <b-table-column field="category" label="Category" v-slot="props" sortable>
            {{props.row.category}} 
        </b-table-column>
        <b-table-column field="cuisine" label="Cuisine" v-slot="props" sortable>
          <nuxt-link :to="`/cuisine/${props.row.cuisine}`"> {{props.row.cuisine}}</nuxt-link>
        </b-table-column>
        <b-table-column field="added_on" label="Added on" v-slot="props" sortable>
            {{props.row.added_on}} 
        </b-table-column>
        <template v-slot:detail="props">
            <article>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{{ props.row.name}}</strong>
                            <br>
                            {{props.row.description}}
                        </p>
                    </div>
                </div>
            </article>
        </template>

    </b-table>
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'
import {createClient} from '~/plugins/contentful.js'
const client = createClient()

export default {

  components: {
    Card
  },
  data() {
    return {
      recipes: [],
    }
  },
  mounted() {
    this.getEntries();
  },
  computed: {
    data: function() {
      if (this.recipes) {
        console.log(this.recipes, typeof(this.recipes))
        var data = []
        for (var i = 0; i < this.recipes.length; i++) {
          data.push({
            "name": this.recipes[i].fields.title,
            "description": this.recipes[i].fields.description,
            "category": this.recipes[i].fields.category,
            "tags": function(){
                if(this.recipes[i].fields.tags){
                    return this.recipes[i].fields.tags.split(',')
                }
                else{ return new Array}
                },
            "cuisine": this.recipes[i].fields.cuisine,
            "added_on": this.convertToDate(this.recipes[i].sys.createdAt),
            "entryId": this.recipes[i].sys.id
          })
        }
        console.log(data)
        return data
      }
    },
  },
  methods: {
    convertToDate(date_string) {
      var unixtime = Date.parse(date_string);
      var created_date = new Date(unixtime);
      console.log(unixtime, created_date)
      return `${created_date.getFullYear()}-${created_date.getUTCMonth()}-${created_date.getDate()} ${created_date.getHours()}:${created_date.getMinutes()}:${created_date.getSeconds()}`
    },
    getEntries() {
      client.getEntries({
          content_type: "recipe"
        })
        .then((response) => {
          console.log("Items:", response.items);
          this.recipes = response.items
        })
        .catch(console.error)
    },
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
.wrap {
  height: auto !important;
}
</style>

