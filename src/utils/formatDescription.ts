export const formatDescription = (description: string): string | React.ReactNode[] => {
  if (!description) return '';
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Check if there are any URLs in the description
  const hasLinks = description.match(urlRegex);
  
  if (!hasLinks) return description;
  
  // Split the description by URLs
  const parts = description.split(urlRegex);
  const urls = description.match(urlRegex) || [];
  
  // If we couldn't extract URLs, return the original description
  if (urls.length === 0) return description;
  
  // Create an array of React elements and text nodes
  const elements: React.ReactNode[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    // Add text part
    if (parts[i]) {
      elements.push(parts[i]);
    }
    
    // Add link button if there's a corresponding URL
    if (i < urls.length) {
      elements.push(
        <a
          key={`link-${i}`}
          href={urls[i]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          تحميل الآن
        </a>
      );
    }
  }
  
  return elements;
};
