/**
 * cookwithACH — Application State and Logic Router
 */

// --- Global App State ---
const state = {
  lang: 'en',
  region: 'Mediterranean',
  theme: 'champagne',
  selectedFilter: 'all',
  
  // Current date set to local time in prompt context (July 2026)
  currentYear: 2026,
  currentMonth: 6, // July (0-indexed)
  todayDate: 4,    // July 4th, 2026
  
  pantryItems: [
    { id: 'p1', name: 'Atlantic Salmon', name_fr: 'Saumon Atlantique', name_es: 'Salmón del Atlántico', qty: '450g', icon: '🐟', matchRecipe: 'r1' },
    { id: 'p2', name: 'Fresh Avocados', name_fr: 'Avocats Frais', name_es: 'Aguacates Frescos', qty: '3 units', icon: '🥑', matchRecipe: 'r2' },
    { id: 'p3', name: 'Organic Spinach', name_fr: 'Épinards Bio', name_es: 'Espinacas Orgánicas', qty: '200g', icon: '🥬', matchRecipe: 'r3' },
    { id: 'p4', name: 'Greek Yogurt', name_fr: 'Yaourt Grec', name_es: 'Yogur Griego', qty: '500g', icon: '🍶', matchRecipe: 'r4' }
  ],
  
  // Recipes with regional specific cultures
  recipes: [
    {
      id: 'r1',
      title: {
        Mediterranean: 'Herbed Salmon with Sage Butter',
        'Asian Fusion': 'Teriyaki Glazed Ginger Salmon',
        'Nordic Clean': 'Dill Cured Poached Salmon',
        'Latin Boutique': 'Chili Lime Seared Salmon'
      },
      category: 'mains',
      calories: '450 kcal',
      prepTime: '25 mins',
      image: 'assets/salmon.jpg',
      ingredients: {
        en: ['Atlantic Salmon', 'Muted Sage Leaves', 'Champagne Butter', 'Lemon Slices'],
        fr: ['Saumon Atlantique', 'Feuilles de Sauge', 'Beurre de Champagne', 'Rondelles de Citron'],
        es: ['Salmón del Atlántico', 'Hojas de Salvia', 'Mantequilla de Champaña', 'Rodajas de Limón']
      }
    },
    {
      id: 'r2',
      title: {
        Mediterranean: 'Avocado Caprese Rose Toast',
        'Asian Fusion': 'Smashed Avocado Wasabi Toast',
        'Nordic Clean': 'Avocado Rye Smørrebrød',
        'Latin Boutique': 'Cilantro Lime Avocado Flatbread'
      },
      category: 'light',
      calories: '310 kcal',
      prepTime: '15 mins',
      image: 'assets/pantry.jpg',
      ingredients: {
        en: ['Fresh Avocados', 'Cherry Tomatoes', 'Sourdough Slice', 'Balsamic Glaze'],
        fr: ['Avocats Frais', 'Tomates Cerises', 'Tranche de Pain', 'Glaçage Balsamique'],
        es: ['Aguacates Frescos', 'Tomates Cherry', 'Rebanada de Pan', 'Glaseado Balsámico']
      }
    },
    {
      id: 'r3',
      title: {
        Mediterranean: 'Dusty Rose Raspberry Tart',
        'Asian Fusion': 'Rose Water Matcha Tartlet',
        'Nordic Clean': 'Wild Berry Sage Pastry',
        'Latin Boutique': 'Raspberry Hibiscus Sweet Crust'
      },
      category: 'sweet',
      calories: '280 kcal',
      prepTime: '35 mins',
      image: 'assets/pastry.jpg',
      ingredients: {
        en: ['Organic Raspberries', 'Rose Water Cream', 'Almond Pastry Shell', 'Sugar Dust'],
        fr: ['Framboises Bio', 'Crème à l\'Eau de Rose', 'Pâte Sablée aux Amandes', 'Sucre Glace'],
        es: ['Frambuesas Orgánicas', 'Crema de Agua de Rosas', 'Masa de Almendras', 'Azúcar en Polvo']
      }
    },
    {
      id: 'r4',
      title: {
        Mediterranean: 'Cucumber Dill Yogurt Bowl',
        'Asian Fusion': 'Cardamom Honey Yogurt Pot',
        'Nordic Clean': 'Skyr Style Seeded Bowl',
        'Latin Boutique': 'Papaya Lime Yogurt Mousse'
      },
      category: 'light',
      calories: '180 kcal',
      prepTime: '10 mins',
      image: 'assets/pantry.jpg',
      ingredients: {
        en: ['Greek Yogurt', 'English Cucumber', 'Fresh Dill', 'Cold Pressed Olive Oil'],
        fr: ['Yaourt Grec', 'Concombre', 'Aneth Frais', 'Huile d\'Olive Vierge'],
        es: ['Yogur Griego', 'Pepino', 'Eneldo Fresco', 'Aceite de Oliva Extra Virgen']
      }
    }
  ],
  
  // Planned/scheduled meals keyed by date e.g. "2026-07-04" => [{time: "dinner", title: "Salmon", type: "recipe", id: "r1"}]
  scheduledMeals: {}
};

