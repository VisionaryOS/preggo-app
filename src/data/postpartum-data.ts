import { PostpartumWeekData, WeeklyPostpartumData } from '@/types/journey.types';

export const postpartumData: WeeklyPostpartumData = {
  1: {
    babyDevelopment: [
      'Your newborn can recognize your voice and smell',
      'They can see objects 8-12 inches from their face',
      'Reflexes like rooting and sucking are strong'
    ],
    motherRecovery: [
      'Your body is still recovering from childbirth',
      'You may experience afterpains as your uterus contracts',
      'Lochia (postpartum bleeding) will continue for several weeks'
    ],
    milestones: [
      'First feeding session',
      'First diaper change',
      'First time sleeping at home'
    ],
    tips: [
      'Sleep when your baby sleeps',
      'Accept help from friends and family',
      'Be gentle with yourself during this transition'
    ]
  },
  2: {
    babyDevelopment: [
      'Baby may begin to lift head briefly during tummy time',
      'Their eyes can track moving objects nearby',
      'Baby is starting to develop more regular sleep patterns'
    ],
    motherRecovery: [
      'Your uterus continues to shrink back to pre-pregnancy size',
      'Breast engorgement may peak around this time',
      'Hormone levels are still adjusting'
    ],
    milestones: [
      'First pediatrician visit',
      'Umbilical cord stump often falls off',
      'More alert periods during the day'
    ],
    tips: [
      'Establish a simple routine for feeding and sleeping',
      'Continue to limit visitors if you need rest',
      'Hydrate well, especially if breastfeeding'
    ]
  },
  4: {
    babyDevelopment: [
      'Baby may start to smile socially',
      'Neck muscles are getting stronger',
      'Your baby is more alert and interactive'
    ],
    motherRecovery: [
      'Postpartum bleeding should be tapering off',
      'Your body is shifting toward a new normal',
      'Breastfeeding may become more established if nursing'
    ],
    milestones: [
      'First social smile',
      'Better head control',
      'May sleep for longer stretches at night'
    ],
    tips: [
      'Try gentle postpartum exercises if cleared by your provider',
      'Connect with other new parents',
      'Take photos - they change so quickly!'
    ]
  },
  8: {
    babyDevelopment: [
      'Baby might start rolling over',
      'Laughing and babbling sounds begin',
      'Recognition of familiar faces improves'
    ],
    motherRecovery: [
      'You may be feeling physically stronger',
      'Sleep deprivation might still be challenging',
      'Postpartum checkup usually happens around this time'
    ],
    milestones: [
      'Better hand coordination',
      'First rolling over (some babies)',
      'More vocalization and "conversations"'
    ],
    tips: [
      'Establish a bedtime routine',
      'Consider joining a parent-baby class',
      'Remember self-care is essential'
    ]
  },
  12: {
    babyDevelopment: [
      'Sitting with support or independently',
      'Responding to their name',
      'May show interest in solid foods'
    ],
    motherRecovery: [
      'Your body has mostly recovered from childbirth',
      'Hormone levels are stabilizing',
      'May be returning to work (if applicable)'
    ],
    milestones: [
      'Beginning to sit unassisted',
      'Interest in objects and toys increases',
      'May be ready to try solid foods'
    ],
    tips: [
      'Prepare for sleep regressions around this time',
      'Research introducing solid foods',
      'Find balance if returning to work'
    ]
  },
  16: {
    babyDevelopment: [
      'Crawling or pre-crawling movements',
      'First teeth may emerge',
      'Understanding of object permanence develops'
    ],
    motherRecovery: [
      'Feeling more like yourself physically',
      'Adjusting to your new identity as a mother',
      'Finding new routines and rhythms'
    ],
    milestones: [
      'Mobility increases (crawling or scooting)',
      'Stronger sitting skills',
      'First teeth often appear'
    ],
    tips: [
      'Childproof your home for a mobile baby',
      'Establish good dental habits early',
      'Connect with other parents of similar-aged babies'
    ]
  },
  20: {
    babyDevelopment: [
      'May be pulling to stand',
      'Increased understanding of language',
      'More intentional communication'
    ],
    motherRecovery: [
      'Finding your stride in motherhood',
      'Balancing various responsibilities',
      'May be thinking about future family planning'
    ],
    milestones: [
      'Cruising along furniture',
      'More defined nap schedule',
      'Responds to simple instructions'
    ],
    tips: [
      'Continue childproofing for a standing baby',
      'Engage in reading and language activities',
      'Schedule time for yourself regularly'
    ]
  },
  24: {
    babyDevelopment: [
      'May be taking first steps',
      'Vocabulary increases',
      'More independent play'
    ],
    motherRecovery: [
      'Completing your first year of motherhood',
      'Reflecting on the journey so far',
      'Planning for the toddler years ahead'
    ],
    milestones: [
      'Walking independently (for many babies)',
      'Speaking first words',
      'More defined personality traits emerging'
    ],
    tips: [
      'Celebrate your first year of parenthood',
      'Prepare for the transition to toddlerhood',
      'Consider weaning strategies if still breastfeeding'
    ]
  }
};

// Helper function to find the nearest week data if exact week doesn't exist
export const getPostpartumWeekData = (week: number): PostpartumWeekData => {
  if (postpartumData[week]) {
    return postpartumData[week];
  }
  
  // Find the closest week in our dataset
  const weeks = Object.keys(postpartumData).map(Number);
  const closestWeek = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  
  return postpartumData[closestWeek];
}; 