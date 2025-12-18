"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SizeChartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChart = ({ isOpen, onClose }: SizeChartProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-[999999]" 
        onClose={onClose}
        style={{
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Beden Tablosu
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-orange-50">
                        <th className="px-4 py-3 text-left font-medium text-orange-800">Beden</th>
                        <th className="px-4 py-3 text-center font-medium text-orange-800">Göğüs (cm)</th>
                        <th className="px-4 py-3 text-center font-medium text-orange-800">Bel (cm)</th>
                        <th className="px-4 py-3 text-center font-medium text-orange-800">Kalça (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { size: 'S', bust: '84-88', waist: '66-70', hip: '92-96' },
                        { size: 'M', bust: '88-92', waist: '70-74', hip: '96-100' },
                        { size: 'L', bust: '92-96', waist: '74-78', hip: '100-104' },
                      ].map((row, idx) => (
                        <tr 
                          key={row.size}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">{row.size}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{row.bust}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{row.waist}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-orange-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-orange-800 mb-2">Ölçüm İpuçları</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Ölçüm alırken vücudunuza yapışık olmayan rahat kıyafetler giyin</li>
                    <li>• Mezurayı çok sıkmadan, rahat bir şekilde ölçüm alın</li>
                    <li>• Tereddüt ettiğiniz durumlarda bir büyük beden tercih edin</li>
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SizeChart; 