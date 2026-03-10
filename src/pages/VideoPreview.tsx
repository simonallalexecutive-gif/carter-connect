import heroVideo1 from '@/assets/hero-video.mp4';
import heroVideo2 from '@/assets/hero-video-option-2.mp4';
import heroVideo3 from '@/assets/hero-video-option-3.mp4';
import heroVideo4 from '@/assets/hero-video-option-4.mp4';

const videos = [
  { src: heroVideo1, label: 'Option 1 — Business professionals, rue NYC, golden hour' },
  { src: heroVideo2, label: 'Option 2 — Vue aérienne skyline Manhattan, coucher de soleil' },
  { src: heroVideo3, label: 'Option 3 — Avocats dans lobby marbre prestigieux' },
  { src: heroVideo4, label: 'Option 4 — Timelapse nocturne quartier financier' },
];

const VideoPreview = () => (
  <div className="min-h-screen bg-black p-6">
    <h1 className="text-white font-serif text-3xl mb-2 text-center">Choix de la vidéo hero</h1>
    <p className="text-white/50 text-center mb-8 font-sans text-sm">Comparez les 4 options puis dites-moi laquelle vous préférez</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {videos.map((v, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-white/10">
          <video
            src={v.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video object-cover"
          />
          <div className="p-4 bg-white/5">
            <p className="text-white font-sans text-sm font-medium">{v.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VideoPreview;
