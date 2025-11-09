// config/falAI.js
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Get available AI services
export const getAIServices = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/ai-services`);
    if (response.ok) {
      const data = await response.json();
      return data.services;
    }
    return [];
  } catch (error) {
    console.error('Error getting AI services:', error);
    return [];
  }
};

// Generate with selected AI service
export const generateWithAI = async (prompt, type = 'logo', aiService = 'fal-ai') => {
  try {
    console.log(`🎨 Generating with ${aiService}:`, prompt);
    
    const response = await fetch(`${SERVER_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        type,
        aiService
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ ${aiService} generation:`, data.message);
    
    if (data.success && data.base64) {
      return data.base64;
    } else {
      throw new Error(data.error || 'No image data in response');
    }
  } catch (error) {
    console.error(`💥 ${aiService} generation error:`, error);
    throw error;
  }
};

// Backward compatibility
export const generateWithFAL = (prompt, type = 'logo') => {
  return generateWithAI(prompt, type, 'fal-ai');
};

export const isFALConfigured = async () => {
  try {
    const services = await getAIServices();
    const falService = services.find(s => s.id === 'fal-ai');
    return falService ? falService.available : false;
  } catch (error) {
    return false;
  }
};

// Check server health
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error checking server health:', error);
    return null;
  }
};

// Test AI service
export const testAIService = async (aiService = 'pollinations') => {
  try {
    const response = await fetch(`${SERVER_URL}/api/test-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aiService }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error(`Test failed: ${response.status}`);
  } catch (error) {
    console.error('AI service test failed:', error);
    throw error;
  }
};