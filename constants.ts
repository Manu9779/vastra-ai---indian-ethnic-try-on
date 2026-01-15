
import { ClothingItem, Gender, ColorSwatch } from './types';

export const BODY_SHAPES = [
  'Hourglass',
  'Pear',
  'Rectangle',
  'Inverted Triangle',
  'Apple',
  'Athletic'
];

export const SKIN_TONES = [
  'Fair',
  'Light',
  'Medium',
  'Wheatish',
  'Dusky',
  'Deep'
];

export const ETHNIC_COLORS: ColorSwatch[] = [
  { name: 'Deep Maroon', hex: '#5b0000', prompt: 'royal deep maroon' },
  { name: 'Royal Blue', hex: '#002366', prompt: 'majestic royal blue' },
  { name: 'Emerald', hex: '#046307', prompt: 'rich emerald green' },
  { name: 'Mustard', hex: '#daa520', prompt: 'traditional mustard yellow gold' },
  { name: 'Peach', hex: '#ffccb3', prompt: 'soft pastel peach' },
  { name: 'Gold', hex: '#cfb53b', prompt: 'antique metallic gold' },
  { name: 'Jet Black', hex: '#1a1a1a', prompt: 'jet black with subtle sheen' },
  { name: 'Ivory', hex: '#fffff0', prompt: 'elegant ivory cream' }
];

