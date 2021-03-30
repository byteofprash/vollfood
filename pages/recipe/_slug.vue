<template>
  <section class="section">
    <nuxt-link to="/recipes"> <span> < all recipes </span> </nuxt-link>
    <h1 class="title"> {{title}} </h1>
    <div class="tile box is-ancestor">
      <h3> Tags: </h3>
      <div class="tile is-10" >
        <span v-for="tag in tags" tag="href">  <a href="#" class="tag-item"> #{{tag}} </a> </span>
      </div>
      <div class="tile">
        Author: {{author}}
      </div>
      <br/>
    </div>
    <div class="tile is-mobile">
      <card title="Ingredients" >
      <div v-html="ingredients"></div>
      </card>

      <card title="Procedure" >
      <div v-html="procedure"></div>
      </card>

    </div>
  <div class="tile is-child box is-12" is-horizontal>
    <div v-viewer="options" class="images clearfix">
      <template v-for="{source, thumbnail} in images">
        <img :src="thumbnail" :data-source="source" class="image" :key="source" :alt="source.split('?image=').pop()">
      </template>
    </div>
  </div>
  </section>
</template>

<script>
import {createClient} from '~/plugins/contentful.js'
import Card from '~/components/Card'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
const client = createClient()
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
export default {
  /* name: 'HomePage', */

  components: {
    Card,
  },
  computed: {
    tags: function(){
        if(Object.keys(this.recipe).length > 0 && this.recipe.fields.tags){
            return this.recipe.fields.tags.split(',')
        }
        else{
          return new Array
        }
    },
    images: function(){
        var data = []
        if(Object.keys(this.recipe).length > 0 && this.recipe.fields.images){
          for (var i=0; i < this.recipe.fields.images.length ; i++){
            data.push({
                thumbnail: `https:${this.recipe.fields.images[i].fields.file.url}?fit=thumb&f=top_left&h=200&w=200`,
                source: `https:${this.recipe.fields.images[i].fields.file.url}`
            })
          }
          return data
        }
        else{
          return new Array
        }
    }
  },
  mounted() {
    this.recipeId = this.$route.params.slug || "index";
    this.getRecipe(this.recipeId);
    
  },
  data() {
    return{
      title: "",
      ingredients: "",
      procedure: "",
      author: "",
      recipeId: "",
      recipe: {},
      options: {
            toolbar: false,
            url: 'data-source'
            },
    }
  },
  methods: {
    async getRecipe(recipe_id){
      client.getEntry(recipe_id)
      .then((response) => {
        this.ingredients = documentToHtmlString(response.fields.ingredients);
        this.title = response.fields.title;
        this.author = response.fields.author;
        this.procedure= documentToHtmlString(response.fields.procedure);

        this.recipe = response
      })
      .catch(console.error)
    },
  }
}
</script>

<style>
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