// --- Translations & Localization Dictionaries ---
const locales = {
  en: {
    loading_tagline: 'Tailoring your culinary concierge...',
    header_subtitle: 'Your culinary menu is ready',
    pantry_title: 'My Pantry',
    pantry_desc: 'Tap an ingredient for quick-plan matching, or plan it in one tap.',
    weekly_title: 'This Week',
    discovery_title: 'Recipe Discovery',
    planner_title: 'ACH Planner',
    settings_title: 'Concierge Settings',
    group_regional: 'Regional Preferences',
    label_region: 'Culinary Region',
    desc_region: 'Influences default culture labeling & cards',
    group_language: 'Language & Tone',
    label_lang: 'App Language',
    desc_lang: 'Select UI localization language',
    group_preferences: 'Aesthetic Theme',
    label_theme: 'Color Atmosphere',
    desc_theme: 'Soft champagne or dusty rose tones',
    theme_champagne: 'Champagne',
    theme_rose: 'Rose Soft',
    shelf_title: 'Drag & Drop Meals',
    shelf_hint: 'Drag onto any day cell',
    modal_title: 'Plan a Custom Meal',
    modal_cancel: 'Cancel',
    modal_save: 'Schedule',
    nav_dashboard: 'Dashboard',
    nav_discovery: 'Discover',
    nav_planner: 'Planner',
    nav_settings: 'Settings',
    search_placeholder: 'What are you craving tonight?',
    concierge_today: "Today's Focus",
    no_meals: 'No meals planned yet',
    no_meals_desc: 'Select an ingredient from My Pantry below or explore recipes to schedule dinner.',
    toast_scheduled: 'Scheduled successfully for July',
    quick_plan_btn: '1-Tap Plan',
    filter_all: 'All',
    filter_mains: 'Mains',
    filter_light: 'Light Eats',
    filter_sweet: 'Sweet Tarts',
    ai_concierge_title: 'ACH AI Concierge',
    ai_concierge_intro: 'Welcome back Alexandra. I see you have Atlantic Salmon and Fresh Avocados in your pantry. I suggest planning a warm culinary evening with:',
    ai_concierge_action: 'Plan dinner for today'
  },
  fr: {
    loading_tagline: 'Préparation de votre conciergerie...',
    header_subtitle: 'Votre menu culinaire est prêt',
    pantry_title: 'Mon Garde-Manger',
    pantry_desc: 'Appuyez sur un ingrédient pour planifier, ou planifiez en un clic.',
    weekly_title: 'Cette Semaine',
    discovery_title: 'Découverte de Recettes',
    planner_title: 'Planificateur ACH',
    settings_title: 'Configuration Concierge',
    group_regional: 'Préférences Régionales',
    label_region: 'Région Culinaire',
    desc_region: 'Modifie l\'origine culturelle des recettes',
    group_language: 'Langue & Ton',
    label_lang: 'Langue de l\'App',
    desc_lang: 'Choisissez la langue de l\'interface',
    group_preferences: 'Thème Esthétique',
    label_theme: 'Atmosphère de Couleur',
    desc_theme: 'Tons champagne doux ou rose poudré',
    theme_champagne: 'Champagne',
    theme_rose: 'Rose Doux',
    shelf_title: 'Glisser-Déposer les Repas',
    shelf_hint: 'Glissez sur une cellule de jour',
    modal_title: 'Planifier un Repas Personnalisé',
    modal_cancel: 'Annuler',
    modal_save: 'Planifier',
    nav_dashboard: 'Tableau',
    nav_discovery: 'Découvrir',
    nav_planner: 'Calendrier',
    nav_settings: 'Options',
    search_placeholder: 'Qu\'aimeriez-vous manger ce soir ?',
    concierge_today: 'Objectif du Jour',
    no_meals: 'Aucun repas planifié',
    no_meals_desc: 'Sélectionnez un ingrédient du garde-manger ou découvrez nos recettes.',
    toast_scheduled: 'Planifié avec succès pour le juillet',
    quick_plan_btn: 'Planifier',
    filter_all: 'Tout',
    filter_mains: 'Plats',
    filter_light: 'Léger',
    filter_sweet: 'Douceurs',
    ai_concierge_title: 'ACH Assistant IA',
    ai_concierge_intro: 'Bienvenue Alexandra. Je vois du Saumon Atlantique et des Avocats Frais dans votre cuisine. Je vous suggère de planifier un dîner avec :',
    ai_concierge_action: 'Planifier le dîner d\'aujourd\'hui'
  },
  es: {
    loading_tagline: 'Preparando su asistente culinario...',
    header_subtitle: 'Su menú personalizado está listo',
    pantry_title: 'Mi Alacena',
    pantry_desc: 'Toque un ingrediente para buscar, o planifíquelo en un toque.',
    weekly_title: 'Esta Semana',
    discovery_title: 'Descubrir Recetas',
    planner_title: 'Planificador ACH',
    settings_title: 'Ajustes Concierge',
    group_regional: 'Preferencias Regionales',
    label_region: 'Región Culinaria',
    desc_region: 'Influye en las etiquetas de origen y recetas',
    group_language: 'Idioma y Tono',
    label_lang: 'Idioma de la App',
    desc_lang: 'Seleccione el idioma de la interfaz',
    group_preferences: 'Tema Estético',
    label_theme: 'Atmósfera de Color',
    desc_theme: 'Tonos champagne suave o rosa empolvado',
    theme_champagne: 'Champaña',
    theme_rose: 'Rosa Suave',
    shelf_title: 'Arrastrar y Soltar',
    shelf_hint: 'Arrastre a cualquier día del mes',
    modal_title: 'Planificar Comida Personalizada',
    modal_cancel: 'Cancelar',
    modal_save: 'Programar',
    nav_dashboard: 'Panel',
    nav_discovery: 'Descubrir',
    nav_planner: 'Calendario',
    nav_settings: 'Ajustes',
    search_placeholder: '¿Qué se le antoja comer hoy?',
    concierge_today: 'Foco de Hoy',
    no_meals: 'Sin comidas programadas',
    no_meals_desc: 'Elija un ingrediente de su alacena o busque recetas para programar.',
    toast_scheduled: 'Programado con éxito para julio',
    quick_plan_btn: 'Programar',
    filter_all: 'Todo',
    filter_mains: 'Platos',
    filter_light: 'Ligeros',
    filter_sweet: 'Postres',
    ai_concierge_title: 'ACH Asistente IA',
    ai_concierge_intro: 'Bienvenida Alexandra. Veo que tiene Salmón del Atlántico y Aguacates Frescos en su alacena. Le sugiero planificar una noche con:',
    ai_concierge_action: 'Programar cena para hoy'
  }
};

