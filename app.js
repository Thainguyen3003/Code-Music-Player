/**
 * 1, Render song -> done
 * 2, Scroll top -> done
 * 3, Play / pause / seek -> done
 * 4, CD rotate -> done
 * 5, Next / prev -> done
 * 6, Random -> done
 * 7, Next / Repeat when ended -> done
 * 8, Active song -> done
 * 9, Scroll active song into view -> done
 * 10, Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KET = 'F8_PLAYER';
const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KET)) || {},
    songs: [
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: './musics/Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3',
            image: './images/630d20b0a79917e1545b4e2ada081040.jpg'
        },
        {
            name: 'Chạy về khóc với anh',
            singer: 'ERIK',
            path: './musics/Chay-Ve-Khoc-Voi-Anh-ERIK.mp3',
            image: './images/c6def069a1a885c41fe479358fa7c506.jpg'
        },
        {
            name: 'Không trọn vẹn nữa',
            singer: 'Châu Khải Phong, ACV',
            path: './musics/Khong-Tron-Ven-Nua-Chau-Khai-Phong-ACV.mp3',
            image: './images/7d7ccc9ef92fe30ab57543b978ab3548.jpg'
        },
        {
            name: 'Y chang xuân sang',
            singer: 'Nal',
            path: './musics/Y-Chang-Xuan-Sang-Nal.mp3',
            image: './images/b48763119866bc86086e3fbaf2419597.jpg'
        },
        {
            name: 'Thay mọi cô gái yêu anh',
            singer: 'AMEE',
            path: './musics/thay-moi-co-gai-yeu-anh-AMEE.mp3',
            image: './images/c4a49014b42161249400b76a35cf5b99.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KET, JSON.stringify(this.config));
    },
    
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10s
            iterations: Infinity // liên quan đến timming function, loop bao nhiêu lần
        })
        cdThumbAnimate.pause();

        // Xử lí phóng to thu nhỏ
        document.onscroll = function() {    
            // window.scrollY / document.documentElement.scrollTop lấy chiều dài lăn chuột
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xủ lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xủ lí tua video
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.nextSong();
            }

            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.prevSong();
            }

            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lí phát lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }

        }

        // Lắng nghe click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode) {
                //console.log(songNode.getAttribute('data-index'));
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },    

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    
    playRandom: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoview({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300)
    },

    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();        

        // Định nghĩa các thuộc tình cho obj
        this.defineProperties();

        // Lắng nghe, xử lí các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()


