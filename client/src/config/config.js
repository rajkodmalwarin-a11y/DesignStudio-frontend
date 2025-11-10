const config = {
  development: {
    backendUrl: "http://localhost:5000/api", // for local testing
  },
  production: {
    backendUrl: "https://designstudio-backend.onrender.com/api", // your real backend
  },
};

const getConfig = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return config.development;
  } else {
    return config.production;
  }
};

export default getConfig;