// --- DOM References ---
const dom = {
  splash: document.getElementById('splash-screen'),
  screens: document.querySelectorAll('.screen-view'),
  navItems: document.querySelectorAll('.nav-item'),
  headerGreeting: document.getElementById('header-greeting'),
  pantryGrid: document.getElementById('pantry-grid'),
  weeklyRow: document.getElementById('weekly-overview-row'),
  recipeFeed: document.getElementById('recipe-feed'),
  calendarGrid: document.getElementById('calendar-grid'),
  shelfItems: document.getElementById('shelf-items'),
  plannedCount: document.getElementById('planned-count-badge'),
  monthDisplay: document.getElementById('current-month-display'),
  
  // Controls & Settings
  regionSelect: document.getElementById('setting-region'),
  langButtons: document.querySelectorAll('#setting-lang .toggle-btn'),
  themeButtons: document.querySelectorAll('#setting-theme .toggle-btn'),
  
  // Drawer
  drawerOverlay: document.getElementById('drawer-overlay'),
  drawer: document.getElementById('bottom-drawer'),
  drawerContent: document.getElementById('drawer-content'),
  conciergeTrigger: document.getElementById('concierge-trigger'),
  aiGenerateBtn: document.getElementById('ai-generate-btn'),
  
  // Modal Popup
  modalOverlay: document.getElementById('modal-overlay'),
  modal: document.getElementById('quick-add-modal'),
  modalMealName: document.getElementById('modal-meal-name'),
  modalTimeBtns: document.querySelectorAll('.modal-time-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  modalSaveBtn: document.getElementById('modal-save-btn'),
  
  // Toast
  toast: document.getElementById('toast-notification'),
  toastMessage: document.querySelector('.toast-message'),
  
  // Filter Chips
  filterChips: document.querySelectorAll('.filter-chips .chip')
};

// Variable to track which calendar day cell is currently being quick-edited
let selectedCalendarDay = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hide Splash Screen after delay
  setTimeout(() => {
    dom.splash.style.opacity = 0;
    setTimeout(() => dom.splash.style.display = 'none', 500);
  }, 2200);

  // 2. Setup Routing Navigation Click Listeners
  dom.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      navigateTo(target);
    });
  });

  // 3. Setup Filter Chips for Discovery
  dom.filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dom.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedFilter = chip.dataset.filter;
      renderDiscoveryFeed();
    });
  });

  // 4. Setup Settings Listeners
  dom.regionSelect.addEventListener('change', (e) => {
    state.region = e.target.value;
    renderDiscoveryFeed();
    renderQuickShelf();
    updateLocalization();
  });

  dom.langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lang = btn.dataset.lang;
      updateLocalization();
    });
  });

  dom.themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.theme = btn.dataset.theme;
      if (state.theme === 'rose') {
        document.body.classList.add('theme-rose');
      } else {
        document.body.classList.remove('theme-rose');
      }
    });
  });

  // 5. Setup AI Concierge & Sparkle Triggers
  dom.conciergeTrigger.addEventListener('click', triggerAIConcierge);
  dom.aiGenerateBtn.addEventListener('click', triggerAIConcierge);
  dom.drawerOverlay.addEventListener('click', closeDrawer);

  // 6. Setup Modal Popup Events
  dom.modalOverlay.addEventListener('click', closeModal);
  dom.modalCancelBtn.addEventListener('click', closeModal);
  dom.modalTimeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.modalTimeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  dom.modalSaveBtn.addEventListener('click', saveModalMeal);

  // 7. Initial Data Renders
  renderPantry();
  renderWeeklyWidget();
  renderDiscoveryFeed();
  renderCalendar();
  renderQuickShelf();
  updateLocalization();
  
  // Initialize lucide icon markup replacement
  lucide.createIcons();
});

