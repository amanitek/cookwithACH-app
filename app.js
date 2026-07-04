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
  
  pantryItems: JSON.parse(localStorage.getItem('cookwithach_pantry')) || [
    { id: 'p1', name: 'Atlantic Salmon', name_fr: 'Saumon Atlantique', name_es: 'Salmón del Atlántico', name_ar: 'سلمون أطلسي', qty: '450g', icon: '🐟', matchRecipe: 'r1' },
    { id: 'p2', name: 'Fresh Avocados', name_fr: 'Avocats Frais', name_es: 'Aguacates Frescos', name_ar: 'أفوكادو طازج', qty: '3 units', icon: '🥑', matchRecipe: 'r2' },
    { id: 'p3', name: 'Organic Spinach', name_fr: 'Épinards Bio', name_es: 'Espinacas Orgánicas', name_ar: 'سبانخ عضوية', qty: '200g', icon: '🥬', matchRecipe: 'r3' },
    { id: 'p4', name: 'Greek Yogurt', name_fr: 'Yaourt Grec', name_es: 'Yogur Griego', name_ar: 'زبادي يوناني', qty: '500g', icon: '🍶', matchRecipe: 'r4' }
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
  scheduledMeals: JSON.parse(localStorage.getItem('cookwithach_scheduled')) || {}
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
    ai_concierge_action: 'Plan dinner for today',
    batch_badge: 'Batch Cooking Planner',
    batch_title: 'Plan Your Week in 1 Hour',
    batch_desc: 'Cook 4 healthy, premium meals simultaneously for the fridge.'
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
    ai_concierge_action: 'Planifier le dîner d\'aujourd\'hui',
    batch_badge: 'Planificateur Batch Cooking',
    batch_title: 'Cuisinez votre semaine en 1 heure',
    batch_desc: 'Préparez 4 plats sains simultanément pour le réfrigérateur.'
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
    ai_concierge_intro: 'Bienvenida mi Reina. Veo que tiene Salmón del Atlántico y Aguacates Frescos en su alacena. Le sugiero planificar una noche con:',
    ai_concierge_action: 'Programar cena para hoy',
    batch_badge: 'Planificación de Lote',
    batch_title: 'Planifique su semana en 1 hora',
    batch_desc: 'Cocine 4 comidas saludables simultáneamente para el refrigerador.'
  },
  ar: {
    loading_tagline: 'جاري تخصيص مساعدكِ الفاخر...',
    header_subtitle: 'قائمتكِ الشهية جاهزة الآن',
    pantry_title: 'مخزني الخاص',
    pantry_desc: 'اضغطي على المكونات للتخطيط السريع، أو خططي بلمسة واحدة.',
    weekly_title: 'هذا الأسبوع',
    discovery_title: 'استكشاف الوصفات',
    planner_title: 'مخطط ACH الفاخر',
    settings_title: 'إعدادات المساعد',
    group_regional: 'التفضيلات الإقليمية',
    label_region: 'الإقليم الطهي',
    desc_region: 'يؤثر على تصنيفات الأصل والوصفات',
    group_language: 'اللغة والنبرة',
    label_lang: 'لغة التطبيق',
    desc_lang: 'اختر لغة واجهة المستخدم',
    group_preferences: 'السمات الجمالية',
    label_theme: 'أجواء الألوان',
    desc_theme: 'شامبانيا ناعمة أو درجات الوردي المخملي',
    theme_champagne: 'شامبانيا',
    theme_rose: 'وردي ناعم',
    shelf_title: 'سحب وإسقاط الوجبات',
    shelf_hint: 'اسحبي الوجبة وضعيها في أي يوم',
    modal_title: 'تخطيط وجبة مخصصة',
    modal_cancel: 'إلغاء',
    modal_save: 'جدولة',
    nav_dashboard: 'لوحة التحكم',
    nav_discovery: 'استكشاف',
    nav_planner: 'المخطط',
    nav_settings: 'الإعدادات',
    search_placeholder: 'ما الذي تشتهينه الليلة يا جلالة الملكة؟',
    concierge_today: 'تركيز اليوم',
    no_meals: 'لا توجد وجبات مخططة بعد',
    no_meals_desc: 'اختاري مكوناً من المخزن أو استكشفي الوصفات لجدولة العشاء.',
    toast_scheduled: 'تمت الجدولة بنجاح لشهر يوليو',
    quick_plan_btn: 'خططي بلمسة',
    filter_all: 'الكل',
    filter_mains: 'الأطباق الرئيسية',
    filter_light: 'وجبات خفيفة',
    filter_sweet: 'حلويات',
    ai_concierge_title: 'مساعد الذكاء الاصطناعي الفاخر',
    ai_concierge_intro: 'أهلاً بكِ يا جلالة الملكة. أرى أن لديكِ السلمون الأطلسي والأفوكادو الطازج في المخزن. أقترح عليكِ التخطيط لأمسية طهي دافئة مع:',
    ai_concierge_action: 'خططي للعشاء اليوم',
    batch_badge: 'مخطط الطهي الجماعي',
    batch_title: 'خططي لوجبات أسبوعكِ في ساعة واحدة',
    batch_desc: 'اطهي 4 وجبات صحية وراقية معاً لحفظها في الثلاجة.'
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
  batchCookTrigger: document.getElementById('batch-cook-trigger'),
  
  // Header Language Switcher
  headerLangBtn: document.getElementById('header-lang-btn'),
  headerLangLabel: document.getElementById('header-lang-label'),
  
  // Pantry CRUD Dialog Elements
  addPantryItemBtn: document.getElementById('add-pantry-item-btn'),
  pantryModalOverlay: document.getElementById('pantry-modal-overlay'),
  pantryModal: document.getElementById('pantry-item-modal'),
  pantryModalTitle: document.getElementById('pantry-modal-title'),
  pantryItemNameInput: document.getElementById('pantry-item-name'),
  pantryItemQtyInput: document.getElementById('pantry-item-qty'),
  pantryItemEmojiSelect: document.getElementById('pantry-item-emoji'),
  pantryModalCancelBtn: document.getElementById('pantry-modal-cancel-btn'),
  pantryModalSaveBtn: document.getElementById('pantry-modal-save-btn'),
  
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

// Track editing state for pantry CRUD
let editingPantryItemId = null;

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

  // Setup Header Language Switcher
  if (dom.headerLangBtn) {
    dom.headerLangBtn.addEventListener('click', () => {
      state.lang = state.lang === 'en' ? 'fr' : (state.lang === 'fr' ? 'es' : (state.lang === 'es' ? 'ar' : 'en'));
      updateLocalization();
    });
  }

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
  if (dom.batchCookTrigger) {
    dom.batchCookTrigger.addEventListener('click', triggerBatchCookingPlan);
  }
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
  // Setup Pantry CRUD Modal Events
  if (dom.addPantryItemBtn) {
    dom.addPantryItemBtn.addEventListener('click', () => showPantryModal());
  }
  if (dom.pantryModalOverlay) {
    dom.pantryModalOverlay.addEventListener('click', closePantryModal);
  }
  if (dom.pantryModalCancelBtn) {
    dom.pantryModalCancelBtn.addEventListener('click', closePantryModal);
  }
  if (dom.pantryModalSaveBtn) {
    dom.pantryModalSaveBtn.addEventListener('click', savePantryItem);
  }
  if (dom.pantryItemNameInput) {
    dom.pantryItemNameInput.addEventListener('change', () => {
      const val = dom.pantryItemNameInput.value;
      let emoji = '🌿';
      if (['Organic Spinach', 'Eggplant', 'Peppers', 'Zucchini', 'Carrots', 'Jute Leaves (Mloukhia)'].includes(val)) emoji = '🥬';
      if (['Tomato'].includes(val)) emoji = '🍅';
      if (['Lemon'].includes(val)) emoji = '🍋';
      if (['Fresh Avocados'].includes(val)) emoji = '🥑';
      if (['Atlantic Salmon', 'Fresh Tuna', 'Sea Bass'].includes(val)) emoji = '🐟';
      if (['Shrimp'].includes(val)) emoji = '🍤';
      if (['Beef Steak', 'Minced Meat', 'Lamb Chops'].includes(val)) emoji = '🥩';
      if (['Chicken Breast'].includes(val)) emoji = '🍗';
      if (['Merguez Sausage'].includes(val)) emoji = '🌭';
      if (['Fresh Berries'].includes(val)) emoji = '🍓';
      if (['Apples'].includes(val)) emoji = '🍎';
      if (['Greek Yogurt'].includes(val)) emoji = '🍶';
      if (['Organic Eggs'].includes(val)) emoji = '🥚';
      if (['Fresh Cheese'].includes(val)) emoji = '🧀';
      if (['Potatoes'].includes(val)) emoji = '🥔';
      if (['Green Peas'].includes(val)) emoji = '🫛';
      if (['Semolina Couscous', 'Bulgur (Borghol)'].includes(val)) emoji = '🌾';
      if (['Nwasser Pasta', 'Dwida Vermicelli'].includes(val)) emoji = '🍝';
      if (['White Beans (Loubia)'].includes(val)) emoji = '🫘';
      if (['Chorba Vermicelli'].includes(val)) emoji = '🍜';
      if (['Harissa Paste'].includes(val)) emoji = '🌶️';
      if (['Tomato Paste'].includes(val)) emoji = '🥫';
      dom.pantryItemEmojiSelect.value = emoji;
    });
  }

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
    if (state.lang === 'ar') displayName = item.name_ar || item.name;

    card.innerHTML = `
      <div class="pantry-card-actions">
        <button class="pantry-card-btn edit-item" title="Edit"><i data-lucide="edit-2"></i></button>
        <button class="pantry-card-btn delete delete-item" title="Delete"><i data-lucide="trash-2"></i></button>
      </div>
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
      if (e.target.closest('.pantry-btn-plan') || e.target.closest('.pantry-card-actions')) return;
      openPantryDetails(item);
    });

    // Plan in 1-Tap button
    card.querySelector('.pantry-btn-plan').addEventListener('click', (e) => {
      e.stopPropagation();
      planMealInOneTap(item.matchRecipe);
    });

    // Edit button click
    card.querySelector('.edit-item').addEventListener('click', (e) => {
      e.stopPropagation();
      showPantryModal(item.id);
    });

    // Delete button click
    card.querySelector('.delete-item').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePantryItem(item.id);
    });

    dom.pantryGrid.appendChild(card);
  });
  lucide.createIcons();
}

// --- Pantry CRUD Helpers ---
function deletePantryItem(id) {
  const index = state.pantryItems.findIndex(i => i.id === id);
  if (index !== -1) {
    const name = state.pantryItems[index].name;
    state.pantryItems.splice(index, 1);
    localStorage.setItem('cookwithach_pantry', JSON.stringify(state.pantryItems));
    showToast(`${name} removed from pantry`);
    renderPantry();
  }
}

function showPantryModal(id = null) {
  if (dom.pantryModalOverlay && dom.pantryModal) {
    dom.pantryModalOverlay.classList.add('active');
    dom.pantryModal.classList.add('active');
    
    if (id) {
      editingPantryItemId = id;
      const item = state.pantryItems.find(i => i.id === id);
      if (item) {
        dom.pantryModalTitle.textContent = state.lang === 'fr' ? 'Modifier l\'ingrédient' : (state.lang === 'es' ? 'Editar ingrediente' : (state.lang === 'ar' ? 'تعديل المكون' : 'Edit Ingredient'));
        dom.pantryItemNameInput.value = item.name;
        dom.pantryItemQtyInput.value = item.qty;
        dom.pantryItemEmojiSelect.value = item.icon;
      }
    } else {
      editingPantryItemId = null;
      dom.pantryModalTitle.textContent = state.lang === 'fr' ? 'Ajouter un ingrédient' : (state.lang === 'es' ? 'Agregar ingrediente' : (state.lang === 'ar' ? 'إضافة مكون جديد' : 'Add Ingredient'));
      dom.pantryItemNameInput.value = 'Organic Spinach';
      dom.pantryItemQtyInput.value = '1 unit';
      dom.pantryItemEmojiSelect.value = '🥬';
    }
    dom.pantryItemNameInput.focus();
  }
}

function closePantryModal() {
  if (dom.pantryModalOverlay && dom.pantryModal) {
    dom.pantryModalOverlay.classList.remove('active');
    dom.pantryModal.classList.remove('active');
    editingPantryItemId = null;
  }
}

function savePantryItem() {
  const name = dom.pantryItemNameInput.value.trim();
  const qty = dom.pantryItemQtyInput.value.trim();
  const emoji = dom.pantryItemEmojiSelect.value;

  if (!name || !qty) {
    showToast('Please enter name and quantity');
    return;
  }

  if (editingPantryItemId) {
    const item = state.pantryItems.find(i => i.id === editingPantryItemId);
    if (item) {
      item.name = name;
      item.name_fr = name;
      item.name_es = name;
      item.name_ar = name;
      item.qty = qty;
      item.icon = emoji;
      showToast(`${name} updated successfully!`);
    }
  } else {
    const newItem = {
      id: 'p-' + Date.now(),
      name: name,
      name_fr: name,
      name_es: name,
      name_ar: name,
      qty: qty,
      icon: emoji,
      matchRecipe: 'r1'
    };
    state.pantryItems.push(newItem);
    showToast(`${name} added to pantry!`);
  }
  localStorage.setItem('cookwithach_pantry', JSON.stringify(state.pantryItems));

  closePantryModal();
  renderPantry();
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
  localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
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
          localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
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

// --- Global Cuisine Database ---
const cuisineDatabase = {
  tunisian: [
    {
      id: 'tun1',
      title: 'Tunisian Royal Couscous',
      calories: '520 kcal',
      prepTime: '45 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Heritage',
      ingredients: ['Semolina Couscous', 'Zucchini', 'Carrots', 'Potatoes', 'Lamb Chops', 'Tomato Paste', 'Harissa Paste']
    },
    {
      id: 'tun2',
      title: 'Ojja with Merguez & Eggs',
      calories: '380 kcal',
      prepTime: '20 mins',
      image: 'assets/salmon.jpg',
      culture: 'Tunisian Traditional',
      ingredients: ['Organic Eggs', 'Peppers', 'Tomato', 'Merguez Sausage', 'Garlic', 'Harissa Paste']
    },
    {
      id: 'tun3',
      title: 'Grilled Slata Mechouia Plate',
      calories: '210 kcal',
      prepTime: '30 mins',
      image: 'assets/pastry.jpg',
      culture: 'Tunisian Oasis',
      ingredients: ['Peppers', 'Tomato', 'Garlic', 'Fresh Tuna', 'Organic Eggs']
    },
    {
      id: 'tun4',
      title: 'Dwida Mfawra (Steamed Angel Hair)',
      calories: '460 kcal',
      prepTime: '40 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Steamed Pasta',
      ingredients: ['Dwida Vermicelli', 'Chicken Breast', 'Garlic', 'Tomato Paste', 'Potatoes']
    },
    {
      id: 'tun5',
      title: 'Steamed Nwasser Pasta with Chicken',
      calories: '490 kcal',
      prepTime: '45 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Square Pasta',
      ingredients: ['Nwasser Pasta', 'Chicken Breast', 'Tomato Paste', 'Harissa Paste', 'Garlic']
    },
    {
      id: 'tun6',
      title: 'Rouz Jerbi (Djerbian Steamed Rice)',
      calories: '420 kcal',
      prepTime: '35 mins',
      image: 'assets/pantry.jpg',
      culture: 'Djerbian Tradition',
      ingredients: ['Organic Spinach', 'Fresh Parsley', 'Chicken Breast', 'Green Peas', 'Carrots']
    },
    {
      id: 'tun7',
      title: 'Slow-Cooked Mloukhia Stew',
      calories: '590 kcal',
      prepTime: '180 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Signature',
      ingredients: ['Jute Leaves (Mloukhia)', 'Beef Steak', 'Garlic', 'Onion']
    },
    {
      id: 'tun8',
      title: 'Tunisian-Style Baked Lasagne',
      calories: '540 kcal',
      prepTime: '50 mins',
      image: 'assets/pastry.jpg',
      culture: 'Tunisian Fusion',
      ingredients: ['Nwasser Pasta', 'Minced Meat', 'Tomato Paste', 'Fresh Cheese', 'Garlic']
    },
    {
      id: 'tun9',
      title: 'Makrouna Sauce Blanche with Chicken',
      calories: '480 kcal',
      prepTime: '25 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Modern',
      ingredients: ['Nwasser Pasta', 'Chicken Breast', 'Greek Yogurt', 'Fresh Cheese', 'Garlic']
    },
    {
      id: 'tun10',
      title: 'Healthy Borghol with Vegetables',
      calories: '340 kcal',
      prepTime: '30 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Grain Stew',
      ingredients: ['Bulgur (Borghol)', 'Carrots', 'Zucchini', 'Tomato Paste', 'Garlic']
    },
    {
      id: 'tun11',
      title: 'Loubia (White Bean Stew)',
      calories: '310 kcal',
      prepTime: '35 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Winter Warmth',
      ingredients: ['White Beans (Loubia)', 'Tomato Paste', 'Garlic', 'Harissa Paste']
    },
    {
      id: 'tun12',
      title: 'Mermez Chickpea & Onion Stew',
      calories: '320 kcal',
      prepTime: '40 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Medina Stew',
      ingredients: ['White Beans (Loubia)', 'Onion', 'Tomato Paste', 'Beef Steak']
    },
    {
      id: 'tun13',
      title: 'Jelbena (Peas & Potatoes Stew)',
      calories: '390 kcal',
      prepTime: '35 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Peas Stew',
      ingredients: ['Green Peas', 'Potatoes', 'Chicken Breast', 'Tomato Paste']
    },
    {
      id: 'tun14',
      title: 'Classic Tunisian Chakchouka',
      calories: '280 kcal',
      prepTime: '20 mins',
      image: 'assets/salmon.jpg',
      culture: 'Tunisian Rural Comfort',
      ingredients: ['Peppers', 'Onion', 'Tomato', 'Organic Eggs']
    },
    {
      id: 'tun15',
      title: 'Golden Tunisian Baked Tajine',
      calories: '390 kcal',
      prepTime: '40 mins',
      image: 'assets/pastry.jpg',
      culture: 'Tunisian Baked Frittata',
      ingredients: ['Organic Eggs', 'Fresh Parsley', 'Chicken Breast', 'Potatoes', 'Fresh Cheese']
    },
    {
      id: 'tun16',
      title: 'Chorba Mfawra (Steamed Vermicelli)',
      calories: '440 kcal',
      prepTime: '45 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tunisian Traditional',
      ingredients: ['Chorba Vermicelli', 'Lamb Chops', 'Tomato Paste', 'Garlic']
    }
  ],
  italian: [
    {
      id: 'it1',
      title: 'Porcini Mushroom Risotto',
      calories: '410 kcal',
      prepTime: '30 mins',
      image: 'assets/pantry.jpg',
      culture: 'Northern Italian',
      ingredients: ['Arborio Rice', 'Porcini Mushrooms', 'Truffle Oil', 'Parmigiano Reggiano', 'White Wine']
    },
    {
      id: 'it2',
      title: 'Classic Tomato Basil Bruschetta',
      calories: '180 kcal',
      prepTime: '12 mins',
      image: 'assets/pantry.jpg',
      culture: 'Tuscan Countryside',
      ingredients: ['Rustic Bread', 'Ripe Tomatoes', 'Fresh Garlic', 'Extra Virgin Olive Oil', 'Fresh Basil']
    },
    {
      id: 'it3',
      title: 'Fettuccine Truffle Alfredo',
      calories: '460 kcal',
      prepTime: '20 mins',
      image: 'assets/pastry.jpg',
      culture: 'Roman Traditional',
      ingredients: ['Fettuccine Pasta', 'Truffle Butter', 'Parmigiano Reggiano', 'Heavy Cream', 'Garlic']
    },
    {
      id: 'it4',
      title: 'Tuscan Ribollita Soup',
      calories: '310 kcal',
      prepTime: '40 mins',
      image: 'assets/pantry.jpg',
      culture: 'Florentine Rustic',
      ingredients: ['Cannellini Beans', 'Lacinato Kale', 'Carrots', 'Stale Bread', 'Tomatoes', 'Rosemary']
    }
  ],
  japanese: [
    {
      id: 'jp1',
      title: 'Artisanal Veggie Sushi Platter',
      calories: '350 kcal',
      prepTime: '25 mins',
      image: 'assets/pantry.jpg',
      culture: 'Traditional Tokyo',
      ingredients: ['Sushi Rice', 'Nori Sheets', 'Avocado', 'Cucumber', 'Pickled Ginger', 'Wasabi']
    },
    {
      id: 'jp2',
      title: 'Matcha Cold Soba Noodles',
      calories: '280 kcal',
      prepTime: '15 mins',
      image: 'assets/pantry.jpg',
      culture: 'Kyoto Green Hills',
      ingredients: ['Matcha Buckwheat Noodles', 'Tsuyu Dipping Sauce', 'Scallions', 'Sesame Seeds', 'Wasabi']
    },
    {
      id: 'jp3',
      title: 'Silken Agedashi Tofu',
      calories: '220 kcal',
      prepTime: '18 mins',
      image: 'assets/pantry.jpg',
      culture: 'Japanese Temple',
      ingredients: ['Silken Tofu', 'Potato Starch', 'Warm Dashi', 'Grated Daikon', 'Scallions', 'Ginger']
    },
    {
      id: 'jp4',
      title: 'Sweet Miso Glazed Nasu Aubergine',
      calories: '240 kcal',
      prepTime: '22 mins',
      image: 'assets/pantry.jpg',
      culture: 'Osaka Street Food',
      ingredients: ['Eggplants', 'Sweet Miso Paste', 'Mirin', 'Toasted Sesame Seeds', 'Green Scallions']
    }
  ],
  mexican: [
    {
      id: 'mx1',
      title: 'Smashed Avocado & Black Bean Tacos',
      calories: '370 kcal',
      prepTime: '18 mins',
      image: 'assets/pantry.jpg',
      culture: 'Oaxacan Street Food',
      ingredients: ['Corn Tortillas', 'Black Beans', 'Smashed Avocado', 'Fresh Cilantro', 'Lime juice', 'Cotija Cheese']
    },
    {
      id: 'mx2',
      title: 'Chipotle Roasted Potato Quesadilla',
      calories: '410 kcal',
      prepTime: '20 mins',
      image: 'assets/pantry.jpg',
      culture: 'Puebla Comfort',
      ingredients: ['Flour Tortillas', 'Roasted Sweet Potato', 'Chipotle Sauce', 'Monterey Jack Cheese', 'Sour Cream']
    },
    {
      id: 'mx3',
      title: 'Enchiladas Verdes with Salsa Verde',
      calories: '430 kcal',
      prepTime: '30 mins',
      image: 'assets/pantry.jpg',
      culture: 'Guadalajara Style',
      ingredients: ['Corn Tortillas', 'Tomatillo Verde Salsa', 'Cotija Cheese', 'Sour Cream', 'Fresh Cilantro']
    },
    {
      id: 'mx4',
      title: 'Cheese Stuffed Chiles Rellenos',
      calories: '390 kcal',
      prepTime: '35 mins',
      image: 'assets/pantry.jpg',
      culture: 'Veracruz Coastal',
      ingredients: ['Poblano Peppers', 'Monterey Jack Cheese', 'Egg Batter', 'Spiced Tomato Salsa']
    }
  ],
  french: [
    {
      id: 'fr1',
      title: 'Provencal Vegetable Ratatouille',
      calories: '240 kcal',
      prepTime: '45 mins',
      image: 'assets/pantry.jpg',
      culture: 'French Riviera',
      ingredients: ['Eggplant', 'Zucchini', 'Yellow Squash', 'Bell Peppers', 'Herbes de Provence', 'Olive Oil']
    },
    {
      id: 'fr2',
      title: 'French Onion Soup Gratinée',
      calories: '340 kcal',
      prepTime: '50 mins',
      image: 'assets/pantry.jpg',
      culture: 'Parisian Bistro',
      ingredients: ['Onions', 'Beef Broth', 'French Baguette', 'Gruyère Cheese', 'Fresh Thyme']
    },
    {
      id: 'fr3',
      title: 'Spinach & Gruyère Savory Quiche',
      calories: '390 kcal',
      prepTime: '40 mins',
      image: 'assets/pastry.jpg',
      culture: 'Alsatian Countryside',
      ingredients: ['Butter Puff Pastry', 'Fresh Eggs', 'Organic Spinach', 'Gruyère Cheese', 'Nutmeg']
    },
    {
      id: 'fr4',
      title: 'Boutique Chocolate Soufflé',
      calories: '280 kcal',
      prepTime: '30 mins',
      image: 'assets/pastry.jpg',
      culture: 'French Pastry Shop',
      ingredients: ['Dark Chocolate', 'Eggs', 'Sugar', 'Butter', 'Vanilla Extract']
    }
  ],
  moroccan: [
    {
      id: 'mor1',
      title: 'Apricot & Chickpea Tagine',
      calories: '380 kcal',
      prepTime: '35 mins',
      image: 'assets/pantry.jpg',
      culture: 'Moroccan Medina',
      ingredients: ['Chickpeas', 'Dried Apricots', 'Butternut Squash', 'Moroccan Cumin & Cinnamon', 'Toasted Almonds']
    },
    {
      id: 'mor2',
      title: 'Moroccan Harira Lentil Soup',
      calories: '310 kcal',
      prepTime: '30 mins',
      image: 'assets/pantry.jpg',
      culture: 'Marrakech Souk',
      ingredients: ['Brown Lentils', 'Chickpeas', 'Tomato Puree', 'Fresh Ginger', 'Fresh Cilantro', 'Cumin']
    },
    {
      id: 'mor3',
      title: 'Fragrant Couscous Tfaya',
      calories: '420 kcal',
      prepTime: '40 mins',
      image: 'assets/pantry.jpg',
      culture: 'Moroccan Palace',
      ingredients: ['Couscous Semolina', 'Caramelized Onions', 'Raisins', 'Cinnamon', 'Toasted Almonds']
    },
    {
      id: 'mor4',
      title: 'Zaatar Roasted Cauliflower Bowl',
      calories: '270 kcal',
      prepTime: '25 mins',
      image: 'assets/pantry.jpg',
      culture: 'Moroccan Coast',
      ingredients: ['Cauliflower Florets', 'Zaatar Seasoning', 'Creamy Tahini', 'Pomegranate Seeds', 'Parsley']
    }
  ]
};

// --- AI Concierge Drawer Trigger ---
function triggerAIConcierge() {
  const queryInput = document.getElementById('search-input');
  const query = queryInput ? queryInput.value.trim().toLowerCase() : '';
  
  // Clear search input for next time
  if (queryInput) queryInput.value = '';

  let initialCuisine = '';
  const tunisianKeywords = ['tunis', 'shakshuka', 'couscous', 'brik', 'ojja', 'dwida', 'nwasser', 'rouz', 'mloukhia', 'slata', 'lasagne', 'makrouna', 'borghol', 'loubia', 'mermez', 'jelbena', 'tajine', 'chorba', 'chakchouka'];
  if (tunisianKeywords.some(kw => query.includes(kw))) {
    initialCuisine = 'tunisian';
  } else if (query.includes('ital')) {
    initialCuisine = 'italian';
  } else if (query.includes('japan') || query.includes('sushi')) {
    initialCuisine = 'japanese';
  } else if (query.includes('mexic') || query.includes('taco')) {
    initialCuisine = 'mexican';
  } else if (query.includes('french') || query.includes('rata')) {
    initialCuisine = 'french';
  } else if (query.includes('moroc') || query.includes('tagine')) {
    initialCuisine = 'moroccan';
  }

  renderAIDrawerLayout(initialCuisine);
  openDrawer();
}

function renderAIDrawerLayout(activeCuisineKey = '') {
  dom.drawerContent.innerHTML = `
    <div class="drawer-header" style="margin-bottom: 12px;">
      <div class="drawer-title-col">
        <span class="drawer-origin" style="color: var(--color-dusty-rose); font-weight: 600;">ACH AI Concierge</span>
        <h2 class="drawer-title" style="font-family: var(--font-serif); font-size: 22px;">Global Culinary Assistant</h2>
      </div>
    </div>
    
    <div style="margin-bottom: 16px;">
      <p style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px;">
        Type any country or select a quick shortcut to explore national foods and ingredients:
      </p>
      
      <!-- Interactive AI Drawer Search -->
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <input type="text" id="ai-drawer-search" placeholder="Type country (e.g. Tunisia, Italy, Japan)..." 
               style="flex: 1; padding: 10px; border-radius: 12px; border: 1px solid var(--color-border); font-size: 13px; outline: none; background: var(--color-champagne-bg);"
               value="${activeCuisineKey ? activeCuisineKey.charAt(0).toUpperCase() + activeCuisineKey.slice(1) : ''}">
        <button id="ai-drawer-search-btn" style="background: var(--color-dusty-rose); color: white; border: none; padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer;">
          Ask
        </button>
      </div>

      <!-- Quick Country Toggles -->
      <div class="quick-countries-row" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none;">
        <button class="country-chip" data-cuisine="tunisian" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇹🇳 Tunisia</button>
        <button class="country-chip" data-cuisine="italian" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇮🇹 Italy</button>
        <button class="country-chip" data-cuisine="japanese" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇯🇵 Japan</button>
        <button class="country-chip" data-cuisine="mexican" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇲🇽 Mexico</button>
        <button class="country-chip" data-cuisine="french" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇫🇷 France</button>
        <button class="country-chip" data-cuisine="moroccan" style="padding: 6px 12px; border-radius: 100px; border: 1px solid var(--color-border); background: white; font-size: 12px; cursor: pointer; white-space: nowrap;">🇲🇦 Morocco</button>
      </div>
    </div>

    <!-- AI Dynamic Recipes Feed -->
    <div id="ai-recipes-container" style="display: flex; flex-direction: column; gap: 14px;">
      <!-- Dynamic list elements rendered here -->
    </div>
  `;

  // Attach search event listeners
  const searchBtn = document.getElementById('ai-drawer-search-btn');
  const searchInput = document.getElementById('ai-drawer-search');
  
  const performSearch = () => {
    const term = searchInput.value.trim().toLowerCase();
    let matchKey = '';
    const tunisianKeywords = ['tunis', 'shakshuka', 'couscous', 'brik', 'ojja', 'dwida', 'nwasser', 'rouz', 'mloukhia', 'slata', 'lasagne', 'makrouna', 'borghol', 'loubia', 'mermez', 'jelbena', 'tajine', 'chorba', 'chakchouka'];
    if (tunisianKeywords.some(kw => term.includes(kw))) {
      matchKey = 'tunisian';
    } else if (term.includes('ital') || term.includes('risotto') || term.includes('pasta')) {
      matchKey = 'italian';
    } else if (term.includes('japan') || term.includes('sushi') || term.includes('soba')) {
      matchKey = 'japanese';
    } else if (term.includes('mexic') || term.includes('taco')) {
      matchKey = 'mexican';
    } else if (term.includes('french') || term.includes('rata')) {
      matchKey = 'french';
    } else if (term.includes('moroc') || term.includes('tagine')) {
      matchKey = 'moroccan';
    }
    
    // Highlight the matching chip if any
    document.querySelectorAll('.country-chip').forEach(chip => {
      if (chip.dataset.cuisine === matchKey) {
        chip.style.borderColor = 'var(--color-dusty-rose)';
        chip.style.background = 'var(--color-dusty-rose-light)';
      } else {
        chip.style.borderColor = 'var(--color-border)';
        chip.style.background = 'white';
      }
    });
    
    renderAIDrawerRecipes(matchKey, term);
  };

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Country Chips event listeners
  document.querySelectorAll('.country-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.country-chip').forEach(c => {
        c.style.borderColor = 'var(--color-border)';
        c.style.background = 'white';
      });
      chip.style.borderColor = 'var(--color-dusty-rose)';
      chip.style.background = 'var(--color-dusty-rose-light)';
      
      const cuisineKey = chip.dataset.cuisine;
      searchInput.value = cuisineKey.charAt(0).toUpperCase() + cuisineKey.slice(1);
      renderAIDrawerRecipes(cuisineKey);
    });
  });

  // Load initial if passed
  if (activeCuisineKey) {
    const activeChip = document.querySelector(`.country-chip[data-cuisine="${activeCuisineKey}"]`);
    if (activeChip) {
      activeChip.style.borderColor = 'var(--color-dusty-rose)';
      activeChip.style.background = 'var(--color-dusty-rose-light)';
    }
    renderAIDrawerRecipes(activeCuisineKey);
  } else {
    // Show a warm default prompt suggestions
    renderAIDrawerRecipes('');
  }
}

function renderAIDrawerRecipes(cuisineKey, customQuery = '') {
  const container = document.getElementById('ai-recipes-container');
  if (!container) return;

  container.innerHTML = '';

  if (!cuisineKey) {
    // PANTRY OPTIMIZER AI: Propose meal matching current pantry items
    const analysis = getPantryAIPrompt();
    const recipe = analysis.recipe;
    const title = recipe.resolvedTitle;
    const matched = analysis.matched;
    const unmatched = analysis.unmatched;

    // Quality/Healthy Booster tips based on recipe category
    let boosterTip = 'Add organic microgreens and cold-pressed extra virgin olive oil to increase healthy fats and antioxidants.';
    if (recipe.category === 'sweet') {
      boosterTip = 'Add organic chia seeds, wild honey, and ground flaxseeds to boost fiber and omega-3 quality.';
    } else if (recipe.category === 'light') {
      boosterTip = 'Add pumpkin seeds and organic spinach leaves to enrich mineral density and fiber content.';
    }

    container.innerHTML = `
      <!-- Smart Pantry Matcher Card -->
      <div style="background: linear-gradient(135deg, #FFF6F3, #FCF1EC); border: 1px solid rgba(212, 163, 150, 0.3); border-radius: 20px; padding: 18px; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; background: var(--color-sage-green-light); color: var(--color-sage-green); padding: 4px 8px; border-radius: 100px; letter-spacing:0.5px;">
            Pantry Match AI
          </span>
          <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 500;">
            ${matched.length} ingredients matching
          </span>
        </div>

        <div>
          <h3 style="font-family: var(--font-serif); font-size: 19px; color: var(--color-text-charcoal); margin-bottom: 2px;">
            ${title}
          </h3>
          <p style="font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">
            Best healthy suggestion matching your active pantry inventory.
          </p>
        </div>

        ${matched.length > 0 ? `
          <div>
            <strong style="font-size: 11px; color: var(--color-sage-green); display: block; margin-bottom: 6px;">✓ Utilizing from your Pantry:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${matched.map(ing => `<span style="font-size: 10px; background: #E4ECE2; color: #8F9E8B; padding: 3px 10px; border-radius: 100px; font-weight:500;">${ing}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${unmatched.length > 0 ? `
          <div>
            <strong style="font-size: 11px; color: var(--color-dusty-rose); display: block; margin-bottom: 6px;">+ Buy to make it a premium, healthy meal:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${unmatched.map(ing => `<span style="font-size: 10px; background: #FFF0ED; color: #D4A396; padding: 3px 10px; border-radius: 100px; font-weight:500;">🛒 ${ing}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div style="background: white; border-radius: 12px; padding: 10px; border: 1px solid var(--color-border);">
          <strong style="font-size: 11px; color: var(--color-text-charcoal); display: block; margin-bottom: 2px;">✨ Sovereign Quality Boosters:</strong>
          <p style="font-size: 11px; color: var(--color-text-muted); line-height: 1.4; font-style: italic;">
            ${boosterTip}
          </p>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button id="ai-pantry-plan-btn" style="flex: 1; background-color: var(--color-dusty-rose); color: white; border: none; padding: 10px; border-radius: 12px; font-family: var(--font-sans); font-size: 12px; font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">
            Schedule for Today
          </button>
          <button id="ai-pantry-shopping-btn" style="background-color: var(--color-sage-green-light); color: var(--color-sage-green); border: none; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition-smooth);" title="Add missing items to shopping list">
            <i data-lucide="shopping-cart" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </div>

      <!-- Quick Tips banner -->
      <div style="background-color: var(--color-champagne-bg); border-radius: 16px; padding: 16px; font-size: 12px; line-height: 1.5; color: var(--color-text-muted); border: 1px dashed var(--color-border);">
        <p>💡 <em>Tip:</em> Try typing a country name like <strong>"Tunisia"</strong> or <strong>"Morocco"</strong> in the search bar above to generate a list of regional options and their ingredients!</p>
      </div>
    `;

    // Bind event listeners for the smart match card
    document.getElementById('ai-pantry-plan-btn').addEventListener('click', () => {
      const dateStr = `2026-07-${String(state.todayDate).padStart(2, '0')}`;
      if (!state.scheduledMeals[dateStr]) {
        state.scheduledMeals[dateStr] = [];
      }
      state.scheduledMeals[dateStr].push({
        time: 'dinner',
        title: title,
        type: 'ai-pantry-match',
        id: recipe.id
      });
      
      showToast(`${locales[state.lang].toast_scheduled} ${state.todayDate}: ${title}`);
      localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
      renderCalendar();
      renderWeeklyWidget();
      updateTodayDashboardCard();
      closeDrawer();
    });

    document.getElementById('ai-pantry-shopping-btn').addEventListener('click', () => {
      if (unmatched.length > 0) {
        showToast(`Added ${unmatched.length} ingredients to your Shopping List!`);
      } else {
        showToast('All ingredients are already in your pantry!');
      }
      closeDrawer();
    });

    lucide.createIcons();
    return;
  }

  const list = cuisineDatabase[cuisineKey] || [];
  if (list.length === 0) {
    container.innerHTML = `
      <p style="font-size: 13px; color: var(--color-text-muted); text-align: center; margin-top: 10px;">
        No specific recipes found for that query. Try "Tunisia" or "Italy".
      </p>
    `;
    return;
  }

  list.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.style.backgroundColor = 'white';
    recipeDiv.style.border = '1px solid var(--color-border)';
    recipeDiv.style.borderRadius = '16px';
    recipeDiv.style.padding = '14px';
    recipeDiv.style.boxShadow = 'var(--shadow-soft)';
    recipeDiv.style.display = 'flex';
    recipeDiv.style.flexDirection = 'column';
    recipeDiv.style.gap = '8px';

    recipeDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 9px; font-weight: 600; text-transform: uppercase; color: var(--color-sage-green); letter-spacing: 0.5px;">${recipe.culture}</span>
          <h4 style="font-family: var(--font-serif); font-size: 16px; color: var(--color-text-charcoal); margin-top: 2px;">${recipe.title}</h4>
        </div>
        <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 500;">${recipe.prepTime} | ${recipe.calories}</span>
      </div>
      
      <div>
        <span style="font-size: 11px; font-weight: 600; color: var(--color-text-muted);">Ingredients:</span>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
          ${recipe.ingredients.map(ing => `
            <span style="font-size: 10px; background: var(--color-sage-green-light); color: var(--color-sage-green); padding: 2px 8px; border-radius: 100px; font-weight: 500;">
              ${ing}
            </span>
          `).join('')}
        </div>
      </div>

      <button class="ai-drawer-plan-btn" data-recipe-title="${recipe.title}" style="background-color: var(--color-dusty-rose); color: white; border: none; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; align-self: flex-start; margin-top: 6px; display: flex; align-items: center; gap: 4px; transition: var(--transition-smooth);">
        <i data-lucide="plus" style="width:12px; height:12px;"></i> Add to Today's Planner
      </button>
    `;

    // Bind Plan click in AI drawer
    recipeDiv.querySelector('.ai-drawer-plan-btn').addEventListener('click', () => {
      const dateStr = `2026-07-${String(state.todayDate).padStart(2, '0')}`;
      if (!state.scheduledMeals[dateStr]) {
        state.scheduledMeals[dateStr] = [];
      }
      state.scheduledMeals[dateStr].push({
        time: 'dinner',
        title: recipe.title,
        type: 'ai-recipe',
        id: recipe.id
      });
      
      showToast(`${locales[state.lang].toast_scheduled} ${state.todayDate}: ${recipe.title}`);
      localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
      renderCalendar();
      renderWeeklyWidget();
      updateTodayDashboardCard();
      closeDrawer();
    });

    container.appendChild(recipeDiv);
  });
  
  lucide.createIcons();
}

