// FAL AI Style Presets optimized for text-to-image merchandise design
export const FALStylePresets = {
  streetwear: {
    name: "Streetwear",
    emoji: "👕",
    prompt: "urban streetwear design, bold typography, graffiti art, urban fashion, edgy graphics, limited color palette, street art style, modern urban",
    colors: ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1']
  },
  minimalist: {
    name: "Minimalist", 
    emoji: "⚪",
    prompt: "minimalist design, clean typography, simple geometric shapes, negative space, elegant, sophisticated, modern, clean lines, subtle",
    colors: ['#FFFFFF', '#000000', '#666666', '#F0F0F0', '#333333']
  },
  vaporwave: {
    name: "Vaporwave",
    emoji: "🌊",
    prompt: "vaporwave aesthetic, retro 80s design, pastel colors, glitch art, cyberpunk, neon colors, surreal, nostalgic, synthwave style",
    colors: ['#FF6B6B', '#4ECDC4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  },
  tech: {
    name: "Tech",
    emoji: "💻",
    prompt: "tech futuristic design, cyberpunk style, glowing elements, circuit patterns, digital art, holographic effects, futuristic technology, sci-fi",
    colors: ['#00FFFF', '#FF00FF', '#000000', '#00FF00', '#0000FF']
  },
  nature: {
    name: "Nature",
    emoji: "🌿",
    prompt: "nature inspired design, botanical illustrations, organic shapes, floral patterns, leaves, natural elements, earthy tones, plant life",
    colors: ['#2E8B57', '#8FBC8F', '#DAA520', '#CD5C5C', '#4682B4']
  },
  abstract: {
    name: "Abstract",
    emoji: "🎨",
    prompt: "abstract art, colorful geometric patterns, modern art, painterly effects, expressive brush strokes, contemporary art, artistic composition",
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  },
  retro: {
    name: "Retro",
    emoji: "🕹️",
    prompt: "retro vintage design, 80s 90s aesthetic, nostalgic graphics, classic style, old school design, retro gaming art, vintage typography",
    colors: ['#FF6B6B', '#4ECDC4', '#FFD700', '#8A2BE2', '#FF6347']
  },
  geometric: {
    name: "Geometric",
    emoji: "🔷",
    prompt: "geometric patterns, mathematical shapes, precise lines, polygons, structured design, modern geometry, abstract shapes, symmetrical patterns",
    colors: ['#000000', '#FFFFFF', '#FF6B6B', '#45B7D1', '#FFEAA7']
  }
};

export const getStyleRecommendation = (productType, currentColor) => {
  const recommendations = {
    tshirt: ['streetwear', 'minimalist', 'vaporwave', 'retro'],
    mug: ['minimalist', 'nature', 'abstract', 'geometric'],
    cap: ['streetwear', 'tech', 'abstract', 'geometric']
  };
  
  return recommendations[productType] || ['minimalist', 'abstract', 'geometric'];
};