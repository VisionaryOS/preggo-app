export interface WeekData {
  babySize: string;
  babyImage: string;
  babyDevelopment: string[];
  motherChanges: string[];
  tips: string[];
}

export type WeeklyDataType = Record<number, WeekData>;

// Determine which trimester a week falls into
export const getTrimester = (week: number): string => {
  if (week <= 13) return "First Trimester";
  if (week <= 26) return "Second Trimester";
  return "Third Trimester";
};

// Sample weekly data for pregnancy information
export const weeklyData: WeeklyDataType = {
  1: {
    babySize: 'Poppy seed',
    babyImage: '🌱',
    babyDevelopment: [
      'The fertilized egg implants in the uterus',
      'Cells start dividing rapidly',
      'The placenta begins to form'
    ],
    motherChanges: [
      'You might not feel different yet',
      'Some may experience light spotting',
      'Hormone levels begin to change'
    ],
    tips: [
      'Start taking prenatal vitamins with folic acid',
      'Avoid alcohol and smoking',
      'Schedule your first prenatal appointment'
    ]
  },
  4: {
    babySize: 'Poppy seed',
    babyImage: '🌱',
    babyDevelopment: [
      'Your baby\'s neural tube is forming',
      'The foundation for all major organs is in place',
      'The placenta continues to develop'
    ],
    motherChanges: [
      'You may experience morning sickness',
      'Fatigue is common',
      'Your breasts might be tender'
    ],
    tips: [
      'Stay hydrated',
      'Eat small, frequent meals to help with nausea',
      'Get plenty of rest'
    ]
  },
  8: {
    babySize: 'Raspberry',
    babyImage: '🫐',
    babyDevelopment: [
      'All essential organs have begun to form',
      'Tiny fingers and toes are developing',
      'The heart is beating'
    ],
    motherChanges: [
      'Morning sickness may peak',
      'Your uterus is the size of a large orange',
      'You may need to urinate more frequently'
    ],
    tips: [
      'Eat protein-rich foods',
      'Consider a pregnancy-safe exercise routine',
      'Avoid raw or undercooked foods'
    ]
  },
  12: {
    babySize: 'Lime',
    babyImage: '🍋',
    babyDevelopment: [
      'Fingernails and toenails are forming',
      'Reflexes are developing',
      'Your baby can make facial expressions'
    ],
    motherChanges: [
      'Morning sickness may subside',
      'You may start showing',
      'Energy levels may improve'
    ],
    tips: [
      'Stay active with pregnancy-safe exercises',
      'Consider prenatal yoga',
      'Start researching childbirth classes'
    ]
  },
  16: {
    babySize: 'Avocado',
    babyImage: '🥑',
    babyDevelopment: [
      'The skeleton is forming',
      'The skin is transparent but thickening',
      'Movement becomes more coordinated'
    ],
    motherChanges: [
      'Your baby bump is now visible',
      'You may feel your baby move (quickening)',
      'Hair and nails grow faster'
    ],
    tips: [
      'Schedule your mid-pregnancy ultrasound',
      'Start sleeping on your side',
      'Consider a pregnancy pillow for comfort'
    ]
  },
  20: {
    babySize: 'Banana',
    babyImage: '🍌',
    babyDevelopment: [
      'Hair is growing on the head',
      'The baby is covered in vernix (protective coating)',
      'All organs continue to mature'
    ],
    motherChanges: [
      'Your uterus reaches your belly button',
      'You may experience heartburn',
      'Ankles and feet might swell'
    ],
    tips: [
      'Stay hydrated',
      'Begin considering your birth plan',
      'Monitor your baby\'s movements'
    ]
  },
  24: {
    babySize: 'Corn',
    babyImage: '🌽',
    babyDevelopment: [
      'Fingerprints and footprints are formed',
      'The baby responds to sounds',
      'Lung development continues'
    ],
    motherChanges: [
      'You might experience Braxton Hicks contractions',
      'Back pain may increase',
      'You can feel regular movements'
    ],
    tips: [
      'Do pelvic floor exercises',
      'Consider a glucose screening test',
      'Start researching childcare options if needed'
    ]
  },
  28: {
    babySize: 'Eggplant',
    babyImage: '🍆',
    babyDevelopment: [
      'Eyes can open and close',
      'Brain tissue continues to develop',
      'Lungs are developing surfactant'
    ],
    motherChanges: [
      'You may have trouble sleeping',
      'Shortness of breath is common',
      'Varicose veins may appear'
    ],
    tips: [
      'Start counting kicks daily',
      'Consider taking a hospital tour',
      'Pack your hospital bag'
    ]
  },
  32: {
    babySize: 'Coconut',
    babyImage: '🥥',
    babyDevelopment: [
      'The baby is gaining weight rapidly',
      'The five senses are fully developed',
      'The baby practices breathing movements'
    ],
    motherChanges: [
      'Frequent urination returns',
      'Braxton Hicks contractions increase',
      'You may experience heartburn and indigestion'
    ],
    tips: [
      'Finalize your birth plan',
      'Learn about breastfeeding if you plan to do so',
      'Rest when you can'
    ]
  },
  36: {
    babySize: 'Cantaloupe',
    babyImage: '🍈',
    babyDevelopment: [
      'The baby is nearly full term',
      'Most babies turn head-down position',
      'Lungs are almost fully mature'
    ],
    motherChanges: [
      'Breathing might become easier as baby drops',
      'You may feel more pressure on your pelvis',
      'Trouble sleeping is common'
    ],
    tips: [
      'Monitor for signs of labor',
      'Prepare your home for the baby',
      'Rest and conserve energy'
    ]
  },
  40: {
    babySize: 'Watermelon',
    babyImage: '🍉',
    babyDevelopment: [
      'Your baby is fully developed',
      'The average weight is about 7.5 pounds',
      'The immune system continues to develop'
    ],
    motherChanges: [
      'You may feel ready for labor to start',
      'The cervix begins to efface and dilate',
      'You might notice the mucus plug'
    ],
    tips: [
      'Know the signs of labor',
      'Rest as much as possible',
      'Stay near home and close to your hospital'
    ]
  }
}; 