export const CLOTHING_DATABASE: ClothingItem[] = [
  // --- FEMALE: SILK SAREE (4) ---
  {
    id: 'fs-1',
    name: 'Royal Banarasi Silk',
    category: 'Silk saree',
    price: 24500,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/2f/ee/47/2fee473e70109de73f0e58968385e723.jpg',
    description: 'A masterpiece of Banarasi weaving with heavy Zari work and floral motifs.',
    suitableShapes: ['Hourglass', 'Rectangle', 'Inverted Triangle'],
    availableColors: ETHNIC_COLORS.slice(0, 3)
  },
  {
    id: 'fs-2',
    name: 'Emerald Kanjeevaram',
    category: 'Silk saree',
    price: 32000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/ed/a5/84/eda58417e9b89e112f89f7cc6b2652c4.jpg',
    description: 'Traditional temple border silk saree from the heart of Kanchipuram.',
    suitableShapes: ['Rectangle', 'Athletic', 'Hourglass'],
    availableColors: [ETHNIC_COLORS[2], ETHNIC_COLORS[5]]
  },
  {
    id: 'fs-3',
    name: 'Midnight Paithani',
    category: 'Silk saree',
    price: 19800,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/88/f4/ca/88f4caa9827c815004444185857fd333.jpg',
    description: 'Features a beautiful peacock motif pallu in vibrant silk threads.',
    suitableShapes: ['Pear', 'Hourglass', 'Apple'],
    availableColors: [ETHNIC_COLORS[1], ETHNIC_COLORS[0]]
  },
  {
    id: 'fs-4',
    name: 'Ivory Tussar Silk',
    category: 'Silk saree',
    price: 15600,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/e7/5b/5d/e75b5d4797706a55ec03b353197cb6aa.jpg',
    description: 'Raw silk texture with hand-painted Madhubani art on the border.',
    suitableShapes: ['Rectangle', 'Inverted Triangle', 'Athletic']
  },

  // --- FEMALE: BRIDAL LEHENGA (4) ---
  {
    id: 'fl-1',
    name: 'Ruby Velvet Bridal Lehenga',
    category: 'Bridal lehenga',
    price: 85000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/5c/8d/c9/5c8dc9b1d55d02b5cef74f3a0575d58e.jpg',
    description: 'Ultra-luxurious velvet lehenga with heavy Zardosi and crystal work.',
    suitableShapes: ['Hourglass', 'Pear', 'Rectangle'],
    availableColors: [ETHNIC_COLORS[0], ETHNIC_COLORS[2]]
  },
  {
    id: 'fl-2',
    name: 'Ivory Mirror Work Lehenga',
    category: 'Bridal lehenga',
    price: 65000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/83/61/49/836149b521375bc4cff3cd1d95aca089.jpg',
    description: 'Contemporary bridal look with thousands of hand-stitched mirrors.',
    suitableShapes: ['Inverted Triangle', 'Athletic', 'Hourglass']
  },
  {
    id: 'fl-3',
    name: 'Pastel Rose Silk Lehenga',
    category: 'Bridal lehenga',
    price: 72000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/a1/22/ed/a122eda09bc2139703e490a6c36b6276.jpg',
    description: 'Soft pink silk with delicate floral embroidery and a sequin dupatta.',
    suitableShapes: ['Pear', 'Apple', 'Rectangle']
  },
  {
    id: 'fl-4',
    name: 'Golden Heritage Lehenga',
    category: 'Bridal lehenga',
    price: 98000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/a1/42/7f/a1427f8b93f1a61246ef849f45b1cf03.jpg',
    description: 'Antique gold Zari on heavy raw silk, designed for a royal wedding.',
    suitableShapes: ['Hourglass', 'Inverted Triangle', 'Athletic']
  },

  // --- FEMALE: DAILY WEAR SALWAR SUITS (4) ---
  {
    id: 'fw-1',
    name: 'Peach Cotton Patiala',
    category: 'Daily wear salwar suits',
    price: 3500,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/64/c4/8f/64c48f6717b43d613ad707cc44bcca60.jpg',
    description: 'Comfortable daily wear cotton suit with a vibrant printed dupatta.',
    suitableShapes: ['Apple', 'Pear', 'Rectangle']
  },
  {
    id: 'fw-2',
    name: 'Indigo Block Print Suit',
    category: 'Daily wear salwar suits',
    price: 2800,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/ae/ec/33/aeec334db31f37d37f629b1a322413b7.jpg',
    description: 'Natural indigo dye with traditional Bagru block prints.',
    suitableShapes: ['Athletic', 'Rectangle', 'Inverted Triangle']
  },
  {
    id: 'fw-3',
    name: 'Mint Chanderi Straight Suit',
    category: 'Daily wear salwar suits',
    price: 5200,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/7a/74/cf/7a74cf211b9623adbdce8fd995157bfb.jpg',
    description: 'Elegant straight-cut suit in lightweight Chanderi silk-cotton.',
    suitableShapes: ['Hourglass', 'Rectangle', 'Athletic']
  },
  {
    id: 'fw-4',
    name: 'Mustard Chikankari Suit',
    category: 'Daily wear salwar suits',
    price: 6800,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/f5/38/cc/f538ccc59f943fcf7bfd730918aff1de.jpg',
    description: 'Hand-embroidered Lucknowi work on fine muslin fabric.',
    suitableShapes: ['Pear', 'Apple', 'Rectangle']
  },

  // --- FEMALE: ANARKALI SUITS (4) ---
  {
    id: 'fa-1',
    name: 'Ruby Bandhani Anarkali',
    category: 'Anarkali suits',
    price: 11200,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/86/8c/95/868c95d3a4559a25c853f88ff06d91df.jpg',
    description: 'Traditional red Bandhani print floor-length Anarkali.',
    suitableShapes: ['Inverted Triangle', 'Pear', 'Hourglass']
  },
  {
    id: 'fa-2',
    name: 'Midnight Georgette Anarkali',
    category: 'Anarkali suits',
    price: 9500,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/92/e2/9e/92e29e0148161fa47f3ccc197d35251a.jpg',
    description: 'Flowy georgette with silver Gota Patti work on the flares.',
    suitableShapes: ['Apple', 'Pear', 'Rectangle']
  },
  {
    id: 'fa-3',
    name: 'Forest Green Velvet Anarkali',
    category: 'Anarkali suits',
    price: 14500,
    gender: Gender.FEMALE,
    imageUrl: ' https://i.pinimg.com/736x/14/58/93/14589328e5df052261012b661f2afadb.jpg',
    description: 'Heavy velvet Anarkali with intricate Zardosi on the neckline.',
    suitableShapes: ['Hourglass', 'Rectangle', 'Inverted Triangle']
  },
  {
    id: 'fa-4',
    name: 'Pastel Lilac Net Anarkali',
    category: 'Anarkali suits',
    price: 8200,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/79/62/a2/7962a24fd668c8e9f96b30ef6518f71c.jpg',
    description: 'Ethereal net fabric with delicate sequin and thread embroidery.',
    suitableShapes: ['Pear', 'Athletic', 'Rectangle']
  },

  // --- FEMALE: PARTY GOWNS (4) ---
  {
    id: 'fg-1',
    name: 'Champagne Fusion Gown',
    category: 'Party gowns (Indo-Western)',
    price: 18500,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/02/a9/32/02a932c97a54c1c0fb68ceb144f83719.jpg',
    description: 'A contemporary draped gown with an ethnic embroidered belt.',
    suitableShapes: ['Hourglass', 'Inverted Triangle', 'Athletic']
  },
  {
    id: 'fg-2',
    name: 'Wine Cape Gown',
    category: 'Party gowns (Indo-Western)',
    price: 21000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/c5/02/56/c502567cd6bcd1d8ad7a95efbf5419f5.jpg',
    description: 'Floor-length gown with an attached sheer embroidered cape.',
    suitableShapes: ['Rectangle', 'Apple', 'Hourglass']
  },
  {
    id: 'fg-3',
    name: 'Teal Dhoti Style Gown',
    category: 'Party gowns (Indo-Western)',
    price: 16800,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/1200x/fe/d6/a9/fed6a9914403b245530659360be76b48.jpg',
    description: 'Indo-western fusion gown with dhoti-style draping at the bottom.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },
  {
    id: 'fg-4',
    name: 'Rose Gold Sequin Gown',
    category: 'Party gowns (Indo-Western)',
    price: 28000,
    gender: Gender.FEMALE,
    imageUrl: 'https://i.pinimg.com/736x/0c/cb/18/0ccb184446a80eefcbcd216e20c195f3.jpg',
    description: 'A high-octane party gown with geometric sequin patterns.',
    suitableShapes: ['Hourglass', 'Rectangle', 'Athletic']
  },

  // --- MALE: SHERWANI COLLECTION (4) ---
  {
    id: 'ms-1',
    name: 'Midnight Velvet Sherwani',
    category: 'Sherwani collection',
    price: 45000,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/91/b7/10/91b710daa6d0f5baf1e4daab048777cd.jpg',
    description: 'Exquisite bridal sherwani in midnight navy velvet with silver dabka.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },
  {
    id: 'ms-2',
    name: 'Imperial Ivory Sherwani',
    category: 'Sherwani collection',
    price: 55000,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/c4/7f/3b/c47f3b7369c0eb8a962f4d8d652fd3af.jpg',
    description: 'Royal ivory sherwani with tone-on-tone embroidery and antique buttons.',
    suitableShapes: ['Rectangle', 'Athletic', 'Hourglass']
  },
  {
    id: 'ms-3',
    name: 'Charcoal Bandhgala',
    category: 'Sherwani collection',
    price: 38000,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/00/33/fd/0033fddc8af81a66a128ed29265967f0.jpg',
    description: 'Classic Jodhpuri Bandhgala for formal ethnic events.',
    suitableShapes: ['Inverted Triangle', 'Athletic', 'Rectangle']
  },
  {
    id: 'ms-4',
    name: 'Golden Brocade Sherwani',
    category: 'Sherwani collection',
    price: 48000,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/8f/5f/02/8f5f02fcc03569c90d72580aebbcec89.jpg',
    description: 'Woven silk brocade in royal gold with maroon piping.',
    suitableShapes: ['Athletic', 'Rectangle', 'Inverted Triangle']
  },

  // --- MALE: KURTA SETS (4) ---
  {
    id: 'mk-1',
    name: 'Royal Blue Silk Kurta',
    category: 'Kurta sets',
    price: 4200,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/b4/33/b4/b433b421bb24568bb71594ea14e5f2f6.jpg',
    description: 'Premium silk-blend kurta with churidar pajama.',
    suitableShapes: ['Rectangle', 'Athletic', 'Hourglass']
  },
  {
    id: 'mk-2',
    name: 'Mint Lucknowi Kurta',
    category: 'Kurta sets',
    price: 8900,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/dc/38/69/dc386919777bbf9072a9ac97408fd207.jpg',
    description: 'Hand-embroidered Lucknowi Chikankari on soft georgette.',
    suitableShapes: ['Athletic', 'Rectangle', 'Apple']
  },
  {
    id: 'mk-3',
    name: 'Black Textured Silk Kurta',
    category: 'Kurta sets',
    price: 5500,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/e7/85/b1/e785b1f0d94c3254fff7fed15662e7ac.jpg',
    description: 'Modern minimalist black kurta with subtle self-texture.',
    suitableShapes: ['Inverted Triangle', 'Rectangle', 'Athletic']
  },
  {
    id: 'mk-4',
    name: 'Peach Cotton Linen Kurta',
    category: 'Kurta sets',
    price: 3200,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/ad/c8/71/adc8714618540287f4fc8d2c9f3d5812.jpg',
    description: 'Breathable cotton linen set for summer festivities.',
    suitableShapes: ['Rectangle', 'Apple', 'Athletic']
  },

  // --- MALE: PATHANI SUITS (4) ---
  {
    id: 'mp-1',
    name: 'Classic White Pathani',
    category: 'Pathani suits',
    price: 4800,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/51/01/db/5101db3b1883dc8e870bd51a3676f37d.jpg',
    description: 'Strong-shouldered cotton Pathani suit with pocket detailing.',
    suitableShapes: ['Inverted Triangle', 'Athletic', 'Rectangle']
  },
  {
    id: 'mp-2',
    name: 'Olive Green Pathani',
    category: 'Pathani suits',
    price: 5200,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/08/ab/24/08ab2445b4c980996f0bca21d9019d21.jpg',
    description: 'Earthy tone Pathani in thick khadi cotton.',
    suitableShapes: ['Athletic', 'Rectangle', 'Hourglass']
  },
  {
    id: 'mp-3',
    name: 'Navy Denim Pathani',
    category: 'Pathani suits',
    price: 6500,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/65/20/e7/6520e7313a35b451ad17982781a48077.jpg',
    description: 'Contemporary take with indigo dyed denim-finish cotton.',
    suitableShapes: ['Inverted Triangle', 'Rectangle', 'Athletic']
  },
  {
    id: 'mp-4',
    name: 'Rust Linen Pathani',
    category: 'Pathani suits',
    price: 5800,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/2c/3e/34/2c3e34df79f77f8c8aa7c7b89984b66a.jpg',
    description: 'Comfortable linen Pathani in a warm rust orange.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },

  // --- MALE: NEHRU JACKET SETS (4) ---
  {
    id: 'mn-1',
    name: 'Sunset Saffron Nehru Set',
    category: 'Nehru jacket sets',
    price: 12500,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/e3/a1/29/e3a129523842b2ccf58a56536acc537f.jpg',
    description: 'Saffron kurta with a floral woven Nehru jacket.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },
  {
    id: 'mn-2',
    name: 'Blue Silk Nehru Set',
    category: 'Nehru jacket sets',
    price: 10800,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/09/97/e6/0997e664178f46abc925d2ea18ec617f.jpg',
    description: 'Royal blue raw silk jacket over a white silk kurta.',
    suitableShapes: ['Rectangle', 'Athletic', 'Hourglass']
  },
  {
    id: 'mn-3',
    name: 'Grey Textured Nehru Set',
    category: 'Nehru jacket sets',
    price: 9200,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/69/d1/fe/69d1fe36ea87b2b18c82025da24b42ab.jpg',
    description: 'Matte grey textured jacket for a sophisticated daytime look.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },
  {
    id: 'mn-4',
    name: 'Emerald Velvet Nehru Set',
    category: 'Nehru jacket sets',
    price: 15600,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/cf/23/a0/cf23a0c6fa4f1aa4002005acec4a15f5.jpg',
    description: 'Deep green velvet jacket with antique gold buttons.',
    suitableShapes: ['Hourglass', 'Athletic', 'Inverted Triangle']
  },

  // --- MALE: DHOTI KURTA (4) ---
  {
    id: 'md-1',
    name: 'Traditional Bengali Dhoti Set',
    category: 'Dhoti kurta',
    price: 7800,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/43/87/56/438756f1afb29c63c93e1d60d81061d3.jpg',
    description: 'Classic silk-cotton kurta with a pleated white dhoti.',
    suitableShapes: ['Athletic', 'Inverted Triangle', 'Rectangle']
  },
  {
    id: 'md-2',
    name: 'South Silk Dhoti Kurta',
    category: 'Dhoti kurta',
    price: 11500,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/736x/c5/7f/4c/c57f4c79a236f3fb6224022661591636.jpg',
    description: 'Pure silk cream kurta with a matching gold border dhoti.',
    suitableShapes: ['Rectangle', 'Athletic', 'Hourglass']
  },
  {
    id: 'md-3',
    name: 'Red Embroidered Dhoti Set',
    category: 'Dhoti kurta',
    price: 9400,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/13/23/ac/1323acc6c3d537349d51b7176cc9e382.jpg',
    description: 'Vibrant red festive kurta with a contrasting beige dhoti.',
    suitableShapes: ['Inverted Triangle', 'Athletic', 'Rectangle']
  },
  {
    id: 'md-4',
    name: 'Pastel Blue Dhoti Kurta',
    category: 'Dhoti kurta',
    price: 6200,
    gender: Gender.MALE,
    imageUrl: 'https://i.pinimg.com/1200x/cc/b5/71/ccb571c6726787de46634b7582bf91f2.jpg',
    description: 'Lightweight summer dhoti set in breathable cotton.',
    suitableShapes: ['Athletic', 'Rectangle', 'Inverted Triangle']
  }
];