// --- View Router Navigation ---
function navigateTo(targetScreenId) {
  dom.screens.forEach(screen => {
    screen.classList.remove('active');
  });
  dom.navItems.forEach(item => {
    item.classList.remove('active');
  });

  const activeScreen = document.getElementById(`screen-${targetScreenId}`);
  const activeNav = document.querySelector(`.nav-item[data-target="${targetScreenId}"]`);
  
  if (activeScreen) activeScreen.classList.add('active');
  if (activeNav) activeNav.classList.add('active');

  // Trigger refresh of structures if needed
  if (targetScreenId === 'planner') {
    renderCalendar();
  }
}

// --- Render Pantry Grid ---
function renderPantry() {
  dom.pantryGrid.innerHTML = '';
  state.pantryItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'pantry-item';
    
    // Support translation for ingredient names
    let displayName = item.name;
    if (state.lang === 'fr') displayName = item.name_fr;
    if (state.lang === 'es') displayName = item.name_es;

    card.innerHTML = `
      <div class="pantry-icon-container">${item.icon}</div>
      <div class="pantry-name">${displayName}</div>
      <div class="pantry-qty">${item.qty}</div>
      <button class="pantry-btn-plan" data-recipe-id="${item.matchRecipe}">
        <i data-lucide="sparkles"></i> 
        <span>${locales[state.lang].quick_plan_btn}</span>
      </button>
    `;

    // Click pantry card triggers details
    card.addEventListener('click', (e) => {
      if (e.target.closest('.pantry-btn-plan')) return;
      openPantryDetails(item);
    });

    // Plan in 1-Tap button
    card.querySelector('.pantry-btn-plan').addEventListener('click', (e) => {
      e.stopPropagation();
      planMealInOneTap(item.matchRecipe);
    });

    dom.pantryGrid.appendChild(card);
  });
  lucide.createIcons();
}

