import Image from 'next/image';

const SecurityCertificates = () => {
  const certificates = [
    {
      id: 1,
      name: 'ETBIS',
      image: '/etbis.png',
      alt: 'ETBIS e Kayıtlıdır'
    },
    {
      id: 2,
      name: 'TR GO',
      image: '/tr_go.png',
      alt: 'TR GO Sertifikası'
    },
    {
      id: 3,
      name: 'PCI DSS',
      image: '/security/pci-dss.webp',
      alt: 'PCI DSS Sertifikası'
    },
    {
      id: 4,
      name: 'ISO 27001',
      image: '/security/iso.webp',
      alt: 'ISO 27001 Sertifikası'
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        {certificates.map((cert) => (
          <div 
            key={cert.id} 
            className="relative w-[80px] h-[80px] bg-white rounded-lg p-2"
          >
            <Image
              src={cert.image}
              alt={cert.alt}
              fill
              className="object-contain p-1"
              sizes="80px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityCertificates; 