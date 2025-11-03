import React, { useState, useEffect } from 'react';

const ImageSlider: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1); // New state for opacity

  useEffect(() => {
    const fetchImages = async () => {
      // In a real application, you would fetch image paths from an API or a manifest.
      // For this example, we'll assume a fixed set of image names or a way to list them.
      // Since direct filesystem access is not possible in a browser,
      // and dynamic imports with variables are tricky, we'll simulate it.
      // For demonstration, let's assume we know some image names or can list them.
      // In a production build, these would be static assets.
      // For now, we'll use a placeholder or a known list.
      const imageNames = [
        '094fdb3e-f278-42b0-b351-3f8c11b9975c.jpg',
        '19836e60-1e99-4f04-88a7-7b68f2bb7c48.jpg',
        '1ff024f0-d126-4828-88c8-515f202f8155.jpg',
        '29301aee-b5c3-435f-90d2-802ec08050a1.jpg',
        '2b5836ac-7e07-453f-952b-180c7972a2d7.jpeg',
        '46223371-b3e6-480d-b139-86dacd43b2ef.jpg',
        '513c8384-c6dc-43ce-a98d-d189cf5f3fa6.jpg',
        '6d92b823-8b2a-4f48-b574-c0c1ab3199f2.jpg',
        '7ca6be7f-edf7-477e-a4a1-5a658c02ae49.jpg',
        '90e85aba-c473-44d7-ab6b-710fceaee81a.jpg',
        '9a2d02fd-cf66-4032-a2d7-a28d6b69c437.jpg',
        'WhatsApp Image 2025-11-02 at 7.50.54 PM.jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.20 PM.jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.22 PM (1).jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.22 PM.jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.23 PM (1).jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.23 PM.jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.24 PM (1).jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.24 PM (2).jpeg',
        'WhatsApp Image 2025-11-02 at 7.52.24 PM.jpeg',
        'a136d3d4-2b80-4efe-87a5-ff28208c32b7.jpg',
        'b57ef502-e7d3-4417-a21a-eafe51003ecb.jpg',
        'bfbae5fb-adfb-45bd-ab3d-5f6cacdfd8e5.jpeg',
        'd78bc448-8e1b-4ad2-b1c9-0aa92068e630.jpg',
        'dfc833a2-5030-4a57-903a-5bd45d6fa048.jpg',
        'e788b64f-f755-4479-a274-f93ce55cfebe.jpg',
      ];
      const loadedImages = imageNames.map(name => `/hero/${name}`);
      setImages(loadedImages);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setOpacity(0); // Start fade-out
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setOpacity(1); // Start fade-in after image change
        }, 500); // Half a second for fade-out
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="image-slider-container">
      {images.length > 0 ? (
        <img
          src={images[currentIndex]}
          alt="Hero Image"
          className="image-slider-image"
          style={{ opacity: opacity, transition: 'opacity 0.5s ease-in-out' }} // Apply opacity and transition
        />
      ) : (
        <div className="image-slider-placeholder">Loading Images...</div>
      )}
    </div>
  );
};

export default ImageSlider;