// --- One-Tap Quick Plan Logic ---
function planMealInOneTap(recipeId) {
  const recipe = state.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const dateStr = `2026-07-${String(state.todayDate).padStart(2, '0')}`;
  
  if (!state.scheduledMeals[dateStr]) {
    state.scheduledMeals[dateStr] = [];
  }
  
  const title = recipe.title[state.region];
  state.scheduledMeals[dateStr].push({
    time: 'dinner',
    title: title,
    type: 'recipe',
    id: recipeId
  });

  // Trigger sound effect or visually pleasing feedback
  showToast(`${locales[state.lang].toast_scheduled} ${state.todayDate}: ${title}`);
  
  // Refresh UI Components
  renderCalendar();
  renderWeeklyWidget();
  updateTodayDashboardCard();
}

// --- Render Weekly Widget Row (Dashboard) ---
function renderWeeklyWidget() {
  dom.weeklyRow.innerHTML = '';
  // Show 5 days surrounding today
  const daysToShow = [2, 3, 4, 5, 6];
  const dayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  };

  daysToShow.forEach(dayNum => {
    const dayCol = document.createElement('div');
    dayCol.className = 'weekly-day';
    if (dayNum === state.todayDate) {
      dayCol.classList.add('today');
    }

    const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
    const meals = state.scheduledMeals[dateStr] || [];
    if (meals.length > 0) {
      dayCol.classList.add('planned');
    }

    // July 2026 starts on Wednesday (day 3 is Friday, day 4 is Saturday)
    // Date July 1st is Wednesday (index 3).
    // Let's compute day name index: (3 + dayNum - 1) % 7
    const dayNameIndex = (3 + dayNum - 1) % 7;
    const nameStr = dayNames[state.lang][dayNameIndex];

    dayCol.innerHTML = `
      <span class="weekly-day-name">${nameStr}</span>
      <span class="weekly-day-num">${dayNum}</span>
      <div class="weekly-day-dot"></div>
    `;

    dayCol.addEventListener('click', () => {
      // Navigate to planner screen and highlight the clicked day
      navigateTo('planner');
    });

    dom.weeklyRow.appendChild(dayCol);
  });
}

// --- Update Dashboard Announcement Card ---
function updateTodayDashboardCard() {
  const dateStr = `2026-07-${String(state.todayDate).padStart(2, '0')}`;
  const meals = state.scheduledMeals[dateStr] || [];
  
  const titleEl = document.getElementById('today-plan-title');
  const descEl = document.getElementById('today-plan-desc');
  
  if (meals.length > 0) {
    const meal = meals[0]; // Get first planned meal
    titleEl.textContent = meal.title;
    descEl.textContent = `Scheduled for ${meal.time.toUpperCase()} tonight. Bon appétit!`;
  } else {
    titleEl.textContent = locales[state.lang].no_meals;
    descEl.textContent = locales[state.lang].no_meals_desc;
  }
}

