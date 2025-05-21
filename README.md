# Personal Portfolio Website

A stylish personal portfolio website with blur effect, 3D interactive card, and music player.

## Features

- Initial blur effect that clears on click (full-screen click-to-see)
- 3D tilt effect on profile card that follows cursor movement
- Music player with shuffle capability
- Glass-like UI design with transparent effects
- Responsive layout
- Video background support (as an alternative to image)
- Glowing social media icons
- Custom cursor effect

## Setup Instructions

1. Background options:
   - For image background: Place your background image as `background.jpg` in the `images` folder
   - For video background: Add `background.mp4` or `background.webm` to the `images` folder
   - If neither is found, a gradient background will be displayed

2. Replace other images:
   - Add your avatar as `avatar.jpg` in the `images` folder
   - Add your Discord server icon as `server.jpg` in the `images` folder
   - Add album covers for your songs (album.jpg, album2.jpg, etc.)

3. Add your music files:
   - Place your MP3 files in the `songs` folder
   - Update the song titles and paths in the `script.js` file

4. Customize your information:
   - Edit the username, bio, and other text in the HTML
   - Update social media links
   - Adjust the style as needed

## How it Works

- The page starts with a blur effect showing "click to see" across the entire screen
- When clicked, the blur disappears revealing your profile
- Music starts playing automatically
- Moving the cursor over the profile card creates a 3D tilt effect
- The profile card has a glassmorphism effect
- Social media icons glow when hovered
- Custom cursor follows mouse movements
- Songs shuffle automatically when one ends
- Background can be either an image or video

## Technologies Used

- HTML5
- CSS3 (with animations, glassmorphism, and 3D transforms)
- JavaScript (ES6)
- Font Awesome icons 