import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Palette, 
  Share2, 
  Download,
  Sparkles,
  Star,
  Users,
  Globe,
  ArrowRight,
  Shirt,
  CupSoda,
  Scan,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Design',
      description: 'Generate unique designs in seconds with advanced AI technology',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Palette,
      title: 'Real-time 3D Preview',
      description: 'See your designs come to life with interactive 3D visualization',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Share2,
      title: 'Collaborate & Share',
      description: 'Work with teams and share your creations seamlessly',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Multiple Export Options',
      description: 'Export as PNG, GLB, or shareable links for any platform',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const products = [
    {
      icon: Shirt,
      name: 'T-Shirts',
      description: 'Design custom t-shirts with advanced printing techniques',
      image: '/images/homepage/t-shirt-preview.png',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: CupSoda,
      name: 'Mugs',
      description: 'Create personalized mugs for coffee lovers',
      image: '/images/homepage/mug-preview.png',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: Scan,
      name: 'Caps',
      description: 'Design stylish caps and headwear',
      image: '/images/homepage/cap-preview.png',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Designs Created' },
    { number: '5K+', label: 'Happy Users' },
    { number: '99%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'AI Support' }
  ];

  const designExamples = [
    {
      id: 1,
      title: 'Abstract Geometry',
      description: 'Modern geometric patterns created with AI',
      likes: 24,
      image: '/images/homepage/examples/example-1.jpg'
    },
    {
      id: 2,
      title: 'Vintage Retro',
      description: 'Nostalgic 80s inspired design',
      likes: 18,
      image: '/images/homepage/examples/example-2.jpg'
    },
    {
      id: 3,
      title: 'Nature Inspired',
      description: 'Organic patterns from the natural world',
      likes: 32,
      image: '/images/homepage/examples/example-3.jpg'
    },
    {
      id: 4,
      title: 'Cyberpunk Fusion',
      description: 'Futuristic neon aesthetics',
      likes: 27,
      image: '/images/homepage/examples/example-4.jpg'
    },
    {
      id: 5,
      title: 'Minimalist Elegance',
      description: 'Clean and sophisticated design',
      likes: 21,
      image: '/images/homepage/examples/example-5.jpg'
    },
    {
      id: 6,
      title: 'Urban Streetwear',
      description: 'Bold graphics for modern fashion',
      likes: 29,
      image: '/images/homepage/examples/example-6.jpg'
    }
  ];

  const handleStartCreating = () => {
    navigate('/customizer');
  };

  const handleViewExamples = () => {
    document.getElementById('examples').scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (productName) => {
    navigate('/customizer');
    // You can also set the default product in state if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DesignStudio</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-colors">Examples</a>
              <a href="#products" className="text-gray-300 hover:text-white transition-colors">Products</a>
            </div>
            
            <button
              onClick={handleStartCreating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Creating
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Create{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stunning
                </span>{' '}
                <br />
                3D Merchandise
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into professional 3D designs with AI-powered tools. 
                Create custom t-shirts, mugs, caps and more with real-time preview.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <button
                  onClick={handleStartCreating}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-2xl flex items-center gap-3"
                >
                  <Sparkles className="h-6 w-6" />
                  Start Creating Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleViewExamples}
                  className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-gray-400 hover:text-white transition-all transform hover:scale-105"
                >
                  View Examples
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful <span className="text-blue-400">Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to create professional merchandise designs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600 hover:border-slate-500 transition-all group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-purple-400">Products</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose from our wide range of customizable products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all group cursor-pointer"
                onClick={() => handleProductClick(product.name)}
              >
                {/* Product Image */}
                <div className="h-48 bg-slate-700 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/400/300?random=${index}&grayscale`;
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${product.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <product.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="flex items-center text-blue-400 font-semibold">
                    Start Designing
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Design <span className="text-green-400">Examples</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get inspired by designs created by our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designExamples.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-700 rounded-2xl overflow-hidden border border-slate-600 hover:border-slate-500 transition-all group cursor-pointer"
                onClick={handleStartCreating}
              >
                <div className="h-48 bg-slate-600 overflow-hidden">
                  <img 
                    src={example.image} 
                    alt={example.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/400/300?random=${example.id}&blur=2`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{example.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{example.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Users className="h-4 w-4" />
                      {example.likes} likes
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold group">
                      Remix Design
                      <ArrowRight className="h-3 w-3 ml-1 inline group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-slate-700"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Something{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Amazing?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already designing stunning merchandise with our platform.
            </p>
            <button
              onClick={handleStartCreating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
            >
              <Sparkles className="h-5 w-5" />
              Start Designing Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DesignStudio</span>
            </div>
            
            <div className="text-gray-400 text-sm text-center md:text-left">
              <div>Designed with ❤️ by Raj</div>
              <div className="text-xs mt-1">© 2025 All rights reserved. Crafted for creative minds.</div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="h-4 w-4" />
                Made for the community
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;