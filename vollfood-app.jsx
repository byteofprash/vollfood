
// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#FAF7F2', card: '#FFFFFF', primary: '#C8622A', primarySoft: '#F0CDB8',
  primaryBg: '#FDF3EC', primaryDark: '#8B3812', text: '#2A1810', mid: '#7D5A48',
  muted: '#B8967A', border: '#EDE3D8', surface: '#F5EDE3', success: '#4E7C5E',
  tabBg: 'rgba(250,247,242,0.97)',
};
const ROLE_COLORS = { admin: '#C8622A', editor: '#4E7C5E', contributor: '#6B7CB8' };
const ROLE_LABELS = { admin: 'Admin', editor: 'Editor', contributor: 'Contributor' };

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MEMBERS = [
  { id:1, name:'Priya Sharma',  initials:'PS', role:'admin',       hue:'#C8622A', recipes:12 },
  { id:2, name:'Meena Sharma',  initials:'MS', role:'editor',      hue:'#5B8BA8', recipes:8  },
  { id:3, name:'Kavya Rajan',   initials:'KR', role:'editor',      hue:'#6A8F58', recipes:6  },
  { id:4, name:'Deepa Iyer',    initials:'DI', role:'contributor', hue:'#9B7358', recipes:4  },
  { id:5, name:'Ananya S',      initials:'AS', role:'contributor', hue:'#8B6B9B', recipes:3  },
  { id:6, name:'Lakshmi V',     initials:'LV', role:'editor',      hue:'#B87848', recipes:7  },
  { id:7, name:'Rekha Pillai',  initials:'RP', role:'contributor', hue:'#7A8B5E', recipes:2  },
];

const CATEGORIES = [
  { id:'rice',     name:'Rice Variety', count:8,  accent:'#C8622A' },
  { id:'kuzhambu', name:'Kuzhambu',     count:12, accent:'#9B4A1E' },
  { id:'curry',    name:'Curry',        count:10, accent:'#7A7A28' },
  { id:'side',     name:'Side Dish',    count:15, accent:'#4E7C5E' },
  { id:'variety',  name:'Variety Rice', count:6,  accent:'#7A5A9B' },
];

