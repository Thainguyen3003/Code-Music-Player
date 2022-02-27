/**
 * 1, Render song -> done
 * 2, Scroll top -> done
 * 3, Play / pause / seek -> done
 * 4, CD rotate
 * 5, Next / prev
 * 6, Random
 * 7, Next / Repeat when ended
 * 8, Active song
 * 9, Scroll active song into view
 * 10, Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');


const app = {
    currentIndex: 0,
    isPlaying: false,
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
        },
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
    
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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

    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    

    start: function() {
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


