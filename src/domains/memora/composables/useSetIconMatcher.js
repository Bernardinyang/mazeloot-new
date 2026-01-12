import {
  Grid3x3,
  Sparkles,
  Images,
  Video,
  Film,
  Camera,
  Gem,
  Heart,
  Users,
  User,
  Baby,
  Cake,
  GraduationCap,
  Briefcase,
  Dumbbell,
  Gamepad2,
  Music,
  Mic,
  Palette,
  Brush,
  Scissors,
  Utensils,
  Coffee,
  Plane,
  Car,
  Ship,
  Mountain,
  Waves,
  TreePine,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Home,
  Church,
  Building,
  PartyPopper,
  Award,
  Trophy,
  Gift,
  Star,
  Shirt,
  Watch,
  ShoppingBag,
  Folder,
  FileText,
  Layers,
  Zap,
  Target,
  Rocket,
  Lightbulb,
  Wand2,
  PenTool,
  Ruler,
  Compass,
  Eye,
  Search,
} from 'lucide-vue-next'

/**
 * Comprehensive icon matcher for media sets
 * Uses keyword matching with priority scoring for best icon selection
 */
export function useSetIconMatcher() {
  // Icon mappings organized by category with priority scores
  // Lower priority number = higher priority (matched first)
  const iconMappings = [
    // === PEOPLE & RELATIONSHIPS (Priority 1) ===
    {
      icon: Heart,
      keywords: [
        'love', 'loved', 'loving', 'romance', 'romantic', 'couple', 'couples',
        'engagement', 'engaged', 'proposal', 'proposed', 'valentine', 'anniversary',
        'sweetheart', 'beloved', 'darling', 'affection', 'passion', 'devotion'
      ],
      priority: 1
    },
    {
      icon: Gem,
      keywords: [
        'wedding', 'weddings', 'bride', 'brides', 'groom', 'grooms', 'bridal',
        'ceremony', 'ceremonies', 'vows', 'nuptial', 'marriage', 'married',
        'honeymoon', 'reception', 'aisle', 'altar', 'bouquet', 'ring', 'rings',
        'jewelry', 'jewel', 'diamond', 'diamonds', 'precious', 'treasure'
      ],
      priority: 1
    },
    {
      icon: Users,
      keywords: [
        'family', 'families', 'familial', 'relatives', 'kin', 'clan', 'household',
        'team', 'teams', 'group', 'groups', 'together', 'togetherness', 'unity',
        'community', 'communities', 'gathering', 'gatherings', 'reunion', 'reunions',
        'friends', 'friendship', 'buddies', 'squad', 'crew', 'gang'
      ],
      priority: 1
    },
    {
      icon: User,
      keywords: [
        'portrait', 'portraits', 'headshot', 'headshots', 'profile', 'profiles',
        'individual', 'person', 'people', 'personality', 'character', 'identity',
        'self', 'selfie', 'selfies', 'mugshot', 'face', 'faces'
      ],
      priority: 1
    },
    {
      icon: Baby,
      keywords: [
        'baby', 'babies', 'infant', 'infants', 'newborn', 'newborns', 'toddler', 'toddlers',
        'child', 'children', 'kids', 'kid', 'maternity', 'pregnancy', 'pregnant',
        'expecting', 'bump', 'nursery', 'crib', 'pacifier', 'diaper', 'stroller',
        'cute', 'adorable', 'little', 'tiny', 'small'
      ],
      priority: 1
    },

    // === CELEBRATIONS & EVENTS (Priority 1) ===
    {
      icon: Cake,
      keywords: [
        'birthday', 'birthdays', 'birth', 'anniversary', 'anniversaries', 'celebration',
        'celebrations', 'party', 'parties', 'festive', 'festivity', 'festivities',
        'candle', 'candles', 'blow', 'wish', 'wishes', 'gift', 'gifts', 'present', 'presents',
        'surprise', 'surprises', 'milestone', 'milestones', 'achievement', 'achievements'
      ],
      priority: 1
    },
    {
      icon: PartyPopper,
      keywords: [
        'celebration', 'celebrations', 'festival', 'festivals', 'fest', 'fiesta',
        'carnival', 'carnivals', 'parade', 'parades', 'event', 'events', 'occasion',
        'occasions', 'gala', 'galas', 'ball', 'balls', 'soiree', 'soirees',
        'jubilee', 'jubilees', 'merry', 'merriment', 'joy', 'joyful', 'happy', 'happiness'
      ],
      priority: 1
    },
    {
      icon: Trophy,
      keywords: [
        'trophy', 'trophies', 'champion', 'champions', 'winner', 'winners', 'victory',
        'victories', 'win', 'winning', 'success', 'successful', 'achievement', 'achievements',
        'accomplishment', 'accomplishments', 'medal', 'medals', 'award', 'awards',
        'prize', 'prizes', 'honor', 'honors', 'glory', 'triumph', 'triumphs'
      ],
      priority: 1
    },
    {
      icon: Award,
      keywords: [
        'award', 'awards', 'recognition', 'recognitions', 'honor', 'honors', 'honorary',
        'accolade', 'accolades', 'commendation', 'commendations', 'distinction', 'distinctions',
        'merit', 'merits', 'excellence', 'outstanding', 'remarkable', 'notable', 'noteworthy'
      ],
      priority: 1
    },
    {
      icon: Star,
      keywords: [
        'star', 'stars', 'featured', 'feature', 'features', 'best', 'favorite', 'favorites',
        'favourite', 'favourites', 'top', 'elite', 'premium', 'special', 'exceptional',
        'outstanding', 'remarkable', 'highlight', 'highlights', 'showcase', 'showcases'
      ],
      priority: 1
    },
    {
      icon: Sparkles,
      keywords: [
        'highlight', 'highlights', 'featured', 'feature', 'features', 'best', 'top',
        'special', 'exceptional', 'magic', 'magical', 'sparkle', 'sparkles', 'sparkling',
        'glitter', 'glitters', 'glittering', 'shine', 'shines', 'shining', 'brilliant',
        'brilliance', 'radiant', 'radiance', 'luminous', 'luminescent'
      ],
      priority: 1
    },

    // === EDUCATION & PROFESSIONAL (Priority 1) ===
    {
      icon: GraduationCap,
      keywords: [
        'graduation', 'graduations', 'graduate', 'graduates', 'diploma', 'diplomas',
        'degree', 'degrees', 'school', 'schools', 'education', 'educational', 'academic',
        'academics', 'university', 'universities', 'college', 'colleges', 'student',
        'students', 'study', 'studies', 'learning', 'learn', 'teach', 'teaching',
        'class', 'classes', 'course', 'courses', 'semester', 'semesters'
      ],
      priority: 1
    },
    {
      icon: Briefcase,
      keywords: [
        'corporate', 'corporation', 'business', 'businesses', 'office', 'offices',
        'professional', 'professionals', 'work', 'working', 'workplace', 'workplaces',
        'meeting', 'meetings', 'conference', 'conferences', 'boardroom', 'boardrooms',
        'executive', 'executives', 'manager', 'managers', 'team', 'teams', 'colleague',
        'colleagues', 'career', 'careers', 'job', 'jobs', 'employment', 'employer'
      ],
      priority: 1
    },

    // === ACTIVITIES & HOBBIES (Priority 2) ===
    {
      icon: Dumbbell,
      keywords: [
        'sport', 'sports', 'athletic', 'athletics', 'athlete', 'athletes', 'fitness',
        'gym', 'gyms', 'workout', 'workouts', 'exercise', 'exercises', 'training',
        'trainings', 'strength', 'strong', 'muscle', 'muscles', 'bodybuilding',
        'crossfit', 'yoga', 'pilates', 'running', 'runner', 'runners', 'jogging',
        'cycling', 'cyclist', 'cyclists', 'swimming', 'swimmer', 'swimmers'
      ],
      priority: 2
    },
    {
      icon: Gamepad2,
      keywords: [
        'game', 'games', 'gaming', 'gamer', 'gamers', 'play', 'playing', 'player',
        'players', 'arcade', 'arcades', 'console', 'consoles', 'video game',
        'video games', 'esports', 'tournament', 'tournaments', 'competition',
        'competitions', 'championship', 'championships'
      ],
      priority: 2
    },
    {
      icon: Music,
      keywords: [
        'music', 'musical', 'musician', 'musicians', 'song', 'songs', 'singing',
        'singer', 'singers', 'concert', 'concerts', 'gig', 'gigs', 'band', 'bands',
        'orchestra', 'orchestras', 'symphony', 'symphonies', 'performance', 'performances',
        'show', 'shows', 'live', 'stage', 'stages', 'venue', 'venues', 'festival',
        'festivals', 'dj', 'djs', 'dj set', 'dj sets', 'sound', 'sounds', 'audio'
      ],
      priority: 2
    },
    {
      icon: Mic,
      keywords: [
        'mic', 'microphone', 'microphones', 'sing', 'singing', 'singer', 'singers',
        'vocal', 'vocals', 'voice', 'voices', 'karaoke', 'recording', 'recordings',
        'studio', 'studios', 'podcast', 'podcasts', 'broadcast', 'broadcasts',
        'announcement', 'announcements', 'speech', 'speeches', 'presentation', 'presentations'
      ],
      priority: 2
    },
    {
      icon: Palette,
      keywords: [
        'art', 'arts', 'artistic', 'artist', 'artists', 'painting', 'paintings',
        'paint', 'drawing', 'drawings', 'draw', 'sketch', 'sketches', 'sketching',
        'creative', 'creativity', 'creativity', 'design', 'designs', 'designer',
        'designers', 'canvas', 'canvases', 'brush', 'brushes', 'color', 'colors',
        'colour', 'colours', 'artwork', 'artworks', 'masterpiece', 'masterpieces'
      ],
      priority: 2
    },
    {
      icon: Brush,
      keywords: [
        'design', 'designs', 'designer', 'designers', 'styling', 'style', 'styles',
        'fashion', 'fashionable', 'fashionista', 'fashionistas', 'outfit', 'outfits',
        'wardrobe', 'wardrobes', 'clothing', 'clothes', 'apparel', 'garment', 'garments',
        'trend', 'trends', 'trendy', 'vogue', 'couture', 'boutique', 'boutiques',
        'brand', 'brands', 'branding', 'identity', 'identities', 'logo', 'logos',
        'typography', 'typeface', 'typefaces', 'font', 'fonts', 'lettering',
        'retouch', 'retouching', 'retouched', 'edit', 'editing', 'edited', 'editor',
        'editors', 'post', 'post-production', 'postproduction', 'post process',
        'post-process', 'processing', 'processed', 'enhance', 'enhanced', 'enhancement',
        'enhancements', 'refine', 'refined', 'refinement', 'refinements', 'polish',
        'polished', 'finish', 'finished', 'final', 'finals', 'finalize', 'finalized',
        'deliverable', 'deliverables', 'delivery', 'client', 'clients', 'customer',
        'customers', 'project', 'projects', 'brief', 'briefs', 'proposal', 'proposals',
        'mockup', 'mockups', 'prototype', 'prototypes', 'draft', 'drafts', 'revision',
        'revisions', 'version', 'versions', 'iteration', 'iterations', 'round', 'rounds'
      ],
      priority: 2
    },
    {
      icon: Scissors,
      keywords: [
        'hair', 'hairs', 'hairstyle', 'hairstyles', 'haircut', 'haircuts', 'salon',
        'salons', 'barber', 'barbers', 'beauty', 'beautiful', 'beautician', 'beauticians',
        'stylist', 'stylists', 'makeup', 'cosmetic', 'cosmetics', 'grooming', 'trim',
        'trims', 'trimming', 'cut', 'cuts', 'cutting'
      ],
      priority: 2
    },

    // === FOOD & DINING (Priority 2) ===
    {
      icon: Utensils,
      keywords: [
        'food', 'foods', 'dining', 'dine', 'restaurant', 'restaurants', 'meal', 'meals',
        'dinner', 'dinners', 'lunch', 'lunches', 'breakfast', 'breakfasts', 'brunch',
        'brunches', 'cuisine', 'cuisines', 'dish', 'dishes', 'recipe', 'recipes',
        'cooking', 'cook', 'cooks', 'chef', 'chefs', 'kitchen', 'kitchens', 'eat',
        'eating', 'taste', 'tastes', 'tasting', 'flavor', 'flavors', 'flavour', 'flavours'
      ],
      priority: 2
    },
    {
      icon: Coffee,
      keywords: [
        'coffee', 'coffees', 'cafe', 'cafes', 'café', 'cafés', 'barista', 'baristas',
        'espresso', 'espressos', 'latte', 'lattes', 'cappuccino', 'cappuccinos',
        'mocha', 'mochas', 'brew', 'brews', 'brewing', 'roast', 'roasts', 'roasting',
        'bean', 'beans', 'cup', 'cups', 'mug', 'mugs'
      ],
      priority: 2
    },
    {
      icon: Cake,
      keywords: [
        'cake', 'cakes', 'dessert', 'desserts', 'sweet', 'sweets', 'candy', 'candies',
        'chocolate', 'chocolates', 'ice cream', 'ice creams', 'pastry', 'pastries',
        'bake', 'baking', 'baker', 'bakers', 'bakery', 'bakeries', 'treat', 'treats',
        'delicious', 'yummy', 'tasty', 'sugar', 'sugary'
      ],
      priority: 2
    },

    // === TRAVEL & TRANSPORTATION (Priority 2) ===
    {
      icon: Plane,
      keywords: [
        'travel', 'travels', 'traveling', 'travelling', 'trip', 'trips', 'vacation',
        'vacations', 'holiday', 'holidays', 'journey', 'journeys', 'adventure',
        'adventures', 'explore', 'explores', 'exploring', 'exploration', 'explorations',
        'tour', 'tours', 'tourist', 'tourists', 'tourism', 'destination', 'destinations',
        'plane', 'planes', 'airplane', 'airplanes', 'flight', 'flights', 'airport',
        'airports', 'airline', 'airlines', 'fly', 'flying', 'pilot', 'pilots'
      ],
      priority: 2
    },
    {
      icon: Car,
      keywords: [
        'car', 'cars', 'automobile', 'automobiles', 'vehicle', 'vehicles', 'driving',
        'drive', 'drives', 'driver', 'drivers', 'road', 'roads', 'road trip', 'road trips',
        'highway', 'highways', 'street', 'streets', 'motor', 'motors', 'motorcycle',
        'motorcycles', 'bike', 'bikes', 'bicycle', 'bicycles'
      ],
      priority: 2
    },
    {
      icon: Ship,
      keywords: [
        'ship', 'ships', 'boat', 'boats', 'cruise', 'cruises', 'sailing', 'sail',
        'sails', 'sailor', 'sailors', 'yacht', 'yachts', 'ferry', 'ferries', 'harbor',
        'harbors', 'harbour', 'harbours', 'port', 'ports', 'ocean', 'oceans', 'sea',
        'seas', 'marine', 'maritime', 'nautical', 'naval'
      ],
      priority: 2
    },

    // === NATURE & OUTDOORS (Priority 2) ===
    {
      icon: Mountain,
      keywords: [
        'mountain', 'mountains', 'hiking', 'hike', 'hikes', 'hiker', 'hikers',
        'climb', 'climbs', 'climbing', 'climber', 'climbers', 'summit', 'summits',
        'peak', 'peaks', 'trail', 'trails', 'path', 'paths', 'nature', 'natural',
        'outdoor', 'outdoors', 'wilderness', 'landscape', 'landscapes', 'scenery',
        'scenic', 'view', 'views', 'vista', 'vistas', 'panorama', 'panoramas'
      ],
      priority: 2
    },
    {
      icon: Waves,
      keywords: [
        'beach', 'beaches', 'ocean', 'oceans', 'sea', 'seas', 'water', 'waters',
        'wave', 'waves', 'surf', 'surfs', 'surfing', 'surfer', 'surfers', 'swim',
        'swims', 'swimming', 'swimmer', 'swimmers', 'dive', 'dives', 'diving', 'diver',
        'divers', 'coast', 'coasts', 'coastal', 'shore', 'shores', 'sand', 'sands',
        'sandy', 'tide', 'tides', 'marine', 'aquatic'
      ],
      priority: 2
    },
    {
      icon: TreePine,
      keywords: [
        'forest', 'forests', 'tree', 'trees', 'woods', 'woodland', 'woodlands',
        'jungle', 'jungles', 'park', 'parks', 'garden', 'gardens', 'garden', 'gardening',
        'green', 'greenery', 'foliage', 'leaf', 'leaves', 'branch', 'branches',
        'nature', 'natural', 'wild', 'wildlife', 'camping', 'camp', 'camps'
      ],
      priority: 2
    },
    {
      icon: Flower2,
      keywords: [
        'flower', 'flowers', 'bloom', 'blooms', 'blooming', 'blossom', 'blossoms',
        'blossoming', 'garden', 'gardens', 'gardening', 'rose', 'roses', 'tulip',
        'tulips', 'daisy', 'daisies', 'petal', 'petals', 'bouquet', 'bouquets',
        'floral', 'botanical', 'plant', 'plants', 'planting', 'spring', 'summer'
      ],
      priority: 2
    },
    {
      icon: Sun,
      keywords: [
        'sun', 'suns', 'sunny', 'sunshine', 'sunlight', 'sunset', 'sunsets', 'sunrise',
        'sunsets', 'day', 'days', 'daylight', 'bright', 'brightness', 'warm', 'warmth',
        'warm weather', 'summer', 'summers', 'beach', 'beaches', 'outdoor', 'outdoors',
        'tan', 'tanning', 'solar', 'golden hour', 'golden hours'
      ],
      priority: 2
    },
    {
      icon: Moon,
      keywords: [
        'moon', 'moons', 'moonlight', 'night', 'nights', 'nighttime', 'dark', 'darkness',
        'evening', 'evenings', 'dusk', 'dawn', 'stars', 'star', 'starry', 'starlight',
        'constellation', 'constellations', 'galaxy', 'galaxies', 'cosmic', 'space',
        'astronomy', 'astronomical', 'midnight', 'late night', 'late nights'
      ],
      priority: 2
    },
    {
      icon: Cloud,
      keywords: [
        'cloud', 'clouds', 'cloudy', 'sky', 'skies', 'weather', 'atmospheric',
        'atmosphere', 'air', 'wind', 'winds', 'breeze', 'breezes', 'storm', 'storms',
        'stormy', 'rain', 'rains', 'rainy', 'snow', 'snows', 'snowy', 'fog', 'foggy'
      ],
      priority: 2
    },

    // === LOCATIONS & VENUES (Priority 2) ===
    {
      icon: Home,
      keywords: [
        'home', 'homes', 'house', 'houses', 'residence', 'residences', 'residential',
        'dwelling', 'dwellings', 'abode', 'abodes', 'domestic', 'household', 'households',
        'living', 'room', 'rooms', 'interior', 'interiors', 'indoor', 'indoors'
      ],
      priority: 2
    },
    {
      icon: Church,
      keywords: [
        'church', 'churches', 'chapel', 'chapels', 'temple', 'temples', 'cathedral',
        'cathedrals', 'sanctuary', 'sanctuaries', 'worship', 'religious', 'religion',
        'faith', 'prayer', 'prayers', 'spiritual', 'spirituality', 'sacred', 'holy',
        'divine', 'blessing', 'blessings', 'ceremony', 'ceremonies'
      ],
      priority: 2
    },
    {
      icon: Building,
      keywords: [
        'building', 'buildings', 'architecture', 'architectural', 'architect', 'architects',
        'structure', 'structures', 'construction', 'construct', 'constructs', 'design',
        'designs', 'skyscraper', 'skyscrapers', 'tower', 'towers', 'venue', 'venues',
        'hall', 'halls', 'ballroom', 'ballrooms', 'convention', 'conventions', 'center',
        'centers', 'centre', 'centres', 'facility', 'facilities'
      ],
      priority: 2
    },

    // === PRODUCTS & ITEMS (Priority 2) ===
    {
      icon: Gem,
      keywords: [
        'jewelry', 'jewellery', 'jewel', 'jewels', 'diamond', 'diamonds', 'ring', 'rings',
        'necklace', 'necklaces', 'bracelet', 'bracelets', 'earring', 'earrings', 'precious',
        'precious stones', 'gem', 'gems', 'gemstone', 'gemstones', 'treasure', 'treasures',
        'valuable', 'valuables', 'luxury', 'luxurious', 'expensive', 'fine', 'finer'
      ],
      priority: 2
    },
    {
      icon: Shirt,
      keywords: [
        'clothing', 'clothes', 'apparel', 'garment', 'garments', 'outfit', 'outfits',
        'wardrobe', 'wardrobes', 'fashion', 'fashionable', 'style', 'styles', 'shirt',
        'shirts', 'dress', 'dresses', 'suit', 'suits', 'jacket', 'jackets', 'wear',
        'wearing', 'attire', 'costume', 'costumes'
      ],
      priority: 2
    },
    {
      icon: Watch,
      keywords: [
        'watch', 'watches', 'timepiece', 'timepieces', 'clock', 'clocks', 'time', 'times',
        'hour', 'hours', 'minute', 'minutes', 'second', 'seconds', 'tick', 'ticks',
        'ticking', 'chronograph', 'chronographs', 'wristwatch', 'wristwatches'
      ],
      priority: 2
    },
    {
      icon: ShoppingBag,
      keywords: [
        'shopping', 'shop', 'shops', 'retail', 'store', 'stores', 'boutique', 'boutiques',
        'mall', 'malls', 'market', 'markets', 'purchase', 'purchases', 'buy', 'buys',
        'buying', 'sale', 'sales', 'deal', 'deals', 'discount', 'discounts', 'bargain',
        'bargains', 'merchandise', 'product', 'products', 'item', 'items'
      ],
      priority: 2
    },
    {
      icon: Gift,
      keywords: [
        'gift', 'gifts', 'present', 'presents', 'surprise', 'surprises', 'surprising',
        'package', 'packages', 'box', 'boxes', 'wrapped', 'wrapping', 'unwrap', 'unwrapping',
        'give', 'gives', 'giving', 'receive', 'receives', 'receiving', 'generous', 'generosity'
      ],
      priority: 2
    },

    // === CREATIVE PROJECTS & WORKFLOW (Priority 2) ===
    {
      icon: Folder,
      keywords: [
        'project', 'projects', 'folder', 'folders', 'directory', 'directories',
        'client', 'clients', 'customer', 'customers', 'brief', 'briefs',
        'proposal', 'proposals', 'contract', 'contracts', 'invoice', 'invoices',
        'deliverable', 'deliverables', 'delivery', 'deliveries', 'final', 'finals',
        'draft', 'drafts', 'revision', 'revisions', 'version', 'versions',
        'iteration', 'iterations', 'round', 'rounds', 'phase', 'phases',
        'stage', 'stages', 'step', 'steps', 'process', 'processes', 'workflow',
        'workflows', 'pipeline', 'pipelines', 'archive', 'archives', 'archived',
        'backup', 'backups', 'backed up', 'storage', 'storages', 'file', 'files'
      ],
      priority: 2
    },
    {
      icon: FileText,
      keywords: [
        'document', 'documents', 'documentation', 'note', 'notes', 'memo', 'memos',
        'report', 'reports', 'summary', 'summaries', 'brief', 'briefs', 'briefing',
        'briefings', 'spec', 'specs', 'specification', 'specifications', 'requirement',
        'requirements', 'checklist', 'checklists', 'todo', 'todos', 'task', 'tasks',
        'agenda', 'agendas', 'meeting', 'meetings', 'call', 'calls', 'conference',
        'conferences', 'presentation', 'presentations', 'pitch', 'pitches', 'deck',
        'decks', 'slide', 'slides', 'deck', 'decks'
      ],
      priority: 2
    },
    {
      icon: Layers,
      keywords: [
        'layer', 'layers', 'layered', 'stack', 'stacks', 'stacked', 'overlay',
        'overlays', 'overlaid', 'composite', 'composites', 'compositing', 'merge',
        'merges', 'merged', 'blend', 'blends', 'blended', 'mask', 'masks', 'masked',
        'group', 'groups', 'grouped', 'organize', 'organized', 'organization',
        'organizations', 'structure', 'structures', 'structured', 'hierarchy',
        'hierarchies', 'categorize', 'categorized', 'category', 'categories',
        'tag', 'tags', 'tagged', 'label', 'labels', 'labeled', 'metadata', 'meta'
      ],
      priority: 2
    },
    {
      icon: Zap,
      keywords: [
        'quick', 'quickly', 'fast', 'faster', 'fastest', 'speed', 'speeds',
        'rapid', 'rapidly', 'instant', 'instantly', 'immediate', 'immediately',
        'urgent', 'urgently', 'rush', 'rushed', 'rush job', 'rush jobs',
        'deadline', 'deadlines', 'due', 'overdue', 'priority', 'priorities',
        'important', 'critical', 'crucial', 'essential', 'vital', 'pressing',
        'asap', 'as soon as possible', 'emergency', 'emergencies', 'hot', 'hotfix',
        'hotfixes', 'fix', 'fixes', 'fixed', 'bug', 'bugs', 'issue', 'issues'
      ],
      priority: 2
    },
    {
      icon: Target,
      keywords: [
        'target', 'targets', 'targeted', 'goal', 'goals', 'objective', 'objectives',
        'aim', 'aims', 'aimed', 'focus', 'focused', 'focused', 'concentrate',
        'concentrated', 'precision', 'precise', 'accurately', 'accuracy', 'exact',
        'exactly', 'specific', 'specifically', 'particular', 'particularly',
        'strategic', 'strategy', 'strategies', 'plan', 'plans', 'planned',
        'planning', 'roadmap', 'roadmaps', 'milestone', 'milestones', 'benchmark',
        'benchmarks', 'kpi', 'kpis', 'metric', 'metrics', 'measure', 'measures',
        'measured', 'measurement', 'measurements', 'track', 'tracks', 'tracked',
        'tracking', 'monitor', 'monitors', 'monitored', 'monitoring', 'analyze',
        'analyzed', 'analysis', 'analyses', 'insight', 'insights', 'data', 'datas'
      ],
      priority: 2
    },
    {
      icon: Rocket,
      keywords: [
        'launch', 'launches', 'launched', 'launching', 'release', 'releases',
        'released', 'releasing', 'deploy', 'deploys', 'deployed', 'deploying',
        'deployment', 'deployments', 'go live', 'going live', 'went live',
        'live', 'lives', 'published', 'publish', 'publishes', 'publishing',
        'publication', 'publications', 'public', 'publicly', 'ship', 'ships',
        'shipped', 'shipping', 'deliver', 'delivers', 'delivered', 'delivering',
        'delivery', 'deliveries', 'complete', 'completed', 'completing', 'completion',
        'completions', 'finish', 'finishes', 'finished', 'finishing', 'final',
        'finals', 'finalize', 'finalized', 'finalizing', 'finalization', 'done',
        'ready', 'readiness', 'prepared', 'preparation', 'preparations', 'set',
        'sets', 'setup', 'setups', 'configure', 'configured', 'configuring',
        'configuration', 'configurations', 'production', 'productions', 'prod'
      ],
      priority: 2
    },
    {
      icon: Lightbulb,
      keywords: [
        'idea', 'ideas', 'concept', 'concepts', 'conceptual', 'conceptualize',
        'conceptualized', 'brainstorm', 'brainstorms', 'brainstorming', 'inspiration',
        'inspirations', 'inspired', 'inspire', 'inspires', 'inspiring', 'creative',
        'creativity', 'innovative', 'innovation', 'innovations', 'innovate',
        'innovated', 'innovating', 'invent', 'invents', 'invented', 'inventing',
        'invention', 'inventions', 'discover', 'discovers', 'discovered',
        'discovering', 'discovery', 'discoveries', 'explore', 'explores', 'explored',
        'exploring', 'exploration', 'explorations', 'experiment', 'experiments',
        'experimental', 'experimenting', 'test', 'tests', 'tested', 'testing',
        'prototype', 'prototypes', 'prototyping', 'mockup', 'mockups', 'mock',
        'mocks', 'wireframe', 'wireframes', 'sketch', 'sketches', 'sketching',
        'draft', 'drafts', 'rough', 'roughs', 'rough draft', 'rough drafts',
        'blueprint', 'blueprints', 'plan', 'plans', 'planned', 'planning'
      ],
      priority: 2
    },
    {
      icon: Wand2,
      keywords: [
        'magic', 'magical', 'transform', 'transforms', 'transformed', 'transforming',
        'transformation', 'transformations', 'enhance', 'enhances', 'enhanced',
        'enhancing', 'enhancement', 'enhancements', 'improve', 'improves',
        'improved', 'improving', 'improvement', 'improvements', 'polish', 'polishes',
        'polished', 'polishing', 'refine', 'refines', 'refined', 'refining',
        'refinement', 'refinements', 'perfect', 'perfects', 'perfected', 'perfecting',
        'perfection', 'optimize', 'optimizes', 'optimized', 'optimizing',
        'optimization', 'optimizations', 'tweak', 'tweaks', 'tweaked', 'tweaking',
        'adjust', 'adjusts', 'adjusted', 'adjusting', 'adjustment', 'adjustments',
        'fine-tune', 'fine-tuned', 'fine-tuning', 'tune', 'tunes', 'tuned', 'tuning',
        'retouch', 'retouches', 'retouched', 'retouching', 'retouching', 'edit',
        'edits', 'edited', 'editing', 'editor', 'editors', 'post', 'post-production',
        'postproduction', 'post process', 'post-process', 'processing', 'processed',
        'grade', 'grades', 'graded', 'grading', 'color grade', 'color grading',
        'colour grade', 'colour grading', 'color correct', 'color correction',
        'colour correct', 'colour correction', 'correct', 'corrects', 'corrected',
        'correcting', 'correction', 'corrections'
      ],
      priority: 2
    },
    {
      icon: PenTool,
      keywords: [
        'draw', 'draws', 'drew', 'drawn', 'drawing', 'sketch', 'sketches', 'sketched',
        'sketching', 'illustrate', 'illustrates', 'illustrated', 'illustrating',
        'illustration', 'illustrations', 'illustrator', 'illustrators', 'design',
        'designs', 'designed', 'designing', 'designer', 'designers', 'create',
        'creates', 'created', 'creating', 'creation', 'creations', 'creative',
        'creativity', 'art', 'arts', 'artistic', 'artist', 'artists', 'artwork',
        'artworks', 'paint', 'paints', 'painted', 'painting', 'paintings', 'brush',
        'brushes', 'pen', 'pens', 'pencil', 'pencils', 'marker', 'markers', 'ink',
        'inks', 'ink', 'digital', 'digitally', 'vector', 'vectors', 'raster',
        'rasters', 'graphic', 'graphics', 'visual', 'visually', 'visualize',
        'visualized', 'visualizing', 'visualization', 'visualizations'
      ],
      priority: 2
    },
    {
      icon: Ruler,
      keywords: [
        'measure', 'measures', 'measured', 'measuring', 'measurement', 'measurements',
        'dimension', 'dimensions', 'dimensional', 'size', 'sizes', 'sized', 'sizing',
        'scale', 'scales', 'scaled', 'scaling', 'proportion', 'proportions',
        'proportional', 'ratio', 'ratios', 'aspect ratio', 'aspect ratios',
        'resolution', 'resolutions', 'pixel', 'pixels', 'dpi', 'ppi', 'format',
        'formats', 'formatted', 'formatting', 'specification', 'specifications',
        'spec', 'specs', 'standard', 'standards', 'standardized', 'standardization',
        'guideline', 'guidelines', 'rule', 'rules', 'ruled', 'template', 'templates',
        'templated', 'preset', 'presets', 'predefined', 'pre-set', 'pre-set',
        'grid', 'grids', 'gridded', 'align', 'aligns', 'aligned', 'aligning',
        'alignment', 'alignments', 'spacing', 'spacings', 'spaced', 'margin',
        'margins', 'padding', 'paddings', 'padded', 'border', 'borders', 'bordered'
      ],
      priority: 2
    },
    {
      icon: Compass,
      keywords: [
        'direction', 'directions', 'directional', 'guide', 'guides', 'guided',
        'guiding', 'guidance', 'navigate', 'navigates', 'navigated', 'navigating',
        'navigation', 'navigations', 'orient', 'orients', 'oriented', 'orienting',
        'orientation', 'orientations', 'compass', 'compasses', 'map', 'maps',
        'mapped', 'mapping', 'mappings', 'route', 'routes', 'routed', 'routing',
        'path', 'paths', 'journey', 'journeys', 'travel', 'travels', 'traveled',
        'travelled', 'traveling', 'travelling', 'explore', 'explores', 'explored',
        'exploring', 'exploration', 'explorations', 'discover', 'discovers',
        'discovered', 'discovering', 'discovery', 'discoveries', 'find', 'finds',
        'found', 'finding', 'search', 'searches', 'searched', 'searching', 'seek',
        'seeks', 'sought', 'seeking', 'look', 'looks', 'looked', 'looking', 'view',
        'views', 'viewed', 'viewing', 'perspective', 'perspectives', 'angle',
        'angles', 'angled', 'position', 'positions', 'positioned', 'positioning',
        'location', 'locations', 'located', 'locating', 'place', 'places', 'placed',
        'placing', 'spot', 'spots', 'spotted', 'spotting', 'site', 'sites', 'sited',
        'siting', 'venue', 'venues', 'scene', 'scenes', 'setting', 'settings', 'set',
        'sets', 'background', 'backgrounds', 'foreground', 'foregrounds'
      ],
      priority: 2
    },
    {
      icon: Eye,
      keywords: [
        'view', 'views', 'viewed', 'viewing', 'preview', 'previews', 'previewed',
        'previewing', 'review', 'reviews', 'reviewed', 'reviewing', 'inspect',
        'inspects', 'inspected', 'inspecting', 'inspection', 'inspections', 'examine',
        'examines', 'examined', 'examining', 'examination', 'examinations', 'check',
        'checks', 'checked', 'checking', 'verify', 'verifies', 'verified', 'verifying',
        'verification', 'verifications', 'validate', 'validates', 'validated',
        'validating', 'validation', 'validations', 'approve', 'approves', 'approved',
        'approving', 'approval', 'approvals', 'quality', 'qualities', 'quality check',
        'quality checks', 'qc', 'qa', 'quality assurance', 'quality control',
        'test', 'tests', 'tested', 'testing', 'audit', 'audits', 'audited', 'auditing',
        'audit', 'audits', 'proof', 'proofs', 'proofed', 'proofing', 'proofread',
        'proofreads', 'proofread', 'proofreading', 'look', 'looks', 'looked', 'looking',
        'see', 'sees', 'saw', 'seen', 'seeing', 'watch', 'watches', 'watched',
        'watching', 'observe', 'observes', 'observed', 'observing', 'observation',
        'observations', 'monitor', 'monitors', 'monitored', 'monitoring', 'visual',
        'visually', 'visualize', 'visualized', 'visualizing', 'visualization',
        'visualizations', 'display', 'displays', 'displayed', 'displaying', 'show',
        'shows', 'showed', 'shown', 'showing', 'exhibit', 'exhibits', 'exhibited',
        'exhibiting', 'exhibition', 'exhibitions', 'gallery', 'galleries', 'gallery view',
        'gallery views'
      ],
      priority: 2
    },
    {
      icon: Search,
      keywords: [
        'search', 'searches', 'searched', 'searching', 'find', 'finds', 'found',
        'finding', 'seek', 'seeks', 'sought', 'seeking', 'look', 'looks', 'looked',
        'looking', 'look for', 'looking for', 'looked for', 'hunt', 'hunts', 'hunted',
        'hunting', 'discover', 'discovers', 'discovered', 'discovering', 'discovery',
        'discoveries', 'explore', 'explores', 'explored', 'exploring', 'exploration',
        'explorations', 'browse', 'browses', 'browsed', 'browsing', 'scan', 'scans',
        'scanned', 'scanning', 'filter', 'filters', 'filtered', 'filtering', 'sort',
        'sorts', 'sorted', 'sorting', 'organize', 'organizes', 'organized',
        'organizing', 'organization', 'organizations', 'categorize', 'categorizes',
        'categorized', 'categorizing', 'category', 'categories', 'tag', 'tags',
        'tagged', 'tagging', 'label', 'labels', 'labeled', 'labeling', 'keyword',
        'keywords', 'query', 'queries', 'queried', 'querying', 'term', 'terms',
        'filter by', 'filtered by', 'sort by', 'sorted by', 'group by', 'grouped by',
        'search for', 'searched for', 'searching for', 'find all', 'found all',
        'locate', 'locates', 'located', 'locating', 'location', 'locations', 'track',
        'tracks', 'tracked', 'tracking', 'trace', 'traces', 'traced', 'tracing'
      ],
      priority: 2
    },

    // === MEDIA TYPES (Priority 3 - Lower priority, too generic) ===
    {
      icon: Video,
      keywords: [
        'video', 'videos', 'movie', 'movies', 'film', 'films', 'filming', 'cinema',
        'cinemas', 'cinematic', 'recording', 'recordings', 'record', 'records',
        'footage', 'footages', 'clip', 'clips', 'reel', 'reels', 'production', 'productions',
        'videography', 'videographer', 'videographers', 'camera', 'cameras', 'lens',
        'lenses', 'shot', 'shots', 'shooting', 'shoot', 'shoots', 'session', 'sessions',
        'b-roll', 'broll', 'b roll', 'a-roll', 'aroll', 'a roll', 'interview',
        'interviews', 'testimonial', 'testimonials', 'commercial', 'commercials',
        'advertisement', 'advertisements', 'ad', 'ads', 'promo', 'promos', 'promotional',
        'trailer', 'trailers', 'teaser', 'teasers', 'highlight', 'highlights',
        'montage', 'montages', 'edit', 'edits', 'edited', 'editing', 'editor',
        'editors', 'post', 'post-production', 'postproduction', 'post process',
        'post-process', 'processing', 'processed', 'color grade', 'color grading',
        'colour grade', 'colour grading', 'color correct', 'color correction',
        'colour correct', 'colour correction', 'audio', 'audios', 'sound', 'sounds',
        'music', 'musical', 'score', 'scores', 'soundtrack', 'soundtracks', 'voice',
        'voices', 'voiceover', 'voiceovers', 'narration', 'narrations', 'narrator',
        'narrators', 'animation', 'animations', 'animated', 'animate', 'animates',
        'motion', 'motions', 'motion graphics', 'motiongraphics', 'mograph', 'vfx',
        'visual effects', 'visualeffects', 'effects', 'effect', 'transition',
        'transitions', 'cut', 'cuts', 'cutting', 'timeline', 'timelines', 'sequence',
        'sequences', 'scene', 'scenes', 'take', 'takes', 'angle', 'angles', 'framing',
        'frame', 'frames', 'framed', 'composition', 'compositions', 'lighting',
        'lights', 'light', 'strobe', 'strobes', 'flash', 'flashes', 'gimbal',
        'gimbals', 'stabilizer', 'stabilizers', 'drone', 'drones', 'aerial', 'aerials',
        '4k', '4k video', '8k', '8k video', 'hd', 'high definition', 'highdefinition',
        'uhd', 'ultra hd', 'ultrahd', 'resolution', 'resolutions', 'fps', 'frame rate',
        'framerate', 'slow motion', 'slowmotion', 'slow-motion', 'time-lapse',
        'timelapse', 'time lapse', 'hyperlapse', 'hyper-lapse', 'hyper lapse'
      ],
      priority: 3
    },
    {
      icon: Camera,
      keywords: [
        'photo', 'photos', 'photograph', 'photographs', 'photography', 'photographer',
        'photographers', 'image', 'images', 'picture', 'pictures', 'pic', 'pics',
        'snap', 'snaps', 'snapshot', 'snapshots', 'shot', 'shots', 'shooting',
        'camera', 'cameras', 'lens', 'lenses', 'shutter', 'shutters',
        'shoot', 'shoots', 'session', 'sessions', 'studio', 'studios', 'location',
        'locations', 'on location', 'on-location', 'onlocation', 'outdoor', 'outdoors',
        'indoor', 'indoors', 'bts', 'behind the scenes', 'behind-the-scenes',
        'behindthescenes', 'backstage', 'backstage', 'setup', 'setups', 'setup',
        'lighting', 'lights', 'light', 'strobe', 'strobes', 'flash', 'flashes',
        'raw', 'raws', 'unedited', 'original', 'originals', 'source', 'sources',
        'archive', 'archives', 'archived', 'backup', 'backups', 'backed up',
        'portfolio', 'portfolios', 'gallery', 'galleries', 'collection', 'collections',
        'editorial', 'editorials', 'commercial', 'commercials', 'advertising', 'ad',
        'ads', 'campaign', 'campaigns', 'lifestyle', 'lifestyles', 'documentary',
        'documentaries', 'fashion', 'fashionable', 'street', 'streets', 'street style',
        'streetstyle', 'urban', 'portrait', 'portraits', 'landscape', 'landscapes',
        'nature', 'wildlife', 'macro', 'product', 'products', 'still life', 'still-life',
        'stilllife', 'event', 'events', 'wedding', 'weddings', 'corporate', 'corporate',
        'headshot', 'headshots', 'boudoir', 'boudoirs', 'maternity', 'newborn',
        'newborns', 'family', 'families', 'engagement', 'engagements', 'senior',
        'seniors', 'graduation', 'graduations', 'prom', 'proms', 'quinceanera',
        'quinceaneras', 'bar mitzvah', 'bar mitzvahs', 'bat mitzvah', 'bat mitzvahs'
      ],
      priority: 3
    },
    {
      icon: Images,
      keywords: [
        'image', 'images', 'gallery', 'galleries', 'album', 'albums', 'collection',
        'collections', 'portfolio', 'portfolios', 'showcase', 'showcases', 'display',
        'displays', 'exhibition', 'exhibitions', 'artwork', 'artworks'
      ],
      priority: 3
    },
    {
      icon: Sparkles,
      keywords: [
        'highlight', 'highlights', 'featured', 'feature', 'features', 'best', 'top',
        'special', 'exceptional', 'magic', 'magical', 'sparkle', 'sparkles', 'sparkling',
        'glitter', 'glitters', 'glittering', 'shine', 'shines', 'shining', 'brilliant',
        'brilliance', 'radiant', 'radiance', 'luminous', 'luminescent', 'glow', 'glows',
        'glowing', 'twinkle', 'twinkles', 'twinkling'
      ],
      priority: 3
    },
    {
      icon: Grid3x3,
      keywords: [
        'all', 'everything', 'complete', 'comprehensive', 'full', 'entire', 'total',
        'whole', 'general', 'misc', 'miscellaneous', 'other', 'others', 'various',
        'assorted', 'mixed', 'diverse', 'collection', 'collections', 'set', 'sets'
      ],
      priority: 3
    },
  ]

  // Create a fast lookup map for exact matches
  const exactMatchMap = new Map([
    ['highlights', Sparkles],
    ['all', Grid3x3],
    ['photos', Grid3x3],
    ['images', Images],
    ['video', Video],
    ['videos', Video],
    ['film', Film],
  ])

  // Pre-sort mappings by priority for efficient iteration
  const sortedMappings = [...iconMappings].sort((a, b) => a.priority - b.priority)

  /**
   * Get icon for a set based on name and description
   * @param {string} tabName - The tab/set name
   * @param {Object} set - Optional set object with name and description
   * @returns {Component} - Vue component for the icon
   */
  const getIcon = (tabName, set = null) => {
    if (!tabName) return Grid3x3

    // Normalize tab name
    const normalizedTab = tabName.toLowerCase().trim()

    // Check exact matches first (fastest)
    if (exactMatchMap.has(normalizedTab)) {
      return exactMatchMap.get(normalizedTab)
    }

    // Build search text from tab name, set name, and description
    const searchText = [tabName, set?.name, set?.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .trim()

    if (!searchText) return Grid3x3

    // Find matching icon based on keywords (sorted by priority)
    for (const { keywords, icon } of sortedMappings) {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        return icon
      }
    }

    // Default fallback
    return Grid3x3
  }

  return {
    getIcon,
  }
}

