
// Simple mock waste recognition service
// In a real application, this would use an ML model or API

// Types of waste
export type WasteType = 
  | 'Recyclable Paper'
  | 'Recyclable Plastic'
  | 'Recyclable Glass'
  | 'Recyclable Metal'
  | 'Organic Waste'
  | 'E-Waste'
  | 'Hazardous Waste'
  | 'Non-recyclable Waste'
  | 'Unknown';

// Mock identification function
export const identifyWasteType = async (imageFile: File): Promise<WasteType> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real application, we would:
  // 1. Send the image to a backend API or use a client-side ML model
  // 2. Process the image to identify the waste type
  // 3. Return detailed results
  
  // For demonstration, we'll return a random waste type
  const wasteTypes: WasteType[] = [
    'Recyclable Paper',
    'Recyclable Plastic',
    'Recyclable Glass',
    'Recyclable Metal',
    'Organic Waste',
    'E-Waste',
    'Hazardous Waste',
    'Non-recyclable Waste'
  ];
  
  const randomIndex = Math.floor(Math.random() * wasteTypes.length);
  return wasteTypes[randomIndex];
};

// Function to determine if a waste type is recyclable
export const isRecyclable = (wasteType: WasteType): boolean => {
  return wasteType.toLowerCase().includes('recyclable');
};

// Function to get recommendations based on waste type
export const getWasteRecommendations = (wasteType: WasteType): string[] => {
  const recommendations: Record<WasteType, string[]> = {
    'Recyclable Paper': [
      'Remove any plastic or metal attachments',
      'Keep paper dry and clean',
      'Flatten cardboard boxes',
      'Check with local recycling center for specific guidelines'
    ],
    'Recyclable Plastic': [
      'Rinse containers to remove food residue',
      'Remove caps and lids',
      'Check the recycling number (1-7) at the bottom',
      'Compress bottles to save space'
    ],
    'Recyclable Glass': [
      'Rinse thoroughly',
      'Separate by color if required locally',
      'Remove lids and corks',
      'Don't break the glass - it's easier to recycle whole'
    ],
    'Recyclable Metal': [
      'Rinse food cans',
      'Remove paper labels when possible',
      'Compress to save space',
      'Keep aerosol cans separate'
    ],
    'Organic Waste': [
      'Use for composting',
      'Remove any non-biodegradable wrappers',
      'Consider a home composting system',
      'Check for local municipal composting programs'
    ],
    'E-Waste': [
      'Never throw in regular trash',
      'Find authorized e-waste collection centers',
      'Wipe personal data before disposal',
      'Consider donating working electronics'
    ],
    'Hazardous Waste': [
      'Never mix with regular waste',
      'Store in original containers',
      'Take to designated hazardous waste facilities',
      'Follow local disposal guidelines carefully'
    ],
    'Non-recyclable Waste': [
      'Reduce usage of non-recyclable items',
      'Look for recyclable alternatives',
      'Dispose according to local guidelines',
      'Consider reuse options before disposal'
    ],
    'Unknown': [
      'Check with local waste management for proper disposal',
      'Consider if the item can be reused or repurposed',
      'Look for recycling symbols or markings on the item'
    ]
  };
  
  return recommendations[wasteType] || recommendations['Unknown'];
};