// --- Render Recipe Discovery Feed ---
function renderDiscoveryFeed() {
  dom.recipeFeed.innerHTML = '';
  
  const filtered = state.recipes.filter(r => {
    if (state.selectedFilter === 'all') return true;
    return r.category === state.selectedFilter;
  });

  filtered.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('draggable', 'true');
    
    // Bind DragStart for interactive planner integration
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: recipe.id,
        title: recipe.title[state.region],
        type: 'recipe'
      }));
    });

    card.innerHTML = `
      <div class="recipe-card-img-container">
        <img src="${recipe.image}" alt="${recipe.title[state.region]}" class="recipe-img">
        <div class="recipe-card-overlay">${recipe.calories}</div>
      </div>
      <div class="recipe-card-info">
        <div class="recipe-origin">${state.region} Selection</div>
        <h3 class="recipe-title">${recipe.title[state.region]}</h3>
        <div class="recipe-meta-row">
          <div class="recipe-meta-item">
            <i data-lucide="clock"></i>
            <span>${recipe.prepTime}</span>
          </div>
          <div class="recipe-meta-item">
            <i data-lucide="flame"></i>
            <span>${recipe.calories}</span>
          </div>
        </div>
      </div>
      <button class="recipe-quick-add-btn" title="Add to planner">
        <i data-lucide="plus"></i>
      </button>
    `;

    // Click recipe cards to view detail sheets
    card.addEventListener('click', (e) => {
      if (e.target.closest('.recipe-quick-add-btn')) return;
      openRecipeDetails(recipe);
    });

    // Add button directly schedules for today
    card.querySelector('.recipe-quick-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      planMealInOneTap(recipe.id);
    });

    dom.recipeFeed.appendChild(card);
  });

  lucide.createIcons();
}

// --- Render ACH Full-Month Calendar Grid ---
function renderCalendar() {
  dom.calendarGrid.innerHTML = '';
  
  // July 2026 starts on a Wednesday (3 empty cells offset)
  const offset = 3;
  const daysInMonth = 31;
  let plannedCount = 0;

  // Render empty padding cells for month offset
  for (let i = 0; i < offset; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell pad-cell';
    dom.calendarGrid.appendChild(emptyCell);
  }

  // Render 31 day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell current-month-day';
    
    if (d === state.todayDate) {
      cell.classList.add('today-cell');
    }

    const dateStr = `2026-07-${String(d).padStart(2, '0')}`;
    const meals = state.scheduledMeals[dateStr] || [];
    
    if (meals.length > 0) {
      cell.classList.add('has-meal');
      plannedCount += meals.length;
    }

    cell.innerHTML = `
      <span class="day-number">${d}</span>
      <div class="day-meal-indicator" title="${meals.map(m => m.title).join(', ')}"></div>
      <span class="day-quick-add">+</span>
    `;

    // Drag-and-drop event listeners
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      cell.classList.add('drag-over');
    });

    cell.addEventListener('dragleave', () => {
      cell.classList.remove('drag-over');
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      
      try {
        const rawData = e.dataTransfer.getData('text/plain');
        if (rawData) {
          const item = JSON.parse(rawData);
          if (!state.scheduledMeals[dateStr]) {
            state.scheduledMeals[dateStr] = [];
          }
          state.scheduledMeals[dateStr].push({
            time: 'dinner',
            title: item.title,
            type: item.type,
            id: item.id
          });
          
          showToast(`${locales[state.lang].toast_scheduled} ${d}: ${item.title}`);
          renderCalendar();
          renderWeeklyWidget();
          updateTodayDashboardCard();
        }
      } catch (err) {
        console.error('Drop handling failed', err);
      }
    });

    // Clicking day cell triggers Quick Custom Add modal
    cell.addEventListener('click', () => {
      selectedCalendarDay = d;
      openQuickAddModal(d, meals);
    });

    dom.calendarGrid.appendChild(cell);
  }

  // Update planned items count label
  dom.plannedCount.textContent = `${plannedCount} planned`;
}

