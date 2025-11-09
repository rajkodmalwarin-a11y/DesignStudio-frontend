import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Palette, 
  Image, 
  Zap, 
  Type,
  Settings,
  X,
  Shirt,
  CupSoda,
  Scan,
  RotateCcw,
  RotateCw,
  Sparkles,
  RefreshCw,
  Trash2,
  Cpu
} from 'lucide-react';
import state from '../store';
import Canvas from '../canvas';
import ErrorBoundary from '../components/ErrorBoundary';
import { downloadCanvasToImage, reader, shareDesign } from '../config/helpers';
import { 
  generateWithAI, 
  isFALConfigured, 
  getAIServices 
} from '../config/falAI';
import { FALStylePresets, getStyleRecommendation } from '../config/falStyles';
import { historyActions } from '../store/history';
import { toast } from 'sonner';

const Customizer = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  
  // State Management
  const [activeTab, setActiveTab] = useState('color');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState(0.08);
  const [selectedStyle, setSelectedStyle] = useState('minimalist');
  const [serverOnline, setServerOnline] = useState(false);
  const [checkingServer, setCheckingServer] = useState(true);
  const [aiServices, setAIServices] = useState([]);
  const [selectedAIService, setSelectedAIService] = useState('fal-ai');

  // Constants
  const colorPresets = [
    '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#64748B', '#F97316', '#84CC16', '#06B6D4',
    '#6366F1', '#D946EF', '#F43F5E', '#1E40AF'
  ];

  const products = [
    { id: 'tshirt', name: 'T-Shirt', icon: Shirt, color: 'bg-blue-500' },
    { id: 'mug', name: 'Mug', icon: CupSoda, color: 'bg-green-500' },
    { id: 'cap', name: 'Cap', icon: Scan, color: 'bg-purple-500' },
  ];

  const recommendedStyles = getStyleRecommendation(snap.currentProduct, snap.color);

  // Effects
  useEffect(() => {
    historyActions.pushState(state);
    initializeServer();
    
    const interval = setInterval(initializeServer, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialization
  const initializeServer = async () => {
    try {
      setCheckingServer(true);
      const services = await getAIServices();
      setAIServices(services);
      
      const availableService = services.find(s => s.available);
      if (availableService) {
        setSelectedAIService(availableService.id);
      }
      
      const configured = await isFALConfigured();
      setServerOnline(configured);
      console.log(configured ? '✅ AI Server Connected' : '❌ AI Server Not Available');
    } catch (error) {
      console.log('❌ Server initialization failed:', error.message);
      setServerOnline(false);
    } finally {
      setCheckingServer(false);
    }
  };

  // Navigation & Actions
  const handleGoHome = () => navigate('/');

  const handleExport = () => {
    try {
      downloadCanvasToImage();
      toast.success('Design exported as PNG!');
    } catch (error) {
      toast.error('Failed to export image');
    }
  };

  const handleShare = async () => {
    try {
      await shareDesign(snap);
      toast.success('Design link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to share design');
    }
  };

  // Design Actions
  const handleColorChange = (color) => {
    historyActions.pushState(state);
    state.color = color;
    toast.success(`Color changed!`);
  };

  const handleProductChange = (product) => {
    historyActions.pushState(state);
    state.currentProduct = product;
    state.isLogoTexture = true;
    state.isFullTexture = false;
    toast.success(`Switched to ${product}`);
  };

  const applyStyleColors = (styleKey) => {
    historyActions.pushState(state);
    const style = FALStylePresets[styleKey];
    state.color = style.colors[0];
    toast.success(`Applied ${style.name} style colors`);
  };

  // File Upload
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = '';

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    historyActions.pushState(state);

    reader(file)
      .then((result) => {
        if (type === 'logo') {
          state.logoDecal = result;
          state.isLogoTexture = true;
          state.isFullTexture = false;
          toast.success('Logo applied successfully!');
        } else {
          state.fullDecal = result;
          state.isFullTexture = true;
          state.isLogoTexture = false;
          toast.success('Full design applied successfully!');
        }
      })
      .catch((error) => {
        console.error('File upload error:', error);
        toast.error('Failed to upload image. Please try another file.');
      });
  };

  const handleDecalToggle = (type) => {
    historyActions.pushState(state);
    if (type === 'logo') {
      state.isLogoTexture = !state.isLogoTexture;
      toast.success(state.isLogoTexture ? 'Logo enabled' : 'Logo disabled');
    } else {
      state.isFullTexture = !state.isFullTexture;
      toast.success(state.isFullTexture ? 'Full design enabled' : 'Full design disabled');
    }
  };

  // AI Generation
  const handleAISubmit = async (type) => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setGeneratingImg(true);
    try {
      console.log(`🔄 Starting ${selectedAIService} generation...`);
      
      if (!serverOnline) {
        toast.error('AI server not available');
        return;
      }
      
      const imageData = await generateWithAI(aiPrompt, type, selectedAIService);
      
      historyActions.pushState(state);
      
      // Clear and apply new texture
      if (type === 'logo') {
        state.logoDecal = null;
        setTimeout(() => {
          state.logoDecal = imageData;
          state.isLogoTexture = true;
          state.isFullTexture = false;
          state.currentStep = (state.currentStep || 0) + 1;
        }, 100);
      } else {
        state.fullDecal = null;
        setTimeout(() => {
          state.fullDecal = imageData;
          state.isFullTexture = true;
          state.isLogoTexture = false;
          state.currentStep = (state.currentStep || 0) + 1;
        }, 100);
      }
      
      const serviceName = selectedAIService === 'fal-ai' ? 'FAL AI' : 'Pollinations.ai';
      toast.success(`🎨 Design generated with ${serviceName}!`);
      setAiPrompt('');
      
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      toast.error(`Failed to generate: ${error.message}`);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleRemix = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Enter a prompt first to remix');
      return;
    }
    
    if (!serverOnline) {
      toast.error('AI server not available');
      return;
    }
    
    handleAISubmit(snap.isLogoTexture ? 'logo' : 'full');
  };

  // Text Management
  const handleTextAdd = () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text');
      return;
    }

    historyActions.pushState(state);

    const newText = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: textInput.trim(),
      color: textColor,
      size: textSize,
      timestamp: Date.now()
    };

    state.textElements = [...state.textElements, newText];
    toast.success(`"${textInput}" added to design!`);
    setTextInput('');
  };

  const handleTextRemove = (textId) => {
    historyActions.pushState(state);
    state.textElements = state.textElements.filter(text => text.id !== textId);
    toast.success('Text removed from design');
  };

  const handleClearAllText = () => {
    if (state.textElements.length === 0) {
      toast.info('No text to clear');
      return;
    }

    historyActions.pushState(state);
    state.textElements = [];
    toast.success('All text cleared from design');
  };

  // History Management
  const handleUndo = () => {
    const previousState = historyActions.undo();
    if (previousState) {
      Object.assign(state, previousState);
      toast.success('Undo successful');
    }
  };

  const handleRedo = () => {
    const nextState = historyActions.redo();
    if (nextState) {
      Object.assign(state, nextState);
      toast.success('Redo successful');
    }
  };

  // Render Components
  const renderAIServiceSelector = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">AI Service</label>
      <select
        value={selectedAIService}
        onChange={(e) => setSelectedAIService(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        disabled={generatingImg}
      >
        {aiServices.map(service => (
          <option 
            key={service.id} 
            value={service.id}
            disabled={!service.available}
            className={service.premium ? 'text-blue-600' : 'text-green-600'}
          >
            {service.name} {service.premium && '⭐'} {!service.available && '(Not configured)'}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {aiServices.find(s => s.id === selectedAIService)?.description}
        </span>
        {selectedAIService === 'pollinations' && (
          <span className="text-green-600 font-medium">Free</span>
        )}
      </div>
    </div>
  );

  const renderServerStatus = () => (
    <div className={`flex items-center gap-2 text-xs ${checkingServer ? 'text-yellow-600' : serverOnline ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${checkingServer ? 'bg-yellow-500 animate-pulse' : serverOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="hidden sm:inline">
        {checkingServer ? 'Checking Server...' : serverOnline ? 'AI Server Connected' : 'AI Server Offline'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:block font-medium">Home</span>
              </button>
              
              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={!historyActions.canUndo()}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!historyActions.canRedo()}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Redo (Ctrl+Y)"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Server Status Indicator */}
              {renderServerStatus()}
            </div>

            {/* Center - Product Info */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {snap.currentProduct}
              </div>
              <span className="text-gray-500 hidden sm:block">•</span>
              <span className="text-gray-500 text-sm hidden sm:block">Auto-saved</span>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:block">Share</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:block">Export PNG</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Tools Sidebar */}
        <AnimatePresence>
          {(mobileMenuOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="lg:w-80 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 lg:block relative h-fit lg:sticky lg:top-24"
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Studio</h2>
              <p className="text-gray-600 mb-6">Create amazing {snap.products[snap.currentProduct]?.name} designs</p>

              {/* Product Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Product</h3>
                <div className="grid grid-cols-3 gap-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductChange(product.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2 ${
                        snap.currentProduct === product.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${product.color} text-white`}>
                        <product.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{product.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Tabs */}
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 mb-6">
                {[
                  { id: 'color', icon: Palette, label: 'Color' },
                  { id: 'decals', icon: Image, label: 'Images' },
                  { id: 'ai', icon: Zap, label: 'AI' },
                  { id: 'text', icon: Type, label: 'Text' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tool Content */}
              <div className="space-y-6">
                {/* Color Picker */}
                {activeTab === 'color' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Color & Style</h3>
                    
                    {/* Recommended Styles */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Recommended for {snap.currentProduct}</span>
                      <div className="grid grid-cols-3 gap-2">
                        {recommendedStyles.map((styleKey) => {
                          const style = FALStylePresets[styleKey];
                          return (
                            <button
                              key={styleKey}
                              onClick={() => applyStyleColors(styleKey)}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-blue-300 transition-colors"
                            >
                              <span className="text-lg">{style.emoji}</span>
                              <span className="text-xs">{style.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-lg hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    {/* Current Color Display */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: snap.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Current Color</div>
                        <div className="text-xs text-gray-600">{snap.color}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                {activeTab === 'decals' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Image Management</h3>
                    
                    {/* Decal Toggles */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleDecalToggle('logo')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          snap.isLogoTexture
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="text-sm font-medium">Logo</div>
                        <div className="text-xs">{snap.isLogoTexture ? 'ON' : 'OFF'}</div>
                      </button>
                      <button
                        onClick={() => handleDecalToggle('full')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          snap.isFullTexture
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="text-sm font-medium">Full Design</div>
                        <div className="text-xs">{snap.isFullTexture ? 'ON' : 'OFF'}</div>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG with transparent background</p>
                      </label>
                      
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Upload Full Design</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'full')}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Will cover the entire product</p>
                      </label>
                    </div>

                    {/* 3D Controls Instructions */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-900 mb-2">🎯 3D Controls</h4>
                      <div className="space-y-2 text-xs text-purple-800">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>Click + drag to rotate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>Scroll to zoom</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>Right-click + drag to pan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Generation */}
                {activeTab === 'ai' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">AI Design Generator</h3>
                    
                    {/* AI Service Selector */}
                    {renderAIServiceSelector()}

                    {/* Server Status Warning */}
                    {!serverOnline && !checkingServer && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800 text-center">
                          🔑 AI Server requires setup. Please ensure:
                          <br />
                          1. Server is running on port 5000
                          <br />
                          2. Check server terminal for errors
                        </p>
                      </div>
                    )}

                    {checkingServer && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800 text-center">
                          🔄 Checking server connection...
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Describe your design</span>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g., a dragon breathing fire, anime style"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          disabled={generatingImg || checkingServer}
                        />
                      </label>

                      {/* Style Presets */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Style Presets</span>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(FALStylePresets).map(([key, style]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedStyle(key)}
                              disabled={generatingImg || checkingServer}
                              className={`p-2 rounded-lg border transition-all text-left ${
                                selectedStyle === key
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                              } disabled:opacity-50`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{style.emoji}</span>
                                <span className="text-xs font-medium">{style.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAISubmit('logo')}
                          disabled={generatingImg || !aiPrompt.trim() || !serverOnline || checkingServer}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="h-4 w-4" />
                          Logo Only
                        </button>
                        <button
                          onClick={() => handleAISubmit('full')}
                          disabled={generatingImg || !aiPrompt.trim() || !serverOnline || checkingServer}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="h-4 w-4" />
                          Full Design
                        </button>
                      </div>

                      {/* Remix Button */}
                      <button
                        onClick={handleRemix}
                        disabled={generatingImg || !aiPrompt.trim() || !serverOnline || checkingServer}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Remix Design
                      </button>

                      {generatingImg && (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <div className="text-sm text-gray-600">
                            {selectedAIService === 'fal-ai' ? 'FAL AI' : 'Pollinations.ai'} is creating your design...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Text Tool */}
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Add Text to Design</h3>
                    
                    <div className="space-y-4">
                      {/* Text Input */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Your Text
                        </label>
                        <input
                          type="text"
                          placeholder="Enter text to add to your design..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleTextAdd()}
                        />
                      </div>

                      {/* Text Color Picker */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Text Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            '#FFFFFF', '#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B',
                            '#8B5CF6', '#EC4899', '#64748B', '#F97316', '#84CC16', '#06B6D4'
                          ].map((color) => (
                            <button
                              key={color}
                              onClick={() => setTextColor(color)}
                              className={`w-8 h-8 rounded-lg border-2 ${
                                textColor === color ? 'border-blue-500' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Text Size */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Text Size
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { size: 'small', label: 'Small', value: 0.06 },
                            { size: 'medium', label: 'Medium', value: 0.08 },
                            { size: 'large', label: 'Large', value: 0.12 }
                          ].map((sizeOption) => (
                            <button
                              key={sizeOption.size}
                              onClick={() => setTextSize(sizeOption.value)}
                              className={`p-2 rounded-lg border text-sm ${
                                textSize === sizeOption.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {sizeOption.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add Text Button */}
                      <button
                        onClick={handleTextAdd}
                        disabled={!textInput.trim()}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Type className="h-5 w-5" />
                        Add Text to Design
                      </button>

                      {/* Current Text Elements */}
                      {snap.textElements.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Current Text Elements ({snap.textElements.length})
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {snap.textElements.map((textObj, index) => (
                              <div
                                key={textObj.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: textObj.color }}
                                  />
                                  <span className="text-sm font-medium">{textObj.text}</span>
                                </div>
                                <button
                                  onClick={() => handleTextRemove(textObj.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clear All Text Button */}
                      {snap.textElements.length > 0 && (
                        <button
                          onClick={handleClearAllText}
                          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All Text
                        </button>
                      )}

                      {/* Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Text Tips</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Text will appear on your 3D model</li>
                          <li>• You can add multiple text elements</li>
                          <li>• Click and drag to view text from different angles</li>
                          <li>• Remove text by clicking the × button</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-4 flex-1 flex items-center justify-center min-h-[500px]">
            <div className="w-full h-full max-w-2xl mx-auto">
              <ErrorBoundary>
                <Canvas />
              </ErrorBoundary>
            </div>
          </div>

          {/* Quick Actions for Mobile */}
          <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Design Tools
            </button>
            <button
              onClick={handleExport}
              className="py-3 bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;