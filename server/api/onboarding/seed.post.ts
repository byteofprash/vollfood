import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const categories = [
  { name: 'Breakfast',     accent: '#F59E0B', sort_order: 1 },
  { name: 'Mains',         accent: '#4E7C5E', sort_order: 2 },
  { name: 'Snacks & Sides',accent: '#6B7CB8', sort_order: 3 },
  { name: 'Desserts',      accent: '#C8622A', sort_order: 4 },
]

const recipes = [
  {
    category: 'Breakfast', name: 'Masala Chai', cooktime: 10, serves: 2,
    ingredients: ['2 cups water','1 cup milk','2 tsp tea leaves','4 cardamom pods, crushed','1 inch ginger, grated','1 cinnamon stick','2 tsp sugar'],
    steps: ['Boil water with cardamom, ginger, and cinnamon for 2 minutes.','Add tea leaves and simmer for 1 minute.','Pour in milk and bring to a boil.','Simmer on low heat for 3 minutes until fragrant.','Strain into cups, add sugar to taste, and serve hot.'],
  },
  {
    category: 'Breakfast', name: 'Upma', cooktime: 20, serves: 3,
    ingredients: ['1 cup semolina (rava)','2 tbsp oil','1 tsp mustard seeds','1 tsp chana dal','1 onion, chopped','2 green chillies, slit','1 sprig curry leaves','2 cups water','Salt to taste','1 tbsp lemon juice','Fresh coriander to garnish'],
    steps: ['Dry roast semolina until lightly golden. Set aside.','Heat oil, add mustard seeds and chana dal. Let them splutter.','Add onion, chillies, and curry leaves. Sauté until soft.','Pour in water, bring to a boil, add salt.','Slowly stir in semolina, mixing continuously to avoid lumps.','Cover and cook on low for 3 minutes. Finish with lemon juice and coriander.'],
  },
  {
    category: 'Breakfast', name: 'Fluffy Pancakes', cooktime: 20, serves: 4,
    ingredients: ['1½ cups all-purpose flour','1 tbsp sugar','2 tsp baking powder','½ tsp salt','1¼ cups milk','1 egg','3 tbsp melted butter','1 tsp vanilla extract'],
    steps: ['Whisk flour, sugar, baking powder, and salt together.','Mix milk, egg, melted butter, and vanilla in another bowl.','Combine wet and dry — stir until just mixed; lumps are fine.','Heat a non-stick pan over medium heat and lightly grease.','Pour ¼ cup batter per pancake; cook until bubbles form (~2 min), then flip.','Cook 1 more minute until golden. Serve with maple syrup.'],
  },
  {
    category: 'Mains', name: 'Dal Tadka', cooktime: 35, serves: 4,
    ingredients: ['1 cup yellow lentils (toor dal)','1 tomato, chopped','1 onion, finely chopped','3 garlic cloves, minced','1 tsp cumin seeds','½ tsp turmeric','1 tsp coriander powder','½ tsp red chilli powder','2 tbsp ghee','Salt to taste','Fresh coriander'],
    steps: ['Wash dal and pressure cook with turmeric and 3 cups water for 3 whistles.','Heat ghee, add cumin seeds and let them splutter.','Add onion and garlic; sauté until golden brown.','Add tomato and spices; cook until oil separates.','Add cooked dal, salt, and water to adjust consistency. Simmer 10 minutes.','Garnish with coriander and a final drizzle of ghee.'],
  },
  {
    category: 'Mains', name: 'Palak Paneer', cooktime: 35, serves: 4,
    ingredients: ['250g paneer, cubed','3 cups spinach','1 onion, chopped','2 tomatoes, chopped','1 tbsp ginger-garlic paste','1 tsp cumin seeds','1 tsp garam masala','½ tsp turmeric','½ cup cream','2 tbsp oil','Salt to taste'],
    steps: ['Blanch spinach in boiling water for 2 minutes, then blend into a smooth purée.','Heat oil, add cumin, then onion. Sauté until golden.','Add ginger-garlic paste and tomatoes; cook until oil separates.','Add turmeric, garam masala, and salt. Stir well.','Pour in spinach purée and cook for 5 minutes.','Add paneer and cream; simmer gently for 5 minutes and serve.'],
  },
  {
    category: 'Mains', name: 'Spaghetti Bolognese', cooktime: 45, serves: 4,
    ingredients: ['400g spaghetti','500g minced beef','1 onion, diced','3 garlic cloves, minced','400g canned tomatoes','2 tbsp tomato paste','1 carrot, diced','1 celery stalk, diced','½ cup red wine','1 tsp dried oregano','Salt and pepper','Parmesan to serve'],
    steps: ['Brown the mince over high heat; remove and set aside.','Sauté onion, carrot, and celery in the same pan for 5 minutes.','Add garlic and tomato paste; stir 1 minute.','Pour in red wine and reduce by half.','Add canned tomatoes, oregano, mince, salt, and pepper. Simmer 30 minutes.','Cook spaghetti to al dente. Serve topped with sauce and Parmesan.'],
  },
  {
    category: 'Snacks & Sides', name: 'Samosa', cooktime: 60, serves: 8,
    ingredients: ['2 cups all-purpose flour','4 tbsp oil','½ tsp salt','Water to knead','3 potatoes, boiled and mashed','1 cup peas','1 tsp cumin seeds','1 tsp garam masala','½ tsp amchur (dry mango powder)','2 green chillies, chopped','Oil for deep frying'],
    steps: ['Mix flour, oil, and salt; add water to form a stiff dough. Rest 30 minutes.','For filling: heat oil, add cumin, peas, and spices. Mix in potatoes. Cool.','Divide dough into balls; roll each into an oval and cut in half.','Shape each half into a cone, fill with potato mixture, seal edges with water.','Deep fry in medium-hot oil until golden brown, turning occasionally.','Drain on paper and serve hot with mint chutney.'],
  },
  {
    category: 'Desserts', name: 'Chocolate Chip Cookies', cooktime: 25, serves: 24,
    ingredients: ['2¼ cups all-purpose flour','1 tsp baking soda','1 tsp salt','1 cup butter, softened','¾ cup granulated sugar','¾ cup brown sugar','2 eggs','2 tsp vanilla extract','2 cups chocolate chips'],
    steps: ['Preheat oven to 190°C. Line baking sheets with parchment.','Whisk flour, baking soda, and salt together.','Beat butter and sugars until light and fluffy, about 3 minutes.','Add eggs one at a time, then vanilla.','Stir in flour mixture until just combined; fold in chocolate chips.','Drop rounded tablespoons onto sheets 5cm apart. Bake 9–11 minutes until edges are golden.','Cool on the sheet for 5 minutes before transferring.'],
  },
]

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // Use service role for all writes — server is trusted and RLS would race-condition
  // after profile.family_id is written in the same request.
  const admin = serverSupabaseServiceRole(event)

  const { data: profile } = await admin.from('profiles').select('family_id, name').eq('id', user.id).single()

  let familyId = profile?.family_id ?? null
  if (!familyId) {
    const firstName = (profile?.name ?? user.email ?? 'My').split(/[\s@]/)[0]
    const { data: newFamily, error: famErr } = await admin
      .from('families')
      .insert({ name: `${firstName}'s Family`, invite_code: generateInviteCode() })
      .select('id')
      .single()
    if (famErr) throw createError({ statusCode: 500, message: famErr.message })
    familyId = newFamily.id
    await admin.from('profiles').update({ family_id: familyId, role: 'admin' }).eq('id', user.id)
  }

  const { count } = await admin.from('recipes').select('id', { count: 'exact', head: true }).eq('family_id', familyId)
  if ((count ?? 0) > 0) throw createError({ statusCode: 400, message: 'Family already has recipes.' })

  const { data: cats, error: catErr } = await admin
    .from('categories')
    .insert(categories.map(c => ({ ...c, family_id: familyId })))
    .select('id, name')
  if (catErr) throw createError({ statusCode: 500, message: catErr.message })

  const catMap: Record<string, string> = Object.fromEntries((cats ?? []).map((c: any) => [c.name, c.id]))

  const { data: inserted, error: rErr } = await admin
    .from('recipes')
    .insert(recipes.map(r => ({ name: r.name, cooktime: r.cooktime, serves: r.serves, family_id: familyId, category_id: catMap[r.category] ?? null })))
    .select('id, name')
  if (rErr) throw createError({ statusCode: 500, message: rErr.message })

  const recipeMap: Record<string, string> = Object.fromEntries((inserted ?? []).map((r: any) => [r.name, r.id]))

  const { error: vErr } = await admin.from('recipe_versions').insert(
    recipes.map(r => ({ recipe_id: recipeMap[r.name], author_id: user.id, ingredients: r.ingredients, steps: r.steps, is_original: true }))
  )
  if (vErr) throw createError({ statusCode: 500, message: vErr.message })

  return { success: true, count: recipes.length }
})
