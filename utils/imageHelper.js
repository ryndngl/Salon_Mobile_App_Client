
const fallbackImages = {
  default:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375432/default_fallback.webp",
  haircut:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircut_dnayis.webp",
  haircolor:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircolor_bk135m.webp",
  hairtreatment:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375430/hairtreatment_ddzkdc.webp",
  rebondandforms:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/rebondandforms_ydvsyo.webp",
  nailcare:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/nailcare_izbusf.webp",
  footspa:
    "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375432/footspa_idzcx1.webp",
};

// Extract images from data (handles array vs single)
export const extractImages = (style) => {
  
  if (!style) {
    return [];
  }
  
  // Check for images array first
  if (Array.isArray(style.images) && style.images.length > 0) {
    return style.images;
  } 
  
  // Check for single image property
  if (style.image) {
    // If it's a string
    if (typeof style.image === 'string' && style.image.trim() !== '') {
      return [style.image];
    }
    // If it's an object with uri property (React Native image source format)
    if (typeof style.image === 'object' && style.image.uri && typeof style.image.uri === 'string' && style.image.uri.trim() !== '') {
      return [style.image.uri];
    }
  }
  
  // Check for other possible image properties
  if (style.imageUrl && typeof style.imageUrl === 'string' && style.imageUrl.trim() !== '') {
    return [style.imageUrl];
  }
  
  if (Array.isArray(style.imageUrls) && style.imageUrls.length > 0) {
    return style.imageUrls;
  }
  
  // Additional checks for other possible field names
  if (style.img && typeof style.img === 'string' && style.img.trim() !== '') {
    return [style.img];
  }
  
  if (style.photo && typeof style.photo === 'string' && style.photo.trim() !== '') {
    return [style.photo];
  }
  return [];
};

// Get image source (Cloudinary or fallback)
export const getImageSource = (imageUrl, serviceName = "default") => {
 
  
  // If we have a valid image URL
  if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "") {
    // If it's already a full Cloudinary URL, use it directly
    if (imageUrl.startsWith('https://res.cloudinary.com/') || 
        imageUrl.startsWith('http://res.cloudinary.com/') ||
        imageUrl.startsWith('https://cloudinary.com/') ||
        imageUrl.startsWith('http://cloudinary.com/')) {
      return { uri: imageUrl };
    }
    
    // If it's any other full URL (http/https), use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
     
      return { uri: imageUrl };
    }
    
    // If it's a relative path with image extensions
    if (imageUrl.includes('.jpg') || imageUrl.includes('.png') || 
        imageUrl.includes('.webp') || imageUrl.includes('.jpeg')) {
      return { uri: imageUrl };
    }
  }

  // Fallback based on service name
  const key = serviceName.toLowerCase().replace(/\s+/g, "").replace(/&/g, "");
  
  // Handle specific service name mappings
  let fallbackKey = "default";
  
  if (key.includes("haircut") || key.includes("hair") && key.includes("cut")) {
    fallbackKey = "haircut";
  } else if (key.includes("haircolor") || key.includes("hair") && key.includes("color")) {
    fallbackKey = "haircolor";
  } else if (key.includes("hairtreatment") || key.includes("hair") && key.includes("treatment")) {
    fallbackKey = "hairtreatment";
  } else if (key.includes("rebond") || key.includes("forms")) {
    fallbackKey = "rebondandforms";
  } else if (key.includes("nail")) {
    fallbackKey = "nailcare";
  } else if (key.includes("foot") || key.includes("spa")) {
    fallbackKey = "footspa";
  }

  return { uri: fallbackImages[fallbackKey] };
};