const RECIPES = [
  { id:1, name:'Sambar Sadam',         category:'rice',     authorId:1, time:'45 min', serves:4,
    forks:[
      { authorId:1, note:"Amma's original — fresh tamarind, homemade sambar powder",
        ingredients:['2 cups rice','1 cup toor dal','Tamarind (lemon size)','2 tomatoes','Sambar powder 2 tsp','Turmeric ¼ tsp','Mustard seeds','Curry leaves','Ghee 2 tbsp'],
        steps:['Pressure cook rice and dal together (1:3 water ratio) for 4 whistles.','Soak tamarind in warm water, extract pulp.','Heat ghee. Add mustard, curry leaves. Add tomatoes.','Add tamarind water and sambar powder. Cook down.','Mix in rice-dal, simmer 10 min. Season with salt.'] },
      { authorId:2, note:"Meena's — adds drumstick and pearl onions",
        ingredients:['2 cups rice','1 cup toor dal','Tamarind (small ball)','1 drumstick','6 pearl onions','2 tomatoes','MTR Sambar powder 3 tsp','Turmeric ½ tsp','Oil 2 tbsp'],
        steps:['Cook rice and dal separately.','Make tamarind water. Cook onions and drumstick.','Add tomatoes, sambar powder, tamarind water. Boil 15 min.','Mix in cooked dal. Combine with rice before serving.'] },
      { authorId:3, note:"Kavya's quick one-pot pressure cooker method",
        ingredients:['2 cups rice','¾ cup toor dal','1 tbsp tamarind paste','Mixed veg 1 cup','Sambar powder 2 tsp','Turmeric','Ghee','Salt'],
        steps:['Add everything to pressure cooker with 5 cups water.','Cook for 5 whistles on medium.','Open, mix well, adjust consistency.','Temper with ghee, mustard seeds, curry leaves.'] },
    ]},
  { id:2, name:'Puli Kuzhambu',        category:'kuzhambu', authorId:2, time:'35 min', serves:6,
    forks:[
      { authorId:2, note:"Traditional Chettinad-style with sesame oil",
        ingredients:['Tamarind — large lemon size','15 small onions','1 tomato','Sesame oil 3 tbsp','Kuzhambu milagai powder 2 tbsp','Turmeric ¼ tsp','Fenugreek seeds','Mustard seeds','Curry leaves'],
        steps:['Soak tamarind, extract thick pulp.','Heat sesame oil, add fenugreek and mustard.','Add onions, cook golden. Add tomato.','Add tamarind water + powder. Boil 20 min till thick.','Finish with a drizzle of sesame oil.'] },
      { authorId:6, note:"Lakshmi's version — drumstick and brinjal added",
        ingredients:['Tamarind','1 drumstick','2 brinjals','10 small onions','Kuzhambu powder 3 tbsp','Sesame oil','Turmeric','Mustard seeds'],
        steps:['Cook drumstick and brinjal with tamarind water.','Fry onions in sesame oil, add kuzhambu powder.','Combine and simmer till oil separates on top.'] },
    ]},
  { id:3, name:'Chettinad Chicken',    category:'curry',    authorId:1, time:'60 min', serves:5,
    forks:[
      { authorId:1, note:"Priya's bold version — freshly ground whole spices",
        ingredients:['1 kg chicken','3 large onions','3 tomatoes','Ginger-garlic paste 2 tbsp','Chettinad masala (fresh ground)','¼ coconut','Oil 3 tbsp','Curry leaves','Bay leaves'],
        steps:['Dry roast & grind: kalpasi, marathi mokku, star anise, peppercorns, red chillies.','Fry onions golden. Add ginger-garlic paste.','Add tomatoes, cook down. Add ground masala.','Add chicken, coat well, cook on high 5 min.','Add water + coconut paste. Simmer 35 min.'] },
      { authorId:4, note:"Deepa's lighter version — coconut milk, less oil",
        ingredients:['800g chicken','2 onions','2 tomatoes','Ginger-garlic paste 1½ tbsp','Chettinad powder 2 tbsp','Coconut milk ½ cup','Oil 2 tbsp'],
        steps:['Cook onions, ginger-garlic till fragrant.','Add tomatoes and Chettinad powder.','Add chicken, cook through on medium.','Add coconut milk, simmer 15 min.'] },
    ]},
  { id:4, name:'Lemon Rice',            category:'variety',  authorId:3, time:'20 min', serves:3,
    forks:[
      { authorId:3, note:"Kavya's classic — perfect tiffin recipe",
        ingredients:['2 cups cooked rice','Lemon juice 3 tbsp','Turmeric ¼ tsp','Mustard seeds','Chana dal 1 tsp','Urad dal 1 tsp','Peanuts 2 tbsp','2 green chillies','Curry leaves','Oil 2 tbsp'],
        steps:['Heat oil. Add mustard, dals, peanuts. Fry golden.','Add green chillies, curry leaves, turmeric.','Add rice, mix well. Pour lemon juice. Toss.','Adjust salt and lemon to taste.'] },
      { authorId:5, note:"Ananya's — extra peanuts + hint of ginger",
        ingredients:['2 cups cooked rice','Lemon juice 4 tbsp','Turmeric','1 inch ginger (grated)','Peanuts 4 tbsp','Cashews 1 tbsp','Mustard seeds','Curry leaves','Oil 2 tbsp'],
        steps:['Fry peanuts and cashews in oil, set aside.','Temper mustard, add ginger, turmeric, curry leaves.','Mix in rice. Add lemon juice, nuts and salt.'] },
    ]},
  { id:5, name:'Raw Banana Kootu',      category:'side',     authorId:6, time:'30 min', serves:4,
    forks:[
      { authorId:6, note:"Lakshmi's classic — chana dal, ground coconut",
        ingredients:['2 raw bananas','½ cup chana dal','¼ coconut grated','Cumin 1 tsp','Pepper ½ tsp','2 red chillies','Coconut oil 1 tbsp','Mustard seeds','Curry leaves'],
        steps:['Cook chana dal till soft. Cook banana cubes with turmeric.','Grind coconut, cumin, pepper, chilli coarsely.','Combine dal and banana. Add coconut paste. Cook 5 min.','Temper with coconut oil, mustard, curry leaves.'] },
    ]},
  { id:6, name:'Tamarind Rice',         category:'variety',  authorId:2, time:'25 min', serves:4,
    forks:[
      { authorId:2, note:"Meena's puliyodarai — temple-style",
        ingredients:['2 cups rice','Tamarind (big lemon size)','Sesame oil 3 tbsp','Mustard seeds','Chana dal + urad dal','Peanuts','Dried red chillies 4','Asafoetida','Curry leaves','Turmeric'],
        steps:['Cook rice, spread to cool.','Make thick tamarind extract. Cook down with oil, spices, turmeric into a paste.','Mix tamarind paste with rice using sesame oil.','Temper with peanuts and dried chillies.'] },
    ]},
  { id:7, name:'Rasam',                 category:'kuzhambu', authorId:3, time:'20 min', serves:4,
    forks:[
      { authorId:3, note:"Kavya's pepper rasam — good for cold days",
        ingredients:['Tamarind (small ball)','Tomato 1','Pepper 1 tsp','Cumin 1 tsp','Garlic 4 cloves','Turmeric','Ghee 1 tsp','Mustard seeds','Curry leaves','Coriander'],
        steps:['Boil tamarind water with tomato and turmeric.','Crush pepper, cumin, garlic coarsely.','Add to boiling tamarind water. Simmer 10 min.','Temper with ghee, mustard, curry leaves. Garnish coriander.'] },
      { authorId:1, note:"Priya's tomato rasam — tangier, with toor dal water",
        ingredients:['2 tomatoes','Toor dal water 1 cup','Tamarind (small)','Rasam powder 1½ tsp','Turmeric','Ghee','Mustard','Curry leaves','Coriander'],
        steps:['Boil tomatoes with tamarind water till soft.','Add dal water, rasam powder, turmeric. Boil once.','Temper with ghee and mustard. Do not over-boil.'] },
    ]},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Avatar({ member, size = 36, style = {} }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size, background:member.hue,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize:size*0.38, flexShrink:0,
      fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif', ...style }}>
      {member.initials}
    </div>
  );
}

