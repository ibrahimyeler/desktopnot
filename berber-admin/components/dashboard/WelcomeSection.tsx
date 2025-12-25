export default function WelcomeSection() {
  const currentHour = new Date().getHours();
  let greeting = 'Merhaba';
  
  if (currentHour < 12) {
    greeting = 'Günaydın';
  } else if (currentHour < 18) {
    greeting = 'İyi Günler';
  } else {
    greeting = 'İyi Akşamlar';
  }

  return (
    <div className="bg-gradient-to-r from-[#3498DB] to-[#2C3E50] rounded-xl p-8 mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        {greeting}, Admin
      </h1>
      <p className="text-[#E5E7EB] text-lg">
        Bugün {new Date().toLocaleDateString('tr-TR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} - Sisteminize hoş geldiniz
      </p>
    </div>
  );
}

