"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaXmark, FaExpand } from "react-icons/fa6";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;

  function goTo(delta: number) {
    setActiveIndex((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL, next/image adds no value here */}
        <img
          src={images[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1}`}
          className="h-full w-full object-cover cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="View fullscreen"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <FaExpand size={14} />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <FaChevronRight size={14} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex ? "border-teal" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary thumbnail */}
              <img src={url} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <FaXmark size={20} />
          </button>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(-1);
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <FaChevronLeft size={18} />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL, fullscreen lightbox view */}
          <img
            src={images[activeIndex]}
            alt={`${title} — photo ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(1);
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <FaChevronRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
