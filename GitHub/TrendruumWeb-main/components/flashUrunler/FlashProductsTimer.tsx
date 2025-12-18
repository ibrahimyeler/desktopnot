"use client";

import { useState, useEffect } from 'react';

export default function FlashProductsTimer() {
  const timeSlots = [
    { time: '15:00 - 18:00', label: 'şu an aktif' },
    { time: '18:00 - 21:00', label: '2 saat sonra aktif' },
    { time: '21:00 - 24:00', label: '5 saat sonra aktif' },
    { time: '9:00 - 12:00', label: '17 saat sonra aktif', tomorrow: true },
    { time: '12:00 - 15:00', label: '20 saat sonra aktif', tomorrow: true }
  ];

  const [countdown, setCountdown] = useState({ hours: 2, minutes: 1, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">Flaş Ürünler</span>
          <div className="bg-white rounded px-2 py-1 text-black">
            <span className="font-mono">
              {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.minutes).padStart(2, '0')}:
              {String(countdown.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {timeSlots.map((slot, index) => (
            <div 
              key={index}
              className={`relative rounded px-4 py-1 text-sm ${
                index === 0 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-white text-black'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">{slot.time}</span>
                <span className="text-xs">
                  {slot.tomorrow && <span className="text-red-500 font-bold mr-1">Yarın</span>}
                  {slot.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 