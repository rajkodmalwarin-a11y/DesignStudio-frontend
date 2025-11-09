import React, { useState } from 'react';
import CustomButton from './CustomButton';

const AIStylePresets = {
  streetwear: { emoji: '🛹', name: 'Streetwear', prompt: "urban streetwear style, edgy, bold graphics, limited color palette, trendy" },
  minimalist: { emoji: '⚪', name: 'Minimalist', prompt: "minimalist design, clean, simple, elegant, negative space, modern" },
  vaporwave: { emoji: '🌴', name: 'Vaporwave', prompt: "vaporwave aesthetic, retro, synthwave, pastel colors, 80s aesthetic" },
  tech: { emoji: '💻', name: 'Tech', prompt: "tech futuristic style, cyberpunk, glowing elements, circuit patterns, digital" },
  nature: { emoji: '🌿', name: 'Nature', prompt: "organic, natural elements, botanical, earthy tones, flowing patterns" },
  abstract: { emoji: '🎨', name: 'Abstract', prompt: "abstract art, geometric patterns, bold colors, modern art, creative" }
};

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  const [selectedStyle, setSelectedStyle] = useState('streetwear');

  return (
    <div className="aipicker-container">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            🎨 Describe Your Design
          </label>
          <textarea 
            placeholder="e.g., 'cyberpunk dragon with neon glow'"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="aipicker-textarea"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            🎭 Choose A Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(AIStylePresets).map(([key, style]) => (
              <button
                key={key}
                className={`style-preset ${
                  selectedStyle === key ? 'active' : 'bg-muted/50 hover:bg-muted'
                }`}
                onClick={() => setSelectedStyle(key)}
              >
                <span className="text-xs">{style.emoji}</span>
                <span className="text-xs">{style.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="🪄 Generating Magic..."
            customStyles="w-full text-sm"
            disabled={true}
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="🎯 Logo Only"
              handleClick={() => handleSubmit('logo', selectedStyle)}
              customStyles="flex-1 text-sm"
            />
            <CustomButton 
              type="filled"
              title="🎨 Full Design"
              handleClick={() => handleSubmit('full', selectedStyle)}
              customStyles="flex-1 text-sm"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;