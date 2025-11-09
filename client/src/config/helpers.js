export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }
  
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "design.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "black" : "white";
};

export const shareDesign = async (state) => {
  try {
    const designData = {
      product: state.currentProduct,
      color: state.color,
      logoDecal: state.logoDecal,
      fullDecal: state.fullDecal,
      timestamp: Date.now()
    };
    
    const shareId = btoa(JSON.stringify(designData));
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    
    return shareUrl;
  } catch (error) {
    console.error('Share failed:', error);
    throw error;
  }
};