// --- Render Quick Shelf (Draggables) ---
function renderQuickShelf() {
  dom.shelfItems.innerHTML = '';
  
  // Draggable shelf shortcuts (uses current region's titles)
  state.recipes.forEach(recipe => {
    const shelfBtn = document.createElement('div');
    shelfBtn.className = 'shelf-item';
    shelfBtn.setAttribute('draggable', 'true');
    
    shelfBtn.innerHTML = `
      <i data-lucide="grip-vertical"></i>
      <span>${recipe.title[state.region].split(' with ')[0]}</span>
    `;

    shelfBtn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: recipe.id,
        title: recipe.title[state.region],
        type: 'recipe'
      }));
    });

    dom.shelfItems.appendChild(shelfBtn);
  });
  
  lucide.createIcons();
}

// --- Pantry Ingredient Detail Drawer ---
function openPantryDetails(ingredient) {
  let displayName = ingredient.name;
  if (state.lang === 'fr') displayName = ingredient.name_fr;
  if (state.lang === 'es') displayName = ingredient.name_es;

  // Find matching recipe
  const matchingRecipe = state.recipes.find(r => r.id === ingredient.matchRecipe);
  const recipeTitle = matchingRecipe ? matchingRecipe.title[state.region] : 'N/A';

  dom.drawerContent.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-title-col">
        <span class="drawer-origin">${state.region} Pantry Focus</span>
        <h2 class="drawer-title">${displayName}</h2>
      </div>
    </div>
    
    <img src="assets/pantry.jpg" alt="Pantry" class="drawer-image">
    
    <div class="drawer-meta-row">
      <div class="drawer-meta-pill">
        <i data-lucide="package"></i>
        <span>Stock: ${ingredient.qty}</span>
      </div>
      <div class="drawer-meta-pill">
        <i data-lucide="tag"></i>
        <span>Fresh Ingredient</span>
      </div>
    </div>
    
    <h3 class="drawer-section-title">Matching Concierge Suggestion</h3>
    <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 16px;">
      We detected this ingredient in your pantry. We recommend matching it with <strong>${recipeTitle}</strong>.
    </p>
    
    <button class="drawer-plan-action-btn" id="drawer-instant-schedule-btn">
      Schedule Meal for Today
    </button>
  `;

  document.getElementById('drawer-instant-schedule-btn').addEventListener('click', () => {
    planMealInOneTap(ingredient.matchRecipe);
    closeDrawer();
  });

  openDrawer();
}

// --- Recipe Detail Drawer ---
function openRecipeDetails(recipe) {
  const currentTitle = recipe.title[state.region];
  const listItems = recipe.ingredients[state.lang] || recipe.ingredients.en;
  
  dom.drawerContent.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-title-col">
        <span class="drawer-origin">${state.region} Kitchen</span>
        <h2 class="drawer-title">${currentTitle}</h2>
      </div>
    </div>
    
    <img src="${recipe.image}" alt="${currentTitle}" class="drawer-image">
    
    <div class="drawer-meta-row">
      <div class="drawer-meta-pill">
        <i data-lucide="clock"></i>
        <span>${recipe.prepTime}</span>
      </div>
      <div class="drawer-meta-pill">
        <i data-lucide="flame"></i>
        <span>${recipe.calories}</span>
      </div>
    </div>
    
    <h3 class="drawer-section-title">Ingredients</h3>
    <ul class="drawer-ingredients">
      ${listItems.map(ing => `
        <li>
          <i data-lucide="check"></i>
          <span>${ing}</span>
        </li>
      `).join('')}
    </ul>
    
    <button class="drawer-plan-action-btn" id="drawer-schedule-recipe-btn">
      Schedule Meal for Today
    </button>
  `;

  document.getElementById('drawer-schedule-recipe-btn').addEventListener('click', () => {
    planMealInOneTap(recipe.id);
    closeDrawer();
  });

  openDrawer();
}

