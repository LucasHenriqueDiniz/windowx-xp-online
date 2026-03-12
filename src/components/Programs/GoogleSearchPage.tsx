
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GoogleSearchPageProps {
  onSearch: (query: string) => void;
}

const GoogleSearchPage: React.FC<GoogleSearchPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white">
      <Image
        src="/assets/winXPassets/internetexplorer/google-logo.png"
        alt="Google"
        width={288}
        height={95}
        className="mb-4"
      />
      <form onSubmit={handleSearch} className="w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 outline-none"
        />
        <div className="flex justify-center mt-4">
          <button type="submit" className="px-4 py-2 mx-2 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200">
            Google Search
          </button>
          <button type="button" className="px-4 py-2 mx-2 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200">
            I&apos;m Feeling Lucky
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleSearchPage;
