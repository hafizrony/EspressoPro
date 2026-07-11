import Image from 'next/image';
import logo from '../../assets/logo.png';

export default function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fb] to-[#f4faff] flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="EspressoPro Logo" className="w-20 h-20 mb-6 object-contain" priority />
        <h1 className="text-2xl font-bold text-[#361f1a]">EspressoPro</h1>
        <p className="text-[#655d5a] mt-2 text-sm">Brewing your dashboard...</p>
        <div className="w-64 h-1 bg-[#d7ccc8] mt-8 rounded-full overflow-hidden">
          <div className="h-full bg-[#4e342e] transition-all ease-out duration-75" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}