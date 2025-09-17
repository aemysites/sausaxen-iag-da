import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Handle cards9 video functionality
  if (block.classList.contains('cards9')) {
    const videoButtons = block.querySelectorAll('.button[href*=".mp4"]');
    videoButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const videoUrl = button.getAttribute('href');
        const cardBody = button.closest('.cards-card-body');
        
        if (cardBody) {
          // Create video player
          const videoPlayer = document.createElement('div');
          videoPlayer.className = 'video-player';
          
          const video = document.createElement('video');
          video.src = videoUrl;
          video.controls = true;
          video.autoplay = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          
          videoPlayer.appendChild(video);
          cardBody.appendChild(videoPlayer);
          
          // Hide the play button overlay
          const buttonContainer = button.closest('.button-container');
          if (buttonContainer) {
            buttonContainer.style.display = 'none';
          }
          
          // Add event listener to show overlay when video ends
          video.addEventListener('ended', () => {
            videoPlayer.remove();
            if (buttonContainer) {
              buttonContainer.style.display = 'flex';
            }
          });
          
          // Add click listener to video to pause/play
          video.addEventListener('click', () => {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          });
        }
      });
    });
  }
}
