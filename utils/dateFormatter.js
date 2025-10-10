// src/utils/dateFormatter.js
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${formattedDate} • ${formattedTime}`;
};