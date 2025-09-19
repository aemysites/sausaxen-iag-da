export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Handle hero39 background video
  if (block.classList.contains('hero39')) {
    const videoLink = block.querySelector('div:first-child a[href*=".mp4"]');
    if (videoLink) {
      const videoUrl = videoLink.getAttribute('href');
      const videoContainer = videoLink.closest('div');
      
      // Create video element
      const video = document.createElement('video');
      video.src = videoUrl;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.controls = false;
      video.style.cssText = `
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        display: block;
        pointer-events: none;
      `;
      
      // Replace the button container with the video
      videoContainer.innerHTML = '';
      videoContainer.appendChild(video);
      
      // Ensure video plays
      video.addEventListener('canplay', () => {
        video.play().catch(() => {
          // Fallback if autoplay fails
          console.log('Video autoplay failed');
        });
      });
    }
  }
}
