
import React, { memo, useMemo } from 'react';

const Marquee = () => {
  const text = '@CERRAMELAOCHOPODCAST - ';
  const repeatedText = useMemo(() => Array(12).fill(text).join(''), [text]);

  return (
    <a
      href="https://www.instagram.com/cerramelaochopodcast"
      target="_blank"
      rel="noopener noreferrer"
      className="block cursor-pointer hover:opacity-95 transition-opacity"
    >
      <section className="py-3 bg-[#2A51F4] overflow-hidden border-y border-white/10">
        <div className="marquee-container">
          <div className="marquee-content gap-4">
            <span className="font-archivo text-2xl md:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap font-normal">
              {repeatedText}
            </span>
            <span className="font-archivo text-2xl md:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap font-normal">
              {repeatedText}
            </span>
          </div>
        </div>
      </section>
    </a>
  );
};

export default memo(Marquee);