// --- AI Concierge Drawer Trigger ---
function triggerAIConcierge() {
  const salmonTitle = state.recipes[0].title[state.region];
  
  dom.drawerContent.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-title-col">
        <span class="drawer-origin" data-localize="ai_concierge_title">ACH AI Concierge</span>
        <h2 class="drawer-title" style="font-family: var(--font-serif); font-size: 24px; color: var(--color-dusty-rose);">
          Your Personal Menu Concept
        </h2>
      </div>
    </div>
    
    <div style="background-color: var(--color-champagne-bg); border-radius: 16px; padding: 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.5; color: var(--color-text-charcoal); border: 1px solid var(--color-border);">
      <p data-localize="ai_concierge_intro">${locales[state.lang].ai_concierge_intro}</p>
      <div style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">🐟</span>
        <strong>${salmonTitle}</strong>
      </div>
    </div>
    
    <button class="drawer-plan-action-btn" id="ai-accept-plan-btn" data-localize="ai_concierge_action">
      Plan dinner for today
    </button>
  `;

  document.getElementById('ai-accept-plan-btn').addEventListener('click', () => {
    planMealInOneTap('r1');
    closeDrawer();
  });

  openDrawer();
}

// --- Drawer Open/Close UI Helper ---
function openDrawer() {
  dom.drawerOverlay.classList.add('active');
  dom.drawer.classList.add('active');
  lucide.createIcons();
}

function closeDrawer() {
  dom.drawerOverlay.classList.remove('active');
  dom.drawer.classList.remove('active');
}

// --- Modal Popup Helpers ---
function openQuickAddModal(dayNum, existingMeals) {
  dom.modalOverlay.classList.add('active');
  dom.modal.classList.add('active');
  
  // Set placeholders and defaults
  dom.modalMealName.value = existingMeals.length > 0 ? existingMeals[0].title : '';
  dom.modalMealName.focus();
}

function closeModal() {
  dom.modalOverlay.classList.remove('active');
  dom.modal.classList.remove('active');
}

function saveModalMeal() {
  const mealName = dom.modalMealName.value.trim();
  if (!mealName) {
    closeModal();
    return;
  }

  const activeTimeBtn = document.querySelector('.modal-time-btn.active');
  const mealTime = activeTimeBtn ? activeTimeBtn.dataset.time : 'dinner';
  const dateStr = `2026-07-${String(selectedCalendarDay).padStart(2, '0')}`;

  if (!state.scheduledMeals[dateStr]) {
    state.scheduledMeals[dateStr] = [];
  }

  // Save the custom meal entry
  state.scheduledMeals[dateStr].push({
    time: mealTime,
    title: mealName,
    type: 'custom',
    id: 'custom-' + Date.now()
  });

  showToast(`${locales[state.lang].toast_scheduled} ${selectedCalendarDay}: ${mealName}`);
  
  closeModal();
  renderCalendar();
  renderWeeklyWidget();
  updateTodayDashboardCard();
}

// --- Toast Notification Display ---
function showToast(message) {
  dom.toastMessage.textContent = message;
  dom.toast.classList.add('active');
  setTimeout(() => {
    dom.toast.classList.remove('active');
  }, 3000);
}

// --- Translation/Localization Core ---
function updateLocalization() {
  // Update Header greeting based on language
  const greetings = {
    en: 'Hello, Beautiful',
    fr: 'Bonjour, Alexandra',
    es: 'Hola, Alexandra'
  };
  dom.headerGreeting.textContent = greetings[state.lang];

  // Map each HTML tag with [data-localize] to corresponding translation key
  const elements = document.querySelectorAll('[data-localize]');
  elements.forEach(el => {
    const key = el.dataset.localize;
    if (locales[state.lang] && locales[state.lang][key]) {
      el.textContent = locales[state.lang][key];
    }
  });

  // Map placeholders
  const placeholderInputs = document.querySelectorAll('[data-placeholder]');
  placeholderInputs.forEach(input => {
    const key = input.dataset.placeholder;
    if (locales[state.lang] && locales[state.lang][key]) {
      input.setAttribute('placeholder', locales[state.lang][key]);
    }
  });

  // Update dynamic content elements
  renderPantry();
  renderWeeklyWidget();
  updateTodayDashboardCard();
}
