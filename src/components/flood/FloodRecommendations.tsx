
import React from 'react';
import { Check } from 'lucide-react';

interface FloodRecommendationsProps {
  floodType: string;
}

const FloodRecommendations: React.FC<FloodRecommendationsProps> = ({ floodType }) => {
  const getFloodRecommendations = (type: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'Flood area identified': [
        'Stay away from flooded areas',
        'Do not attempt to walk or drive through flooded areas',
        'Move to higher ground if in danger',
        'Follow instructions from local authorities'
      ],
      'Minor flooding': [
        'Avoid walking through moving water',
        'Be prepared to evacuate if necessary',
        'Keep important documents in waterproof containers',
        'Turn off electricity if water has entered your home'
      ],
      'Severe flooding': [
        'Evacuate immediately if instructed',
        'Do not touch electrical equipment if wet',
        'Avoid contact with flood water as it may be contaminated',
        'Report broken utility lines to authorities'
      ]
    };
    
    return recommendations[type] || [
      'Report the flood to local authorities',
      'Stay informed about weather updates',
      'Prepare an emergency kit',
      'Follow evacuation routes if necessary'
    ];
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
      <ul className="space-y-2">
        {getFloodRecommendations(floodType).map((rec, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FloodRecommendations;
