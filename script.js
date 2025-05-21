document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // For smoother follower movement - only if the follower element exists
            if (cursorFollower) {
                setTimeout(function() {
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                }, 70);
            }
        });
        
        document.addEventListener('mousedown', function() {
            cursor.style.transform = 'scale(0.7)';
            if (cursorFollower) {
                cursorFollower.style.transform = 'scale(0.7)';
            }
        });
        
        document.addEventListener('mouseup', function() {
            cursor.style.transform = 'scale(1)';
            if (cursorFollower) {
                cursorFollower.style.transform = 'scale(1)';
            }
        });
    }
    
    // Blur overlay removal
    const blurOverlay = document.getElementById('blurOverlay');
    if (blurOverlay) {
        blurOverlay.addEventListener('click', function() {
            blurOverlay.classList.add('hide');
            startMusicPlayer();
        });
    }

    // Setup background (image or video)
    function setupBackground() {
        const bgVideo = document.getElementById('bgVideo');
        
        // Use the video background directly
        if (bgVideo) {
            bgVideo.src = 'images/background.mp4';
            bgVideo.style.display = 'block';
            bgVideo.muted = true;
            bgVideo.loop = true;
            bgVideo.autoplay = true;
            bgVideo.playsInline = true;
            
            // Force video to play
            bgVideo.play().catch(error => {
                console.log('Video autoplay failed:', error);
                // Fallback to a gradient background if video fails to play
                const backgroundElement = document.querySelector('.background');
                if (backgroundElement) {
                    backgroundElement.style.background = 'linear-gradient(45deg, #0f0c29, #302b63, #24243e)';
                }
            });
        }
    }
    
    setupBackground();

    // 3D Tilt effect
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
        const maxTilt = 10; // Maximum tilt in degrees
        const perspective = 1000;

        profileCard.addEventListener('mousemove', function(e) {
            const rect = profileCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate the percentage position of the mouse
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);
            
            // Calculate the tilt angle
            const tiltX = -percentY * maxTilt;
            const tiltY = percentX * maxTilt;
            
            // Apply the tilt effect
            profileCard.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Make cursorFollower bigger when hovering over the card - only if element exists
            if (cursorFollower) {
                cursorFollower.style.transform = 'scale(1.5)';
            }
        });

        profileCard.addEventListener('mouseleave', function() {
            // Reset the tilt when mouse leaves
            profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            if (cursorFollower) {
                cursorFollower.style.transform = 'scale(1)';
            }
        });
    }

    // Music Player
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const progressBar = document.querySelector('.progress');
    const songTitleEl = document.querySelector('.song-title');
    const albumCoverEl = document.querySelector('.album-cover');

    let currentSongIndex = 0;
    let isPlaying = false;
    let songs = [];
    let albumCovers = {};
    let shuffledOrder = [];

    // Shuffle function (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to load available songs from the songs directory
    function loadSongs() {
        songs = [
            { title: 'Sewerslvt · Pretty Cvnt', path: 'songs/soundcloud_485396328_audio.mp3', cover: 'images/album.jpg' },
            { title: 'Flawed Mangoes - Surreal', path: 'songs/song.mp3', cover: 'images/idk.jpg' },
        ];
        // Shuffle order
        shuffledOrder = shuffleArray([...Array(songs.length).keys()]);
        currentSongIndex = 0;
    }

    function getCurrentSong() {
        return songs[shuffledOrder[currentSongIndex]];
    }

    // Function to update song information display
    function updateSongInfo() {
        const song = getCurrentSong();
        if (songTitleEl) songTitleEl.textContent = song.title;
        if (albumCoverEl) albumCoverEl.src = song.cover;
        if (audioPlayer) audioPlayer.src = song.path;
    }

    // Fade helpers
    function fadeAudio(targetVolume, duration, callback) {
        if (!audioPlayer) return;
        const startVolume = audioPlayer.volume;
        const startTime = performance.now();
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audioPlayer.volume = startVolume + (targetVolume - startVolume) * progress;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (callback) callback();
            }
        }
        requestAnimationFrame(step);
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (!audioPlayer) return;
        if (isPlaying) {
            fadeAudio(0, 400, () => {
                audioPlayer.pause();
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                audioPlayer.volume = 1;
            });
        } else {
            audioPlayer.volume = 0;
            audioPlayer.play();
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            fadeAudio(1, 600);
        }
        isPlaying = !isPlaying;
    }

    // Play next song with fade
    function playNextSong(fade = true) {
        if (!songs.length) return;
        if (fade && isPlaying && audioPlayer) {
            fadeAudio(0, 700, () => {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                updateSongInfo();
                audioPlayer.volume = 0;
                if (isPlaying) {
                    audioPlayer.play();
                    fadeAudio(1, 900);
                }
            });
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            updateSongInfo();
            if (isPlaying && audioPlayer) {
                audioPlayer.play();
            }
        }
    }

    // Play previous song with fade
    function playPrevSong(fade = true) {
        if (!songs.length) return;
        if (fade && isPlaying && audioPlayer) {
            fadeAudio(0, 700, () => {
                currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
                updateSongInfo();
                audioPlayer.volume = 0;
                if (isPlaying) {
                    audioPlayer.play();
                    fadeAudio(1, 900);
                }
            });
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            updateSongInfo();
            if (isPlaying && audioPlayer) {
                audioPlayer.play();
            }
        }
    }

    // Update progress bar and time display
    function updateProgress() {
        if (!audioPlayer) return;
        
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        
        // Update progress bar
        if (duration && progressBar) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Update time display
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
        if (!isNaN(duration) && totalTimeEl) {
            totalTimeEl.textContent = formatTime(duration);
        }
    }

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Start the music player
    function startMusicPlayer() {
        loadSongs();
        updateSongInfo();
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        if (nextBtn) nextBtn.addEventListener('click', () => playNextSong(true));
        if (prevBtn) prevBtn.addEventListener('click', () => playPrevSong(true));
        if (audioPlayer) {
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', () => playNextSong(true));
        }
        setTimeout(() => {
            togglePlayPause();
        }, 1000);
    }

    // Timeline click event to seek
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.addEventListener('click', function(e) {
            if (!audioPlayer) return;
            
            const timelineWidth = this.clientWidth;
            const clickPosition = e.offsetX;
            const duration = audioPlayer.duration;
            
            audioPlayer.currentTime = (clickPosition / timelineWidth) * duration;
        });
    }

    // Rain effect
    function startRainEffect() {
        const canvas = document.getElementById('rain-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Обновлять размер canvas при изменении окна
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });

        // Настройки дождя
        const raindropCount = Math.floor(width / 7); // плотность дождя уменьшена
        const raindrops = [];
        for (let i = 0; i < raindropCount; i++) {
            raindrops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: 10 + Math.random() * 20,
                speed: 2 + Math.random() * 4,
                opacity: 0.1 + Math.random() * 0.3,
                radius: 0.7 + Math.random() * 1.2
            });
        }

        function drawRaindrop(drop) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 200, 255, ${drop.opacity})`;
            ctx.lineWidth = drop.radius;
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();
            ctx.restore();
        }

        function drawSplash(x, y, radius) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(180, 200, 255, 0.15)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let drop of raindrops) {
                drawRaindrop(drop);
                drop.y += drop.speed;
                if (drop.y > height - drop.length) {
                    // Splash
                    drawSplash(drop.x, height - 2, 2 + Math.random() * 3);
                    // Reset drop
                    drop.x = Math.random() * width;
                    drop.y = -20;
                    drop.length = 10 + Math.random() * 20;
                    drop.speed = 2 + Math.random() * 4;
                    drop.opacity = 0.1 + Math.random() * 0.3;
                    drop.radius = 0.7 + Math.random() * 1.2;
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
    startRainEffect();

    // Gamepad card show/hide
    const gamepadBtn = document.getElementById('gamepadBtn');
    const gamepadCard = document.getElementById('gamepadCard');
    const gamepadNotification = document.getElementById('gamepadNotification');
    if (gamepadBtn && gamepadCard) {
        gamepadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            gamepadCard.classList.toggle('active');
            if (gamepadNotification) {
                gamepadNotification.classList.add('active');
                setTimeout(() => {
                    gamepadNotification.classList.remove('active');
                }, 2500);
            }
        });
        document.addEventListener('click', (e) => {
            if (!gamepadCard.contains(e.target) && e.target !== gamepadBtn) {
                gamepadCard.classList.remove('active');
            }
        });
    }
}); 