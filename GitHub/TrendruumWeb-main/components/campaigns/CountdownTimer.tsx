import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';

interface CountdownTimerProps {
  endDate?: string;
  startDate?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, startDate, className = '' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Kampanya durumunu belirle
  const getCampaignStatus = () => {
    const now = new Date();
    
    if (startDate) {
      const start = new Date(startDate);
      if (now < start) {
        return 'not_started';
      }
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (now > end) {
        return 'ended';
      }
    }
    
    return 'active';
  };

  const campaignStatus = getCampaignStatus();
  const targetDate = campaignStatus === 'not_started' ? startDate : endDate;

  // Geri sayım render fonksiyonu
  const renderer = ({ days, hours, minutes, seconds, completed }: TimeLeft) => {
    if (completed) {
      return (
        <div className={`text-center ${className}`}>
          <div className="text-red-600 font-bold text-base bg-white/90 rounded-lg px-3 py-2 shadow-lg">
            {campaignStatus === 'ended' ? 'Kampanya Sona Erdi' : 'Kampanya Başladı!'}
          </div>
        </div>
      );
    }

    return (
      <div className={`text-center ${className}`}>
        <div className="text-white text-sm font-bold mb-2 drop-shadow-lg">
          {campaignStatus === 'not_started' ? 'Kampanya Başlangıcına Kalan Süre' : 'Kampanya Bitişine Kalan Süre'}
        </div>
        <div className="flex justify-center space-x-2">
          {/* Günler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              {days.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Gün
            </div>
          </div>
          
          {/* Saatler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              {hours.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Saat
            </div>
          </div>
          
          {/* Dakikalar */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              {minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Dak
            </div>
          </div>
          
          {/* Saniyeler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              {seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Sn
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Server-side rendering için placeholder
  if (!isClient) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-white text-sm font-bold mb-2 drop-shadow-lg">
          {campaignStatus === 'not_started' ? 'Kampanya Başlangıcına Kalan Süre' : 'Kampanya Bitişine Kalan Süre'}
        </div>
        <div className="flex justify-center space-x-2">
          {/* Günler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              --
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Gün
            </div>
          </div>
          
          {/* Saatler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              --
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Saat
            </div>
          </div>
          
          {/* Dakikalar */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              --
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Dak
            </div>
          </div>
          
          {/* Saniyeler */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[40px] shadow-lg border border-white/20">
            <div className="text-gray-900 font-bold text-lg leading-tight">
              --
            </div>
            <div className="text-gray-600 text-xs leading-tight font-medium">
              Sn
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Countdown
      date={new Date(targetDate!)}
      renderer={renderer}
      intervalDelay={1000}
      precision={1}
    />
  );
};

export default CountdownTimer;
