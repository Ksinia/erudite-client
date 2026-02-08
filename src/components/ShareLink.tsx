import React, { useState } from 'react';
import './ShareLink.css';

interface Props {
  gameId: number;
}

const ShareIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

function ShareLink({ gameId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/game/${gameId}`;
    if (navigator.share) {
      navigator.share({ title: 'Erudit', url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span className="share-link" onClick={handleShare} title="Share">
      {copied ? (
        ' ✓'
      ) : (
        <>
          {' '}
          <ShareIcon />
        </>
      )}
    </span>
  );
}

export default ShareLink;
