
import React from 'react';
import { Check } from 'lucide-react';

interface ElectricityRecommendationsProps {
  issueType: string;
}

const ElectricityRecommendations: React.FC<ElectricityRecommendationsProps> = ({ issueType }) => {
  const getElectricityRecommendations = (type: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'Electricity issue identified': [
        'Stay away from fallen power lines',
        'Report the issue to your electricity provider',
        'Turn off appliances during power outages',
        'Use flashlights instead of candles during outages'
      ],
      'Power outage': [
        'Keep refrigerator and freezer doors closed',
        'Unplug electronic devices to protect from surges',
        'Check if neighbors are also affected',
        'Contact electricity provider for estimated restoration time'
      ],
      'Damaged infrastructure': [
        'Do not approach damaged electrical equipment',
        'Keep a safe distance from fallen power lines',
        'Report immediately to emergency services',
        'Warn others to stay away from the area'
      ]
    };
    
    return recommendations[type] || [
      'Report the issue to your electricity provider',
      'Follow safety guidelines for electrical issues',
      'Keep emergency contact numbers handy',
      'Use battery-powered devices during outages'
    ];
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
      <ul className="space-y-2">
        {getElectricityRecommendations(issueType).map((rec, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectricityRecommendations;
