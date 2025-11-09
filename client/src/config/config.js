const config = {
  development: {
    backendUrl: "http://localhost:8080/api/v1/dalle",
  },
  production: {
    backendUrl: "https://devswag.onrender.com/api/v1/dalle",
  },
};

// Simple config that works in both environments
const getConfig = () => {
  // For development, use localhost; for production, use the deployed URL
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return config.development;
  } else {
    return config.production;
  }
};

export default getConfig;