// --- Dynamic Pantry Analyzer Engine ---
function getPantryAIPrompt() {
  const pantryNames = state.pantryItems.map(item => {
    let name = item.name;
    if (state.lang === 'fr' && item.name_fr) name = item.name_fr;
    if (state.lang === 'es' && item.name_es) name = item.name_es;
    if (state.lang === 'ar' && item.name_ar) name = item.name_ar;
    return name.toLowerCase();
  });
  
  let bestRecipe = null;
  let maxMatches = -1;
  let matchingIngredients = [];
  let missingIngredients = [];

  // Flatten all recipes
  const allRecipes = [...state.recipes];
  Object.values(cuisineDatabase).forEach(list => {
    allRecipes.push(...list);
  });

  allRecipes.forEach(recipe => {
    // Determine title
    let titleStr = '';
    if (typeof recipe.title === 'string') {
      titleStr = recipe.title;
    } else {
      titleStr = recipe.title[state.region] || recipe.title.Mediterranean;
    }

    // Determine ingredients array
    let recipeIngs = [];
    if (Array.isArray(recipe.ingredients)) {
      recipeIngs = recipe.ingredients;
    } else if (recipe.ingredients && recipe.ingredients[state.lang]) {
      recipeIngs = recipe.ingredients[state.lang];
    } else if (recipe.ingredients && recipe.ingredients.en) {
      recipeIngs = recipe.ingredients.en;
    } else {
      recipeIngs = [];
    }

    let matches = 0;
    const matched = [];
    const unmatched = [];

    recipeIngs.forEach(ing => {
      const isMatched = pantryNames.some(pName => ing.toLowerCase().includes(pName) || pName.includes(ing.toLowerCase()));
      if (isMatched) {
        matches++;
        matched.push(ing);
      } else {
        unmatched.push(ing);
      }
    });

    if (matches > maxMatches) {
      maxMatches = matches;
      bestRecipe = {
        ...recipe,
        resolvedTitle: titleStr,
        resolvedIngredients: recipeIngs
      };
      matchingIngredients = matched;
      missingIngredients = unmatched;
    }
  });

  // If no pantry items exist or no matches, fallback to first recipe
  if (!bestRecipe || maxMatches <= 0) {
    const firstRec = state.recipes[0];
    let titleStr = firstRec.title[state.region];
    let recipeIngs = firstRec.ingredients[state.lang] || firstRec.ingredients.en;
    
    bestRecipe = {
      ...firstRec,
      resolvedTitle: titleStr,
      resolvedIngredients: recipeIngs
    };
    matchingIngredients = [];
    missingIngredients = recipeIngs;
  }

  return {
    recipe: bestRecipe,
    matched: matchingIngredients,
    unmatched: missingIngredients,
    score: maxMatches
  };
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
  localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
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

// --- Batch Cooking Planner Generator ---
function triggerBatchCookingPlan() {
  let headerText = 'Batch Cooking Planner';
  let descText = 'Optimized weekly prep guide. Cook 4 meals in parallel, store in the fridge, and enjoy all week!';
  let scheduleBtnText = 'Schedule All Meals to Calendar';
  let stepTitle = 'Simultaneous Cook Flow (60 Mins)';
  let storageTitle = 'Storage Instructions';
  
  if (state.lang === 'fr') {
    headerText = 'Planificateur Batch Cooking';
    descText = 'Guide de préparation hebdomadaire. Cuisinez 4 plats en parallèle pour toute la semaine !';
    scheduleBtnText = 'Planifier tous ces repas dans mon calendrier';
    stepTitle = 'Étapes de cuisson simultanée (60 mins)';
    storageTitle = 'Instructions de stockage';
  } else if (state.lang === 'es') {
    headerText = 'Planificador de Lote';
    descText = 'Optimice su cocina cocinando 4 comidas a la vez para conservar en el refrigerador.';
    scheduleBtnText = 'Programar todas las comidas en el calendario';
    stepTitle = 'Flujo de cocción simultánea (60 mins)';
    storageTitle = 'Instrucciones de almacenamiento';
  } else if (state.lang === 'ar') {
    headerText = 'مخطط الطهي الجماعي (Batch Cooking)';
    descText = 'دليل التحضير الأسبوعي المبتكر. اطهي 4 وجبات معاً في وقت واحد لتخزينها في الثلاجة للأسبوع!';
    scheduleBtnText = 'جدولة جميع الوجبات في التقويم';
    stepTitle = 'خطوات الطهي المتزامن (60 دقيقة)';
    storageTitle = 'تعليمات الحفظ والتخزين';
  }

  // Dynamically select top 4 recipes matching the pantry ingredients
  const matchedBatch = getBatchCookingRecipes();
  const daySchedule = [5, 6, 7, 8]; // Friday, Saturday, Sunday, Monday
  const dayLabels = {
    en: ['Friday Dinner', 'Saturday Dinner', 'Sunday Dinner', 'Monday Lunch'],
    fr: ['Vendredi Dîner', 'Samedi Dîner', 'Dimanche Dîner', 'Lundi Déjeuner'],
    es: ['Viernes Cena', 'Sábado Cena', 'Domingo Cena', 'Lunes Almuerzo'],
    ar: ['عشاء الجمعة', 'عشاء السبت', 'عشاء الأحد', 'غداء الاثنين']
  };

  const menuItemsHTML = matchedBatch.map((item, idx) => {
    return `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; font-size:11px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div style="max-width: 70%;">
          <strong style="color:var(--color-text-charcoal);">${item.title}</strong>
          <div style="font-size: 9px; color: var(--color-sage-green); margin-top: 2px;">
            ✓ Matches: ${item.score} pantry items
          </div>
        </div>
        <span style="font-size: 10px; color: var(--color-text-muted); background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid var(--color-border); font-weight:500;">
          ${dayLabels[state.lang][idx]}
        </span>
      </div>
    `;
  }).join('');

  dom.drawerContent.innerHTML = `
    <div class="drawer-header" style="margin-bottom: 12px;">
      <div class="drawer-title-col">
        <span class="drawer-origin" style="color: var(--color-sage-green); font-weight: 600;">ACH AI Concierge</span>
        <h2 class="drawer-title" style="font-family: var(--font-serif); font-size: 22px;">${headerText}</h2>
      </div>
    </div>

    <p style="font-size: 12px; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 16px;">
      ${descText}
    </p>

    <!-- Planned Menu Overview -->
    <div style="background-color: var(--color-champagne-bg); border-radius: 16px; padding: 14px; margin-bottom: 16px; border: 1px solid var(--color-border);">
      <strong style="font-size: 12px; color: var(--color-text-charcoal); display: block; margin-bottom: 8px;">📋 Target Weekly Menu:</strong>
      <div style="display:flex; flex-direction:column; gap:4px;">
        ${menuItemsHTML}
      </div>
    </div>

    <!-- Simultaneous Cook Steps -->
    <div style="margin-bottom: 16px;">
      <strong style="font-size: 12px; color: var(--color-text-charcoal); display: block; margin-bottom: 6px;">🍳 ${stepTitle}:</strong>
      <ul style="font-size: 11px; color: var(--color-text-muted); line-height: 1.6; padding-left: 16px;">
        <li>🔥 <strong>0-10 Min (Oven Prep)</strong>: Chop eggplant, zucchini, squash, and carrots. Toss in olive oil and herbs; roast at 400°F (shared for Couscous and Ratatouille).</li>
        <li>🍚 <strong>10-30 Min (Stove Base)</strong>: Simmer vegetable broth for Arborio rice and steam Semolina couscous in parallel pots.</li>
        <li>🥣 <strong>30-45 Min (Cold Prep)</strong>: Chop fresh cucumbers and dill; fold into Greek yogurt with cold-pressed olive oil for the Yogurt Bowls.</li>
        <li>🍲 <strong>45-60 Min (Assemble)</strong>: Stir roasted vegetables into tomato sauce for Ratatouille. Combine Arborio rice with porcini mushrooms and truffle oil for Risotto.</li>
      </ul>
    </div>

    <!-- Storage instructions -->
    <div style="background-color: #FFF6F3; border-radius: 12px; padding: 12px; border: 1px solid rgba(212, 163, 150, 0.2); margin-bottom: 20px;">
      <strong style="font-size: 11px; color: var(--color-dusty-rose); display: block; margin-bottom: 2px;">❄️ ${storageTitle}:</strong>
      <p style="font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">
        Pack meals individually in airtight glass containers. Risotto, Couscous, and Ratatouille keep perfectly in the fridge for up to 5 days. Keep Yogurt Bowls chilled.
      </p>
    </div>

    <!-- Action Button to schedule all -->
    <button id="ai-batch-schedule-btn" class="drawer-plan-action-btn">
      ${scheduleBtnText}
    </button>
  `;

  // Attach listener to Schedule All
  document.getElementById('ai-batch-schedule-btn').addEventListener('click', () => {
    matchedBatch.forEach((item, idx) => {
      const day = daySchedule[idx];
      const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
      if (!state.scheduledMeals[dateStr]) {
        state.scheduledMeals[dateStr] = [];
      }
      state.scheduledMeals[dateStr].push({
        time: item.category === 'light' ? 'lunch' : 'dinner',
        title: item.title,
        type: 'batch-cook',
        id: 'batch-' + Date.now() + '-' + day
      });
    });

    const successMsg = state.lang === 'fr' ? 'Plan de batch cooking planifié dans le calendrier !' :
                       (state.lang === 'es' ? '¡Planificación de lote programada en el calendario!' :
                       (state.lang === 'ar' ? 'تمت جدولة خطة الطهي الجماعي بنجاح!' : 'Batch cooking plan scheduled on calendar!'));
    
    showToast(successMsg);
    localStorage.setItem('cookwithach_scheduled', JSON.stringify(state.scheduledMeals));
    renderCalendar();
    renderWeeklyWidget();
    updateTodayDashboardCard();
    closeDrawer();
  });

  openDrawer();
}

function getBatchCookingRecipes() {
  const pantryNames = state.pantryItems.map(item => {
    let name = item.name;
    if (state.lang === 'fr' && item.name_fr) name = item.name_fr;
    if (state.lang === 'es' && item.name_es) name = item.name_es;
    if (state.lang === 'ar' && item.name_ar) name = item.name_ar;
    return name.toLowerCase();
  });

  // Gather all recipes
  const allRecipes = [...state.recipes];
  Object.values(cuisineDatabase).forEach(list => {
    allRecipes.push(...list);
  });

  // Calculate score for each recipe
  const scoredRecipes = allRecipes.map(recipe => {
    let titleStr = '';
    if (typeof recipe.title === 'string') {
      titleStr = recipe.title;
    } else {
      titleStr = recipe.title[state.region] || recipe.title.Mediterranean;
    }

    let recipeIngs = [];
    if (Array.isArray(recipe.ingredients)) {
      recipeIngs = recipe.ingredients;
    } else if (recipe.ingredients && recipe.ingredients[state.lang]) {
      recipeIngs = recipe.ingredients[state.lang];
    } else if (recipe.ingredients && recipe.ingredients.en) {
      recipeIngs = recipe.ingredients.en;
    } else {
      recipeIngs = [];
    }

    let matches = 0;
    recipeIngs.forEach(ing => {
      const isMatched = pantryNames.some(pName => ing.toLowerCase().includes(pName) || pName.includes(ing.toLowerCase()));
      if (isMatched) {
        matches++;
      }
    });

    return {
      recipe,
      title: titleStr,
      ingredients: recipeIngs,
      score: matches,
      category: recipe.category || 'mains'
    };
  });

  // Sort descending by match score
  scoredRecipes.sort((a, b) => b.score - a.score);

  // Return the top 4 best-matching recipes (unique)
  const uniqueBatch = [];
  const titlesSeen = new Set();
  
  for (const item of scoredRecipes) {
    if (!titlesSeen.has(item.title)) {
      titlesSeen.add(item.title);
      uniqueBatch.push(item);
    }
    if (uniqueBatch.length === 4) break;
  }

  // Fallback to fill 4 meals
  while (uniqueBatch.length < 4 && allRecipes.length > 0) {
    uniqueBatch.push(scoredRecipes[uniqueBatch.length % scoredRecipes.length]);
  }

  return uniqueBatch;
}

// --- Translation/Localization Core ---
function updateLocalization() {
  // Update Header greeting to greet the user like a queen
  const greetings = {
    en: 'Hello, My Queen',
    fr: 'Bonjour, Ma Reine',
    es: 'Hola, Mi Reina',
    ar: 'مرحباً بمليكتي'
  };
  dom.headerGreeting.textContent = greetings[state.lang];

  // Handle Right-to-Left (RTL) for Arabic layout direction
  const frame = document.querySelector('.mobile-frame');
  if (state.lang === 'ar') {
    if (frame) frame.setAttribute('dir', 'rtl');
  } else {
    if (frame) frame.setAttribute('dir', 'ltr');
  }

  // Sync Header lang switcher label
  if (dom.headerLangLabel) {
    dom.headerLangLabel.textContent = state.lang.toUpperCase();
  }

  // Sync settings page language switcher toggles
  if (dom.langButtons) {
    dom.langButtons.forEach(btn => {
      if (btn.dataset.lang === state.lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

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
