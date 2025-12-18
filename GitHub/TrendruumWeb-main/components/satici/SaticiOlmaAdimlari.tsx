"use client";

import React, { useState } from 'react';

const SaticiOlmaAdimlari = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Trendruum Satıcı Paneli'ne başvuru yapın",
      description: "Trendruum Satıcı Paneli 'Yeni başvuru' sayfasına tıklayın, size uygun olan satıcı tipini seçin, mağaza adı ve şifre oluşturun.",
      visual: "application"
    },
    {
      id: 1,
      title: "Eksik bilgi ve belgelerinizi yükleyin",
      description: "Hesabım menüsünden eksik bilgilerinizi ve belgelerinizi tamamlayıp sözleşmenizi onaylayın.",
      visual: "upload"
    },
    {
      id: 2,
      title: "Başvuru onayınızı bekleyin",
      description: "Başvurunuz tamamlandıktan sonra ilgili ekiplerimiz başvurunuzu değerlendirecektir. Süreci Trendruum Satıcı Paneli üzerinden takip edebilirsiniz.",
      visual: "waiting"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderVisual = (type: string) => {
    switch (type) {
      case "application":
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Navigation Buttons */}
            <div className="flex mb-6">
              <button className="flex-1 py-2 px-4 text-gray-600 border-b-2 border-gray-200 text-sm">
                Giriş
              </button>
              <button className="flex-1 py-2 px-4 text-orange-600 border-b-2 border-orange-500 text-sm font-medium">
                Yeni başvuru
              </button>
            </div>
            
            {/* Seller Type Options */}
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded text-sm text-gray-500">Satıcı Ol</div>
              <div className="p-3 border border-gray-200 rounded text-sm text-gray-500">Satıcı Girişi</div>
              <div className="p-3 border border-gray-200 rounded text-sm text-gray-500">Hesabım</div>
              <div className="p-3 border border-gray-200 rounded text-sm text-gray-500">Yardım</div>
            </div>
          </div>
        );
      
      case "upload":
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Success Block */}
            <div className="border-2 border-green-500 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Pending Block */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        );
      
      case "waiting":
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Hourglass Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Status Button */}
            <div className="text-center">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium">
                Başvurunuz değerlendiriliyor
              </button>
            </div>
            
            {/* Placeholder Lines */}
            <div className="mt-6 space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Trendruum'da nasıl mağaza açabilirim?
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Steps and Instructions */}
          <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-blue-500 text-white border-2 border-blue-500'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    currentStep === 0
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    currentStep === steps.length - 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Current Step Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {steps[currentStep].title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Step Progress */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Adım {currentStep + 1} / {steps.length}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Section - Visual Representation */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  {renderVisual(steps[currentStep].visual)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Önceki Adım
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === steps.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              Sonraki Adım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaticiOlmaAdimlari;
