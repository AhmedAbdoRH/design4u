import React from 'react';

interface FacebookButtonProps {
  facebookUrl?: string;
  className?: string;
}

export default function FacebookButton({ 
  facebookUrl = "https://www.facebook.com/profile.php?id=61573723094947&rdid=1ZVjWRSfc8eMXGJA&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ZM6ocoHPf%2F#", 
  className = "" 
}: FacebookButtonProps) {
  const handleClick = () => {
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <button 
        className="facebook-button"
        onClick={handleClick}
        type="button"
      >
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <svg
              viewBox="0 0 320 512"
              height="1.2em"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
              ></path>
            </svg>
          </div>
        </div>
        <span> تابعنا على فيسبوك </span>
      </button>
    </div>
  );
}