function RoleBadge({ role }) {
  return (
    <span style={{ fontSize:11, fontWeight:600, letterSpacing:0.3, padding:'2px 8px',
      borderRadius:99, background: ROLE_COLORS[role]+'22', color: ROLE_COLORS[role],
      fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function RecipePlaceholder({ id, size = 56 }) {
  const colors = ['#E8C4A0','#D4A882','#C49070','#E0B898','#D8BCA8'];
  const c = colors[id % colors.length];
  return (
    <div style={{ width:size, height:size, borderRadius:10, background:c, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <svg width={size*0.45} height={size*0.45} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C7 2 3 6 3 11c0 3.5 2 6.5 5 8v1a1 1 0 001 1h6a1 1 0 001-1v-1c3-1.5 5-4.5 5-8 0-5-4-9-9-9z" fill="rgba(255,255,255,0.6)"/>
      </svg>
    </div>
  );
}

function RecipeRow({ recipe, onPress }) {
  const author = MEMBERS.find(m => m.id === recipe.authorId);
  return (
    <div onClick={onPress} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      borderBottom:`1px solid ${C.border}`, cursor:'pointer', background:C.card,
      transition:'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='#FDF3EC'}
      onMouseLeave={e => e.currentTarget.style.background=C.card}>
      <RecipePlaceholder id={recipe.id} size={52} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize:15, color:C.text, marginBottom:4,
          fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{recipe.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          {/* All fork authors */}
          <div style={{ display:'flex', alignItems:'center' }}>
            {recipe.forks.map((f, i) => {
              const a = MEMBERS.find(m => m.id === f.authorId);
              return a ? (
                <Avatar key={f.authorId} member={a} size={18}
                  style={{ marginLeft: i > 0 ? -5 : 0, border:'1.5px solid #fff', zIndex: recipe.forks.length - i }} />
              ) : null;
            })}
          </div>
          <span style={{ fontSize:12, color:C.muted, fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            · {recipe.time}
          </span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
        {recipe.forks.length > 1 && (
          <span style={{ fontSize:11, fontWeight:600, color:C.primary, background:C.primaryBg,
            padding:'2px 7px', borderRadius:99, fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            {recipe.forks.length} versions
          </span>
        )}
        <span style={{ fontSize:12, color:C.muted, fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          {recipe.serves} servings
        </span>
      </div>
    </div>
  );
}

function Header({ title, onBack, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'12px 16px',
      borderBottom:`1px solid ${C.border}`, background:C.bg, gap:12, minHeight:52 }}>
      {onBack && (
        <button onClick={onBack} style={{ background:'none', border:'none', padding:'4px 8px 4px 0',
          cursor:'pointer', display:'flex', alignItems:'center', color:C.primary, gap:4 }}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div style={{ flex:1, fontWeight:700, fontSize:17, color:C.text,
        fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{title}</div>
      {right}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ padding:'18px 16px 8px', fontSize:12, fontWeight:700, letterSpacing:0.8,
      textTransform:'uppercase', color:C.muted,
      fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{children}</div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [pass, setPass] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';

  const submit = () => {
    if (email && pass) { onLogin(); }
    else setError('Please enter your email and password.');
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.bg,
      height:'100%', overflowY:'auto', padding:'0 0 40px' }}>
      <div style={{ padding:'56px 28px 32px', textAlign:'center' }}>
        <div style={{ fontSize:38, fontWeight:800, color:C.primary, letterSpacing:-1, fontFamily:ff }}>
          Vollfood
        </div>
        <div style={{ fontSize:14, color:C.muted, marginTop:6, fontFamily:ff }}>
          Your family's kitchen, forever.
        </div>
      </div>

      <div style={{ margin:'0 20px', background:C.card, borderRadius:18,
        border:`1px solid ${C.border}`, overflow:'hidden' }}>
        {[
          { label:'Email', val:email, set:setEmail, type:'email', ph:'you@family.com' },
          { label:'Password', val:pass, set:setPass, type:'password', ph:'••••••••' },
        ].map((f, i) => (
          <div key={i} style={{ padding:'14px 16px', borderBottom: i===0 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.muted, letterSpacing:0.5,
              textTransform:'uppercase', marginBottom:4, fontFamily:ff }}>{f.label}</div>
            <input type={f.type} value={f.val} onChange={e => { setError(''); f.set(e.target.value); }}
              placeholder={f.ph} style={{ width:'100%', border:'none', background:'transparent',
              fontSize:16, color:C.text, outline:'none', fontFamily:ff }}/>
          </div>
        ))}
      </div>

      {error && <div style={{ color:'#C84040', fontSize:13, textAlign:'center', margin:'10px 24px 0', fontFamily:ff }}>{error}</div>}

      <button onClick={submit} style={{ margin:'20px 20px 0', padding:'16px', background:C.primary,
        color:'#fff', border:'none', borderRadius:14, fontSize:16, fontWeight:700,
        cursor:'pointer', fontFamily:ff, letterSpacing:0.2 }}>
        Enter the Kitchen
      </button>

      <div style={{ margin:'28px 20px 0', background:C.card, borderRadius:18,
        border:`1px solid ${C.border}`, padding:'14px 16px' }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.muted, letterSpacing:0.5,
          textTransform:'uppercase', marginBottom:4, fontFamily:ff }}>Family Invite Code</div>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter code to join a family"
          style={{ width:'100%', border:'none', background:'transparent', fontSize:16,
          color:C.text, outline:'none', fontFamily:ff }}/>
      </div>
      <div style={{ fontSize:12, color:C.muted, textAlign:'center', marginTop:12, fontFamily:ff }}>
        Ask your family admin for an invite code
      </div>
    </div>
  );
}

function HomeScreen({ navigate }) {
  const [search, setSearch] = React.useState('');
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  const me = MEMBERS[0];
  const recent = RECIPES.slice(0, 4);
  const filtered = search
    ? RECIPES.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div style={{ height:'100%', overflowY:'auto', background:C.bg, paddingBottom:80 }}>
      {/* greeting */}
      <div style={{ padding:'20px 16px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:ff }}>
            Good morning, {me.name.split(' ')[0]} 👋
          </div>
          <div style={{ fontSize:13, color:C.muted, marginTop:2, fontFamily:ff }}>
            {RECIPES.length} recipes · {MEMBERS.length} family members
          </div>
        </div>
        <Avatar member={me} size={40} />
      </div>

      {/* Add recipe CTA */}
      <div onClick={() => navigate('add')}
        style={{ margin:'4px 16px 12px', background:C.primary, borderRadius:16,
          padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
          cursor:'pointer', boxShadow:`0 4px 18px ${C.primary}44`,
          transition:'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow=`0 6px 24px ${C.primary}66`; }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 4px 18px ${C.primary}44`; }}>
        <div style={{ width:44, height:44, borderRadius:99, background:'rgba(255,255,255,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
            <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 18v3M9 21h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', fontFamily:ff }}>Add new recipe</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginTop:2, fontFamily:ff }}>
            Speak it — we'll handle the rest
          </div>
        </div>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ marginLeft:'auto' }}>
          <path d="M1 1l6 6-6 6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* search */}
      <div style={{ margin:'0 16px 4px', background:C.card, borderRadius:14,
        border:`1px solid ${C.border}`, display:'flex', alignItems:'center',
        padding:'10px 14px', gap:10 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke={C.muted} strokeWidth="1.8"/>
          <path d="M11 11l3 3" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes…"
          style={{ flex:1, border:'none', background:'transparent', fontSize:15,
          color:C.text, outline:'none', fontFamily:ff }}/>
      </div>

      {/* search results */}
      {filtered && (
        <div style={{ margin:'12px 0' }}>
          <SectionLabel>Results</SectionLabel>
          <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            {filtered.length ? filtered.map(r => <RecipeRow key={r.id} recipe={r} onPress={() => navigate('recipe', { recipeId:r.id })} />)
              : <div style={{ padding:'20px 16px', color:C.muted, fontSize:14, fontFamily:ff }}>No recipes found.</div>}
          </div>
        </div>
      )}

      {!filtered && <>
        <SectionLabel>Categories</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 16px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} onClick={() => navigate('category', { categoryId:cat.id })}
              style={{ background:cat.accent+'18', border:`1px solid ${cat.accent}30`,
              borderRadius:16, padding:'16px 14px', cursor:'pointer', transition:'transform 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:ff }}>{cat.name}</div>
              <div style={{ fontSize:12, color:cat.accent, marginTop:4, fontWeight:600, fontFamily:ff }}>
                {cat.count} recipes
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>Recently Added</SectionLabel>
        <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
          {recent.map(r => <RecipeRow key={r.id} recipe={r} onPress={() => navigate('recipe', { recipeId:r.id })} />)}
        </div>
      </>}
    </div>
  );
}

function CategoryScreen({ categoryId, navigate, onBack }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const recipes = RECIPES.filter(r => r.category === categoryId);
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg }}>
      <Header title={cat?.name || 'Category'} onBack={onBack} />
      <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>
        <div style={{ padding:'12px 16px', fontSize:13, color:C.muted, fontFamily:ff }}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </div>
        <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
          {recipes.length ? recipes.map(r =>
            <RecipeRow key={r.id} recipe={r} onPress={() => navigate('recipe', { recipeId:r.id })} />)
            : <div style={{ padding:'32px 16px', textAlign:'center', color:C.muted, fontSize:14, fontFamily:ff }}>
                No recipes yet. Be the first to add one!
              </div>}
        </div>
      </div>
    </div>
  );
}

function RecipeScreen({ recipeId, navigate, onBack }) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  const [forkIdx, setForkIdx] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('ingredients');
  const [comparing, setComparing] = React.useState(false);
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';

  if (!recipe) return null;
  const fork = recipe.forks[forkIdx];
  const author = MEMBERS.find(m => m.id === fork.authorId);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg }}>
      <Header title={recipe.name} onBack={onBack}
        right={recipe.forks.length > 1 &&
          <button onClick={() => setComparing(!comparing)}
            style={{ background: comparing ? C.primary : C.primaryBg, color: comparing ? '#fff' : C.primary,
              border:'none', borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:600,
              cursor:'pointer', fontFamily:ff }}>
            {comparing ? 'Single' : 'Compare'}
          </button>} />

      <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>
        {/* hero placeholder */}
        <div style={{ height:160, background:`linear-gradient(135deg, ${C.primarySoft}, ${C.primary}33)`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
            flexDirection:'column', gap:4 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C7 2 3 6 3 11c0 3.5 2 6.5 5 8v1a1 1 0 001 1h6a1 1 0 001-1v-1c3-1.5 5-4.5 5-8 0-5-4-9-9-9z" fill={C.primary} opacity="0.4"/>
            </svg>
            <span style={{ fontSize:11, color:C.muted, fontFamily:'monospace' }}>recipe photo</span>
          </div>
          {/* meta pills */}
          <div style={{ position:'absolute', bottom:12, left:16, display:'flex', gap:8 }}>
            {[['⏱', recipe.time], ['🍽', `${recipe.serves} serves`]].map(([icon, label], i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.85)', borderRadius:99, padding:'4px 10px',
                fontSize:12, fontWeight:600, color:C.text, fontFamily:ff, display:'flex', gap:4, alignItems:'center' }}>
                {icon} {label}
              </div>
            ))}
          </div>
        </div>

        {!comparing ? (
          <>
            {/* fork selector */}
            {recipe.forks.length > 1 && (
              <div style={{ padding:'12px 16px', display:'flex', gap:8, overflowX:'auto',
                borderBottom:`1px solid ${C.border}` }}>
                {recipe.forks.map((f, i) => {
                  const a = MEMBERS.find(m => m.id === f.authorId);
                  return (
                    <button key={i} onClick={() => setForkIdx(i)}
                      style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 12px',
                        borderRadius:99, border:`1.5px solid ${i===forkIdx ? C.primary : C.border}`,
                        background: i===forkIdx ? C.primaryBg : C.card,
                        cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>
                      {a && <Avatar member={a} size={22} />}
                      <span style={{ fontSize:13, fontWeight:i===forkIdx?700:500, color:i===forkIdx?C.primary:C.mid, fontFamily:ff }}>
                        {a?.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* author note */}
            <div style={{ margin:'12px 16px', padding:'12px 14px', background:C.primaryBg,
              borderRadius:12, borderLeft:`3px solid ${C.primary}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                {author && <Avatar member={author} size={24} />}
                <span style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:ff }}>{author?.name}</span>
                <RoleBadge role={author?.role} />
              </div>
              <div style={{ fontSize:13, color:C.mid, fontFamily:ff, lineHeight:1.5 }}>{fork.note}</div>
            </div>

            {/* ingredient/step tabs */}
            <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, background:C.card }}>
              {['ingredients','steps'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex:1, padding:'12px', border:'none', background:'transparent',
                    fontSize:14, fontWeight:activeTab===tab?700:500,
                    color:activeTab===tab?C.primary:C.muted, cursor:'pointer', fontFamily:ff,
                    borderBottom:`2px solid ${activeTab===tab?C.primary:'transparent'}` }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ padding:'4px 0' }}>
              {activeTab === 'ingredients' ? fork.ingredients.map((ing, i) => (
                <div key={i} style={{ padding:'11px 16px', display:'flex', alignItems:'center', gap:10,
                  borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:6, height:6, borderRadius:99, background:C.primary, flexShrink:0 }}/>
                  <span style={{ fontSize:14, color:C.text, fontFamily:ff }}>{ing}</span>
                </div>
              )) : fork.steps.map((step, i) => (
                <div key={i} style={{ padding:'12px 16px', display:'flex', gap:12, alignItems:'flex-start',
                  borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:24, height:24, borderRadius:99, background:C.primary,
                    color:'#fff', fontWeight:700, fontSize:12, display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0, fontFamily:ff }}>{i+1}</div>
                  <span style={{ fontSize:14, color:C.text, fontFamily:ff, lineHeight:1.55, paddingTop:3 }}>{step}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── COMPARE VIEW ── */
          <CompareView recipe={recipe} />
        )}
      </div>
    </div>
  );
}

function CompareView({ recipe }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  const forks = recipe.forks.slice(0, 2); // compare first two
  const [tab, setTab] = React.useState('ingredients');

  return (
    <div>
      {/* pick tab */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, background:C.card }}>
        {['ingredients','steps'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex:1, padding:'12px', border:'none', background:'transparent',
              fontSize:14, fontWeight:tab===t?700:500, color:tab===t?C.primary:C.muted,
              cursor:'pointer', fontFamily:ff, borderBottom:`2px solid ${tab===t?C.primary:'transparent'}` }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* author headers */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${C.border}` }}>
        {forks.map((f, i) => {
          const a = MEMBERS.find(m => m.id === f.authorId);
          return (
            <div key={i} style={{ padding:'10px 10px 10px 12px', background: i%2===0 ? C.primaryBg : '#F0F7F0',
              borderRight: i===0 ? `1px solid ${C.border}` : 'none',
              display:'flex', alignItems:'center', gap:7 }}>
              {a && <Avatar member={a} size={24} />}
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:ff }}>{a?.name.split(' ')[0]}</div>
                <div style={{ fontSize:10, color:C.muted, fontFamily:ff }}>v{i+1}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* side-by-side rows */}
      {tab === 'ingredients' ? (
        (() => {
          const maxLen = Math.max(...forks.map(f => f.ingredients.length));
          return Array.from({ length: maxLen }, (_, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
              borderBottom:`1px solid ${C.border}` }}>
              {forks.map((f, fi) => (
                <div key={fi} style={{ padding:'10px 10px 10px 12px', fontSize:12, color:C.text,
                  fontFamily:ff, lineHeight:1.45,
                  borderRight: fi===0 ? `1px solid ${C.border}` : 'none',
                  background: fi===0 ? '#fff' : '#F8FBF8',
                  opacity: f.ingredients[i] ? 1 : 0.3 }}>
                  {f.ingredients[i] || '—'}
                </div>
              ))}
            </div>
          ));
        })()
      ) : (
        (() => {
          const maxLen = Math.max(...forks.map(f => f.steps.length));
          return Array.from({ length: maxLen }, (_, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
              borderBottom:`1px solid ${C.border}` }}>
              {forks.map((f, fi) => (
                <div key={fi} style={{ padding:'10px 10px 10px 12px',
                  borderRight: fi===0 ? `1px solid ${C.border}` : 'none',
                  background: fi===0 ? '#fff' : '#F8FBF8' }}>
                  {f.steps[i] ? <>
                    <div style={{ width:18, height:18, borderRadius:99, background:C.primary, color:'#fff',
                      fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center',
                      marginBottom:5, fontFamily:ff }}>{i+1}</div>
                    <div style={{ fontSize:12, color:C.text, fontFamily:ff, lineHeight:1.45 }}>{f.steps[i]}</div>
                  </> : <span style={{ color:C.muted, fontSize:12, fontFamily:ff }}>—</span>}
                </div>
              ))}
            </div>
          ));
        })()
      )}
    </div>
  );
}

// ── ADD RECIPE (voice-first) ──────────────────────────────────────────────────
function AddRecipeScreen({ onBack }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  // states: idle | recording | processing | review
  const [stage, setStage] = React.useState('idle');
  const [transcript, setTranscript] = React.useState('');
  const [pulse, setPulse] = React.useState(false);
  const timerRef = React.useRef(null);

  const DEMO_TRANSCRIPT = "Coconut Chutney — grind half a coconut with two green chillies, a small piece of ginger, and salt. Temper with mustard seeds, urad dal, and curry leaves in coconut oil. Serves four, ready in fifteen minutes.";

  const startRecording = () => {
    setStage('recording');
    setTranscript('');
    setPulse(true);
    let i = 0;
    const words = DEMO_TRANSCRIPT.split(' ');
    timerRef.current = setInterval(() => {
      i++;
      setTranscript(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(timerRef.current);
        setTimeout(() => { setPulse(false); setStage('processing'); }, 600);
        setTimeout(() => setStage('review'), 2000);
      }
    }, 80);
  };

  React.useEffect(() => () => clearInterval(timerRef.current), []);

  const parsedRecipe = {
    name: 'Coconut Chutney',
    category: 'Side Dish',
    time: '15 min',
    serves: '4',
    ingredients: ['½ coconut (grated)', '2 green chillies', '1 piece ginger', 'Salt to taste'],
    steps: ['Grind coconut, green chillies, ginger and salt to a smooth paste.', 'Heat coconut oil. Add mustard seeds and urad dal.', 'Add curry leaves, let splutter. Pour over chutney.'],
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg }}>
      <Header title="New Recipe" onBack={onBack} />

      {/* idle */}
      {stage === 'idle' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', padding:'32px 24px', gap:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:700, color:C.text, fontFamily:ff }}>
              Tell us your recipe
            </div>
            <div style={{ fontSize:14, color:C.muted, marginTop:8, fontFamily:ff, lineHeight:1.55 }}>
              Speak naturally — describe the dish, ingredients, and steps in any order.
            </div>
          </div>

          {/* mic button */}
          <button onClick={startRecording} style={{ position:'relative', width:120, height:120,
            borderRadius:99, background:C.primary, border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 8px 32px ${C.primary}55`, transition:'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
              <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 18v3M9 21h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div style={{ fontSize:13, color:C.muted, fontFamily:ff }}>Tap to start speaking</div>

          <div style={{ width:'100%', height:1, background:C.border, margin:'8px 0' }}/>
          <button style={{ background:'none', border:'none', color:C.muted, fontSize:14,
            cursor:'pointer', fontFamily:ff, textDecoration:'underline' }}>
            Type instead
          </button>
        </div>
      )}

      {/* recording */}
      {stage === 'recording' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
          padding:'32px 24px', gap:20 }}>
          {/* pulsing mic */}
          <div style={{ position:'relative', width:100, height:100, display:'flex',
            alignItems:'center', justifyContent:'center' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                position:'absolute', borderRadius:99, border:`2px solid ${C.primary}`,
                width:100+i*28, height:100+i*28,
                opacity: 0.15/i,
                animation:`pulse-ring ${0.9+i*0.2}s ease-out infinite`,
              }}/>
            ))}
            <div style={{ width:100, height:100, borderRadius:99, background:C.primary,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 6px 24px ${C.primary}44` }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
                <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 18v3M9 21h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div style={{ fontSize:13, fontWeight:600, color:C.primary, fontFamily:ff,
            display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:99, background:C.primary,
              animation:'blink 1s infinite' }}/>
            Listening…
          </div>

          {/* live transcript */}
          <div style={{ width:'100%', background:C.card, borderRadius:16, padding:'16px',
            border:`1px solid ${C.border}`, minHeight:120, flex:1 }}>
            <div style={{ fontSize:14, color:C.text, fontFamily:ff, lineHeight:1.6 }}>
              {transcript}
              <span style={{ display:'inline-block', width:2, height:16, background:C.primary,
                marginLeft:2, animation:'blink 0.9s infinite', verticalAlign:'middle' }}/>
            </div>
          </div>

          <button onClick={() => { clearInterval(timerRef.current); setStage('idle'); setTranscript(''); }}
            style={{ padding:'12px 28px', borderRadius:99, border:`1.5px solid ${C.border}`,
            background:C.card, color:C.mid, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:ff }}>
            Cancel
          </button>
        </div>
      )}

      {/* processing */}
      {stage === 'processing' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:16 }}>
          <div style={{ width:56, height:56, borderRadius:99, border:`3px solid ${C.primarySoft}`,
            borderTopColor:C.primary, animation:'spin 0.8s linear infinite' }}/>
          <div style={{ fontSize:15, color:C.mid, fontFamily:ff }}>Parsing your recipe…</div>
        </div>
      )}

      {/* review */}
      {stage === 'review' && (
        <div style={{ flex:1, overflowY:'auto', paddingBottom:24 }}>
          <div style={{ padding:'12px 16px', background:C.primaryBg,
            borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill={C.primary}/>
              <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize:13, fontWeight:600, color:C.primary, fontFamily:ff }}>
              Recipe parsed! Review and save.
            </span>
          </div>

          {[
            { label:'Name', value:parsedRecipe.name },
            { label:'Category', value:parsedRecipe.category },
            { label:'Cook Time', value:parsedRecipe.time },
            { label:'Serves', value:parsedRecipe.serves },
          ].map((f, i, arr) => (
            <div key={i} style={{ padding:'14px 16px', background:C.card,
              borderBottom:`1px solid ${C.border}`,
              borderTop: i===0 ? `1px solid ${C.border}` : 'none',
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, fontWeight:600, color:C.muted, letterSpacing:0.4,
                textTransform:'uppercase', fontFamily:ff }}>{f.label}</span>
              <span style={{ fontSize:15, color:C.text, fontFamily:ff, fontWeight:500 }}>{f.value}</span>
            </div>
          ))}

          <SectionLabel>Ingredients</SectionLabel>
          <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            {parsedRecipe.ingredients.map((ing, i) => (
              <div key={i} style={{ padding:'11px 16px', display:'flex', gap:10, alignItems:'center',
                borderBottom: i<parsedRecipe.ingredients.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:6, height:6, borderRadius:99, background:C.primary, flexShrink:0 }}/>
                <span style={{ fontSize:14, color:C.text, fontFamily:ff }}>{ing}</span>
              </div>
            ))}
          </div>

          <SectionLabel>Steps</SectionLabel>
          <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            {parsedRecipe.steps.map((step, i) => (
              <div key={i} style={{ padding:'12px 16px', display:'flex', gap:12, alignItems:'flex-start',
                borderBottom: i<parsedRecipe.steps.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:24, height:24, borderRadius:99, background:C.primary, color:'#fff',
                  fontWeight:700, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, fontFamily:ff }}>{i+1}</div>
                <span style={{ fontSize:14, color:C.text, fontFamily:ff, lineHeight:1.55, paddingTop:3 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ padding:'20px 16px', display:'flex', gap:10 }}>
            <button onClick={() => setStage('idle')}
              style={{ flex:1, padding:'14px', borderRadius:14, border:`1.5px solid ${C.border}`,
              background:C.card, color:C.mid, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:ff }}>
              Re-record
            </button>
            <button onClick={onBack}
              style={{ flex:2, padding:'14px', borderRadius:14, border:'none',
              background:C.primary, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:ff }}>
              Save Recipe
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-ring { 0%{transform:scale(0.6);opacity:0.4} 100%{transform:scale(1.3);opacity:0} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function AllRecipesScreen({ navigate }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  const [sort, setSort] = React.useState('name');
  const sorted = [...RECIPES].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) :
    sort === 'time' ? parseInt(a.time) - parseInt(b.time) :
    b.forks.length - a.forks.length
  );
  return (
    <div style={{ height:'100%', overflowY:'auto', background:C.bg, paddingBottom:80 }}>
      <div style={{ padding:'20px 16px 12px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:ff }}>All Recipes</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:2, fontFamily:ff }}>{RECIPES.length} recipes</div>
        </div>
      </div>
      {/* sort pills */}
      <div style={{ display:'flex', gap:8, padding:'0 16px 12px', overflowX:'auto' }}>
        {[['name','A–Z'],['time','Quickest'],['forks','Most Versions']].map(([val, label]) => (
          <button key={val} onClick={() => setSort(val)}
            style={{ padding:'6px 14px', borderRadius:99, fontSize:13, fontWeight:600, flexShrink:0,
              border:`1.5px solid ${sort===val ? C.primary : C.border}`,
              background: sort===val ? C.primaryBg : C.card,
              color: sort===val ? C.primary : C.muted, cursor:'pointer', fontFamily:ff }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        {sorted.map(r => <RecipeRow key={r.id} recipe={r} onPress={() => navigate('recipe', { recipeId:r.id })} />)}
      </div>
    </div>
  );
}

function AuthorsScreen({ navigate }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  return (
    <div style={{ height:'100%', overflowY:'auto', background:C.bg, paddingBottom:80 }}>
      <div style={{ padding:'20px 16px 12px' }}>
        <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:ff }}>Family</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:2, fontFamily:ff }}>
          {MEMBERS.length} members
        </div>
      </div>

      <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        {MEMBERS.map((m, i) => (
          <div key={m.id} onClick={() => navigate('author', { authorId:m.id })}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
              borderBottom: i < MEMBERS.length-1 ? `1px solid ${C.border}` : 'none',
              cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.surface}
            onMouseLeave={e => e.currentTarget.style.background=C.card}>
            <Avatar member={m} size={44} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:15, color:C.text, fontFamily:ff }}>{m.name}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2, fontFamily:ff }}>
                {m.recipes} recipe{m.recipes !== 1 ? 's' : ''}
              </div>
            </div>
            <RoleBadge role={m.role} />
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorScreen({ authorId, navigate, onBack }) {
  const member = MEMBERS.find(m => m.id === authorId);
  const recipes = RECIPES.filter(r => r.forks.some(f => f.authorId === authorId));
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  if (!member) return null;
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg }}>
      <Header title={member.name.split(' ')[0]} onBack={onBack} />
      <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>
        <div style={{ padding:'20px 16px', display:'flex', gap:16, alignItems:'center',
          borderBottom:`1px solid ${C.border}` }}>
          <Avatar member={member} size={64} />
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:C.text, fontFamily:ff }}>{member.name}</div>
            <div style={{ marginTop:4 }}><RoleBadge role={member.role} /></div>
            <div style={{ fontSize:13, color:C.muted, marginTop:6, fontFamily:ff }}>
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} contributed
            </div>
          </div>
        </div>

        <SectionLabel>Recipes</SectionLabel>
        <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
          {recipes.length ? recipes.map(r =>
            <RecipeRow key={r.id} recipe={r} onPress={() => navigate('recipe', { recipeId:r.id })} />)
            : <div style={{ padding:'24px 16px', color:C.muted, fontSize:14, fontFamily:ff }}>No recipes yet.</div>}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ navigate }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  const me = MEMBERS[0];
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div style={{ height:'100%', overflowY:'auto', background:C.bg, paddingBottom:80 }}>
      <div style={{ padding:'20px 16px 12px' }}>
        <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:ff }}>Settings</div>
      </div>

      {/* My Profile */}
      <SectionLabel>My Profile</SectionLabel>
      <div style={{ margin:'0 0', background:C.card, borderTop:`1px solid ${C.border}`,
        borderBottom:`1px solid ${C.border}` }}>
        <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <Avatar member={me} size={48} />
          <div>
            <div style={{ fontWeight:600, fontSize:16, color:C.text, fontFamily:ff }}>{me.name}</div>
            <div style={{ fontSize:12, color:C.muted, fontFamily:ff }}>me@family.com</div>
          </div>
          <div style={{ marginLeft:'auto' }}><RoleBadge role={me.role} /></div>
        </div>
        {[['Display Name', me.name], ['Email', 'me@family.com']].map(([label, val], i) => (
          <div key={i} style={{ padding:'14px 16px', borderTop:`1px solid ${C.border}`,
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:15, color:C.text, fontFamily:ff }}>{label}</span>
            <span style={{ fontSize:14, color:C.muted, fontFamily:ff }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Family Members */}
      <SectionLabel>Family Members</SectionLabel>
      <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        {MEMBERS.map((m, i) => (
          <div key={m.id}>
            <div onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10,
                borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background=C.surface}
              onMouseLeave={e => e.currentTarget.style.background=C.card}>
              <Avatar member={m} size={36} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:500, color:C.text, fontFamily:ff }}>{m.name}</div>
                <div style={{ fontSize:12, color:C.muted, fontFamily:ff }}>{m.recipes} recipes</div>
              </div>
              <RoleBadge role={m.role} />
              {m.id !== 1 && <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{
                transform: expanded===m.id?'rotate(90deg)':'rotate(0)', transition:'transform 0.2s' }}>
                <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            </div>
            {expanded === m.id && m.id !== 1 && (
              <div style={{ background:C.surface, padding:'10px 16px', display:'flex', gap:8,
                borderBottom:`1px solid ${C.border}` }}>
                {['admin','editor','contributor'].map(role => (
                  <button key={role} style={{ padding:'6px 12px', borderRadius:99, fontSize:12, fontWeight:600,
                    border:`1.5px solid ${role===m.role ? ROLE_COLORS[role] : C.border}`,
                    background: role===m.role ? ROLE_COLORS[role]+'20' : C.card,
                    color: role===m.role ? ROLE_COLORS[role] : C.muted,
                    cursor:'pointer', fontFamily:ff }}>
                    {ROLE_LABELS[role]}
                  </button>
                ))}
                <button style={{ marginLeft:'auto', padding:'6px 12px', borderRadius:99, fontSize:12,
                  fontWeight:600, border:`1.5px solid #C84040`, background:'#FFF0F0',
                  color:'#C84040', cursor:'pointer', fontFamily:ff }}>
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
        <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background=C.surface}
          onMouseLeave={e => e.currentTarget.style.background=C.card}>
          <div style={{ width:36, height:36, borderRadius:99, background:C.primaryBg,
            border:`1.5px dashed ${C.primary}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke={C.primary} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize:15, color:C.primary, fontWeight:600, fontFamily:ff }}>
            Invite Family Member
          </span>
        </div>
      </div>

      <SectionLabel>Cookbook</SectionLabel>
      <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        {[['Cookbook Name', 'Vollfood'], ['Default Serves', '4'], ['Language', 'English']].map(([label, val], i, arr) => (
          <div key={i} style={{ padding:'14px 16px', borderBottom: i<arr.length-1?`1px solid ${C.border}`:'none',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:15, color:C.text, fontFamily:ff }}>{label}</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14, color:C.muted, fontFamily:ff }}>{val}</span>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'24px 16px', textAlign:'center' }}>
        <button style={{ color:'#C84040', background:'none', border:'none', fontSize:15,
          fontWeight:600, cursor:'pointer', fontFamily:ff }}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── TAB BAR ──────────────────────────────────────────────────────────────────
function TabBar({ tab, setTab }) {
  const ff = 'Helvetica Neue, Helvetica, Arial, sans-serif';
  const tabs = [
    { id:'home', label:'Home', icon: (active) =>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5H8v5H4a1 1 0 01-1-1V9.5z"
          stroke={active?C.primary:C.muted} strokeWidth="1.8" fill={active?C.primary+'22':'none'} strokeLinejoin="round"/>
      </svg> },
    { id:'all', label:'All Recipes', icon: (active) =>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="2" rx="1" fill={active?C.primary:C.muted}/>
        <rect x="3" y="10" width="16" height="2" rx="1" fill={active?C.primary:C.muted}/>
        <rect x="3" y="16" width="10" height="2" rx="1" fill={active?C.primary:C.muted}/>
      </svg> },
    { id:'authors', label:'Authors', icon: (active) =>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="8" cy="8" r="3.5" stroke={active?C.primary:C.muted} strokeWidth="1.8"/>
        <path d="M1.5 19c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke={active?C.primary:C.muted} strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="16" cy="7" r="2.5" stroke={active?C.primary:C.muted} strokeWidth="1.5"/>
        <path d="M20 17.5c0-2.5-1.8-4.5-4-4.5" stroke={active?C.primary:C.muted} strokeWidth="1.5" strokeLinecap="round"/>
      </svg> },
    { id:'settings', label:'Settings', icon: (active) =>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke={active?C.primary:C.muted} strokeWidth="1.8"/>
        <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42"
          stroke={active?C.primary:C.muted} strokeWidth="1.8" strokeLinecap="round"/>
      </svg> },
  ];
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:72, background:C.tabBg,
      borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center',
      backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', zIndex:100, paddingBottom:8 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'8px 0' }}>
          {t.icon(tab === t.id)}
          <span style={{ fontSize:10, fontWeight:600, color:tab===t.id?C.primary:C.muted, fontFamily:ff }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [tab, setTab] = React.useState('home');
  const [stack, setStack] = React.useState([]);

  const navigate = (screen, params = {}) => setStack(s => [...s, { screen, params }]);
  const goBack = () => setStack(s => s.slice(0, -1));
  const changeTab = (t) => { setTab(t); setStack([]); };

  const currentScreen = stack.length > 0 ? stack[stack.length-1] : null;

  if (!loggedIn) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg }}>
      <LoginScreen onLogin={() => setLoggedIn(true)} />
    </div>
  );

  const renderScreen = () => {
    if (currentScreen) {
      const { screen, params } = currentScreen;
      if (screen === 'category') return <CategoryScreen categoryId={params.categoryId} navigate={navigate} onBack={goBack} />;
      if (screen === 'recipe') return <RecipeScreen recipeId={params.recipeId} navigate={navigate} onBack={goBack} />;
      if (screen === 'author') return <AuthorScreen authorId={params.authorId} navigate={navigate} onBack={goBack} />;
      if (screen === 'add') return <AddRecipeScreen onBack={goBack} />;
    }
    if (tab === 'home') return <HomeScreen navigate={navigate} />;
    if (tab === 'all') return <AllRecipesScreen navigate={navigate} />;
    if (tab === 'authors') return <AuthorsScreen navigate={navigate} />;
    if (tab === 'settings') return <SettingsScreen navigate={navigate} />;
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg, position:'relative' }}>
      {/* safe-area spacer — clears Dynamic Island + status bar */}
      <div style={{ flexShrink:0, height:54 }} />
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {renderScreen()}
      </div>
      {!currentScreen && <TabBar tab={tab} setTab={changeTab} />}
    </div>
  );
}

// Export App to window so DeviceWrapper can render it
Object.assign(window, { VollfoodApp: App });
