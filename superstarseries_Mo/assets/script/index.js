/*
    index.js
*/

function PageIndex() {
    const _ = this;
    _.element = {
        body: $('html,body'),
        root: $('#superstarHome'),
        footer: $('.footer'),
        gnbLink: $('.menu-open__link'),
        gnbMenu: $('.header__menu'),
        gnbMenuLink: $('.header__menu .menu__gnb .gnb__item a, .header__menu .menu-logo__link'),
        gnbMenuCloseBtn: $('.gnb-close__link'),
        backgroundSection: $('.background'),
        backgroundvideoWrap: $('.bg-video'),
        backgroundVideo: $('#videoMain'),
        spaceWrap: $('.space'),
        sectionVisual: $('.section--visual'),
        storeLinkGoogle: $('[data-store="google"]'),
        storeLinkApp: $('[data-store="app"]'),
        storeSsgoBtn: $('.store__link--superstargo[data-state="coming"]'),

        gameInfoSwiperWrap: $('.game-img__wrap .swiper'),
        artistOpened: $('.section--artist .artist__link:not([disabled])'),
        modal: {
            wrapper: $('.modal'),
            alert: $('.modal--alert'),
            comingSoon: $('.modal--coming'),
            goods: $('.modal--goods'),
            reg: $('.modal--reg')
        },
        modalCloseBtn: $('.modal .modal-close__link,.modal .modal-confirm__link,.modal--reg .modal-reg__link--close'),
        langSelectBtn: $('.header__util .lang__link'),
        langSelectList: $('.header__util .select-lang'),

        sectionSeries: $('.section--series .series-thumb'),
        seriesDetail: $('.section--series .series-detail'),
        seriesgroupLink: $('.section--series .detail-group__list .group__link'),
        seriesDetailArtist: $('.section--series .detail-artist__list >li'),

        goodsSildeWrap: $('.goods-slide__wrap'),
        goodsItem: $('.goods-slide__wrap .goods-item'),
        goodsModalArrowPrev: $('.modal--goods .goods-detail__wrap .swiper-nav .prev'),
        goodsModalArrowNext: $('.modal--goods .goods-detail__wrap .swiper-nav .next'),

        gotopBtn: $('.header-logo__link')
    };

    _.userAgent = navigator.userAgent;

    _.videoList = ['./assets/video/main/superstar_mo_blur.mp4'];

    //swiper
    _.swiper = {
        game: null,
        series: null,
        goods: null,
        goodsDetail: null,
        ssgo: null
    };

    //screen height view
    _.viewHeight = 0;

    //modal
    _.modal = {
        alert: function (dataText) {
            gnbFixed();
            _.element.modal.alert.find('.alert__msg').html(dataText.textMsg);
            _.element.modal.alert.find('.btn-confirm .text').text(dataText.textConfirm);
            _.element.modal.alert.addClass('modal--on');
        },
        reg: function (dataText) {
            gnbFixed();
            _.element.modal.reg.addClass('modal--on');
        },
        goods: null
    };

    // 메인화면 브라우저 100% 높이값 설정
    // 모바일 브라우저 상태창에 따라 비율이 달라짐을 방지하여 최초 1회만 설정
    function setviewHeight(aa) {
        _.viewHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

        _.element.backgroundSection.css('height', _.viewHeight + 'px');
        _.element.sectionVisual.css('height', _.viewHeight + 'px');
    }

    // 메인 비디오 랜덤 재생
    function setVideoPlay() {
        var videoElement = _.element.backgroundVideo[0];
        const videoSel = Math.floor(Math.random() * _.videoList.length);

        $(videoElement).attr('src', _.videoList[videoSel]);

        videoElement.load();

        $(videoElement).off('loadeddata ended');

        $(videoElement).on('loadeddata', function () {
            videoElement.muted = true;
            videoElement.play();
            setTimeout(() => {
                _.element.backgroundvideoWrap.addClass('on');
            }, 10);
        });

        // 반복 재생
        $(videoElement).on('ended', function () {
            videoElement.play();
        });
    }

    // 접속 환경별 구글, 앱 스토어 버튼 노출
    function setStoreBtn() {
        if (/iPad|iPhone|iPod/.test(_.userAgent) || /Macintosh/.test(_.userAgent)) {
            _.element.storeLinkApp.css('display', 'block');
        } else {
            _.element.storeLinkGoogle.css('display', 'block');
        }
    }

    // 스토어 링크 맵핑
    function setStoreLink() {
        _.element.storeLinkGoogle.attr('href', storeLink.google);
        _.element.storeLinkApp.attr('href', storeLink.app);
    }

    // 모달 close
    function onClickModalClose() {
        let target = $(this).data('modal');

        _.element.modal.wrapper.removeClass('modal--on');
        gnbFixedClear();
        if (target == 'goods') {
            _.swiper.goodsDetail.destroy();
        }
    }

    // 언어선택상자
    function onClickSelectLang() {
        _.element.langSelectList.toggleClass('select-lang--on');
    }

    // 도큐먼트 클릭 이벤트
    function onClickDocument(e) {
        // 언어 선택상자 닫기
        if (_.element.langSelectBtn.has(e.target).length === 0) {
            _.element.langSelectList.removeClass('select-lang--on');
        }
    }

    let pageOffsetY = null;
    /* body - fixed 처리 */
    function gnbFixed() {
        pageOffsetY = window.pageYOffset;
        _.element.body.addClass('page--fixed').css('top', -pageOffsetY);
    }

    /* body - fixed 해제 처리 */
    function gnbFixedClear() {
        _.element.body.removeClass('page--fixed').css('top', '');
        window.scrollTo(0, pageOffsetY);
    }

    // gnb open
    function onClickGnbOpened() {
        gnbFixed();
        _.element.gnbMenu.addClass('header__menu--open');
    }
    // gnb close
    function onClickGnbClosed() {
        gnbFixedClear();
        _.element.gnbMenu.removeClass('header__menu--open');
    }

    // 스크롤 시 메뉴 활성화
    function isActiveSection() {
        let scrollPosition = $(window).scrollTop();
        let windowHeight = $(window).height();

        $('.section').each(function () {
            let sectionTop = $(this).offset().top;
            let sectionHeight = $(this).outerHeight();
            let sectionId = $(this).attr('id');
            let sectionEnterRatio = 0.7;

            // 섹션이 화면의 50% 이상 보일 때 활성화
            if (scrollPosition + windowHeight / 2 >= sectionTop && scrollPosition + windowHeight / 2 < sectionTop + sectionHeight) {
                $('.menu__gnb .gnb__item a').removeClass('active');
                $('.menu__gnb .gnb__item a[href="#' + sectionId + '"]').addClass('active');
            }

            // 섹션이 하단에서 30% 노출되는 시점 감지
            if (scrollPosition + windowHeight * sectionEnterRatio >= sectionTop) {
                $(this).addClass('section--on');
            } else {
                $(this).removeClass('section--on');
            }
        });
    }

    // 메뉴 클릭
    function onClickGnbMenu(event) {
        event.preventDefault();
        onClickGnbClosed();

        let targetSection = $(this).attr('href');
        _.element.body.animate(
            {
                scrollTop: $(targetSection).offset().top
            },
            500
        );
    }

    function initSwiper() {
        // 게임 소개 슬라이드
        _.swiper.game = new Swiper('.game-img__wrap .swiper', {
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.game-img__wrap .swiper-nav .pagination',
                bulletClass: 'pagination-bullet',
                bulletActiveClass: 'pagination-bullet--on',
                clickable: true
            },
            on: {
                slideChangeTransitionStart: function () {
                    $('.game-text__wrap p').removeClass('on');
                },
                slideChangeTransitionEnd: function (swiper) {
                    $(`.game-text__wrap p[data-index="${swiper.realIndex}"]`).addClass('on');
                }
            }
        });

        // 시리즈 슬라이드
        _.swiper.series = new Swiper('.series-thumb__wrapper .swiper', {
            loop: true,
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 0,
            slidesPerGroup: 1,
            threshold: 30,
            touchRatio: 0.9,
            speed: 500,
            navigation: {
                nextEl: '.series-thumb__wrapper .next',
                prevEl: '.series-thumb__wrapper .prev'
            },
            on: {
                slideChangeTransitionStart: function (swiper) {
                    _.element.seriesDetail.removeClass('on');
                },
                slideChangeTransitionEnd: function (swiper) {
                    const $activeSlide = $(swiper.slides[swiper.activeIndex]);
                    const group = $activeSlide.data('group');
                    _.element.seriesDetail.filter('[data-group="' + group + '"]').addClass('on');
                    setArtistReset();
                }
            }
        });

        // 굿즈
        _.swiper.goods = new Swiper('.goods-slide__wrap .swiper', {
            slidesPerView: 1,
            loop: true,
            speed: 300,
            pagination: {
                el: '.goods-slide__wrap .swiper-nav .pagination',
                bulletClass: 'pagination-bullet',
                bulletActiveClass: 'pagination-bullet--on',
                clickable: true
            },
            on: {
                slideChangeTransitionStart: function () {},
                slideChangeTransitionEnd: function (swiper) {}
            }
        });

        // 슈퍼스타 Go
        _.swiper.ssgo = new Swiper('.ssgo-slide__wrap .swiper', {
            effect: 'creative',
            loop: 'true',
            centeredSlides: true,
            slidesPerView: 'auto',
            slidesPerGroup: 1,
            threshold: 30,
            touchRatio: 0.9,
            speed: 600,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            creativeEffect: {
                limitProgress: 1,
                prev: {
                    scale: 0.85,
                    rotate: [0, 0, 0],
                    translate: ['-48%', 0, -150]
                },
                next: {
                    scale: 0.85,
                    rotate: [0, 0, 0],
                    translate: ['48%', 0, -150]
                }
            },
            pagination: {
                el: '.section--ssgo .ssgo-slide__wrap .swiper-nav .pagination',
                bulletClass: 'pagination-bullet',
                bulletActiveClass: 'pagination-bullet--on',
                clickable: true
            },
            on: {
                slideChange: function (swiper) {
                    $('.ssgo-text__list li').removeClass('on');
                    $(`.ssgo-text__list li[data-index="${swiper.realIndex}"]`).addClass('on');
                }
            }
        });
    }

    // 시리즈 아티스트 전환 효과
    function setArtistReset() {
        _.element.seriesDetailArtist.removeClass('on');
        _.element.seriesDetailArtist.filter('[data-index="0"]').addClass('on');

        _.element.seriesgroupLink.removeClass('on');
        _.element.seriesgroupLink.filter('[data-index="0"]').addClass('on');
    }

    // 시리즈 그룹 아이콘 클릭 이벤트
    function onClickGroupLink(e) {
        let target = $(this);
        let targetIndex = $(this).data('index');
        _.element.seriesDetailArtist.removeClass('on');
        _.element.seriesDetailArtist.filter('[data-index="' + targetIndex + '"]').addClass('on');

        _.element.seriesgroupLink.removeClass('on');
        target.addClass('on');

        e.preventDefault();
    }

    // 굿즈 모달
    function setGoodsModalSlide(initialSlide) {
        _.swiper.goodsDetail = new Swiper('.modal--goods .goods-detail__wrap .swiper', {
            slidesPerView: 1,
            initialSlide: initialSlide - 1,
            loop: true,
            on: {
                slideChangeTransitionStart: function () {},
                slideChangeTransitionEnd: function (swiper) {}
            }
        });
    }

    // 굿즈 이미지 클릭시 확대효과
    function onClickGoodsItemLink() {
        let targetIndex = $(this).data('index');

        _.element.modal.goods.addClass('modal--on');
        setGoodsModalSlide(targetIndex);
        gnbFixed();
    }

    // 굿즈 모달 좌우 화살표 이벤트
    function onClickGoodsModalArrowLink() {
        let targetType = $(this).data('type');

        if (targetType == 'prev') {
            _.swiper.goodsDetail.slidePrev();
        } else {
            _.swiper.goodsDetail.slideNext();
        }
    }

    // 슈퍼스타 go 버튼 coming soon
    function onClickStoreSsgo() {
        _.element.modal.comingSoon.addClass('modal--on');
        gnbFixed();
    }

    // top 버튼
    function onClickGoTop(event) {
        _.element.body.animate({ scrollTop: 0 }, 500);

        event.preventDefault();
    }

    // 배경 페럴렉스 스크롤
    function setSpaceScroll() {
        let scrollY = $(window).scrollTop();
        const windowHeight = $(window).height();
        const triggerPoint = windowHeight / 2;

        // opacity 조정
        let opacity = scrollY / triggerPoint;
        opacity = Math.min(Math.max(opacity, 0), 1); // clamp 0~1
        _.element.spaceWrap.css('opacity', opacity);
    }

    // 별똥별 배경 애니메이션
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    let width, height;

    function starCanvasResize() {
        const container = document.querySelector('.space') || document.body;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        resetStars(); // 사이즈 조정 시 별 위치 재설정
    }

    // 작은 별 이미지 로드
    const starImages = [];
    const imagePaths = ['./assets/images/star1.png', './assets/images/star2.png'];
    let imagesLoaded = 0;

    imagePaths.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            imagesLoaded++;
            maybeStart();
        };
        starImages.push(img);
    });

    // 큰 별 이미지 로드
    const bigStarImages = [];
    const bigImagePaths = ['./assets/images/big-star1.png', './assets/images/big-star2.png'];
    let bigImagesLoaded = 0;

    bigImagePaths.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            bigImagesLoaded++;
            maybeStart();
        };
        bigStarImages.push(img);
    });

    function maybeStart() {
        if (imagesLoaded === imagePaths.length && bigImagesLoaded === bigImagePaths.length) {
            starInit();
        }
    }

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.scale = Math.random() * 0.6 + 0.6;
            this.image = starImages[Math.floor(Math.random() * starImages.length)];
            this.alpha = Math.random() * 0.5 + 0.5;
            this.alphaChange = (Math.random() * 0.005 + 0.005) * (Math.random() < 0.5 ? -1 : 1);
        }

        update() {
            this.alpha += this.alphaChange;
            if (this.alpha >= 1 || this.alpha <= 0.3) {
                this.alphaChange *= -1;
            }
        }

        draw() {
            const size = 20 * this.scale;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.image, this.x - size / 2, this.y - size / 2, size, size);
            ctx.restore();
        }
    }

    class BigStar {
        constructor() {
            this.reset();
            this.rotation = 0;
            this.rotationSpeed = 0.001 + Math.random() * 0.002;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.scale = Math.random() * 0.5 + 0.5;
            this.image = bigStarImages[Math.floor(Math.random() * bigStarImages.length)];
            this.alpha = Math.random() * 0.5 + 0.5;
            this.alphaChange = (Math.random() * 0.002 + 0.001) * (Math.random() < 0.5 ? -1 : 1);
        }

        update() {
            this.alpha += this.alphaChange;
            if (this.alpha >= 1 || this.alpha <= 0.3) this.alphaChange *= -1;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            const w = 84 * this.scale;
            const h = 80 * this.scale;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.image, -w / 2, -h / 2, w, h);
            ctx.restore();
        }
    }

    const frontStarImage = new Image();
    frontStarImage.src = './assets/images/shooting_star_front.png';

    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.len = Math.random() * 20 + 30; // 90 ~ 160 유성 꼬리 길이
            this.speed = Math.random() * 1.5 + 1.5;
            this.angle = (3 * Math.PI) / 3.5;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;

            // 유성의 전체 이동 거리를 예측 (alpha 1 → 0까지 이동하는 거리)
            const maxLifetime = 1 / 0.01; // 매 프레임마다 alpha -= 0.01
            const moveDistanceX = this.vx * maxLifetime;
            const moveDistanceY = this.vy * maxLifetime;

            // 시작점 계산: 도착 지점을 캔버스 안에 두기 위해, 이동 거리 만큼 미리 확보
            const marginX = Math.abs(moveDistanceX) + this.len;
            const marginY = Math.abs(moveDistanceY) + this.len;

            this.x = Math.random() * (width - marginX) + marginX / 2;
            this.y = Math.random() * (height - marginY) + marginY / 2;

            this.alpha = 1;
            this.frontStarSize = 80;
            this.frontStarScale = Math.random() * 0.7 + 0.3; // 0.3 ~ 1.0배로 조정
            this.rotation = 0;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.01;
            this.rotation += this.rotationSpeed;

            if (this.alpha <= 0) this.reset();
        }

        draw() {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * this.len, this.y - this.vy * this.len);

            gradient.addColorStop(0, 'rgba(255,255,255,0)');
            gradient.addColorStop(0.1, `rgba(255,255,255,${this.alpha})`);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * this.len, this.y - this.vy * this.len);
            ctx.stroke();

            if (frontStarImage.complete) {
                const offsetX = this.x - this.vx * this.len * 0.01;
                const offsetY = this.y - this.vy * this.len * 0.01;
                const scaledSize = this.frontStarSize * this.frontStarScale;

                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.translate(offsetX, offsetY);
                ctx.rotate(this.rotation);
                ctx.drawImage(frontStarImage, -scaledSize / 2, -scaledSize / 2, scaledSize, scaledSize);
                ctx.restore();
                ctx.globalAlpha = 1;
            }
        }
    }

    let stars = [];
    let bigStars = [];
    const shootingStars = [];

    function resetStars() {
        stars = Array.from({ length: 150 }, () => new Star());
        bigStars = Array.from({ length: 10 }, () => new BigStar());
    }

    function starInit() {
        starCanvasResize();
        resetStars();
        animate();
    }

    function maybeCreateShootingStar() {
        // 유성 최대 5개만 노출, 그 이하인 경우 0.5% 확률로 등장
        if (shootingStars.length < 5 && Math.random() < 0.005) {
            shootingStars.push(new ShootingStar());
        }
    }

    function maybeCreateShootingStar() {
        // 유성 최대 3개만 노출, 그 이하인 경우 0.2% 확률로 등장
        if (shootingStars.length < 3 && Math.random() < 0.002) {
            shootingStars.push(new ShootingStar());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        bigStars.forEach(big => {
            big.update();
            big.draw();
        });

        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.update();
            s.draw();
            if (s.alpha <= 0) shootingStars.splice(i, 1);
        }

        maybeCreateShootingStar();
        requestAnimationFrame(animate);
    }

    // 리사이즈 최적화: 300px 이상 변화시에만 적용 (모바일 버벅임...)
    let lastResizeWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        const diff = Math.abs(currentWidth - lastResizeWidth);

        if (diff >= 300) {
            lastResizeWidth = currentWidth;
            starCanvasResize();
        }
    });

    // 스크롤 이벤트
    function onScrollWindow() {
        isActiveSection();
        setviewHeight(2);
        if (!$('.header__menu').hasClass('header__menu--open')) {
            setSpaceScroll();
        }
    }

    // event
    function setEvent() {
        _.element.gnbLink.on('click', onClickGnbOpened);
        _.element.gnbMenuCloseBtn.on('click', onClickGnbClosed);
        _.element.gotopBtn.on('click', onClickGoTop);

        _.element.storeSsgoBtn.on('click', onClickStoreSsgo);
        _.element.modalCloseBtn.on('click', onClickModalClose);
        _.element.langSelectBtn.on('click', onClickSelectLang);
        _.element.gnbMenuLink.on('click', onClickGnbMenu);

        _.element.seriesgroupLink.on('click', onClickGroupLink);
        _.element.goodsItem.on('click', onClickGoodsItemLink);
        _.element.goodsModalArrowPrev.on('click', onClickGoodsModalArrowLink);
        _.element.goodsModalArrowNext.on('click', onClickGoodsModalArrowLink);
    }

    // init
    (function () {
        setVideoPlay();
        setStoreBtn();
        setviewHeight(1);
        setStoreLink();
        initSwiper();
        setEvent();

        onScrollWindow();

        $(document).on('click', onClickDocument);
        $(window).on('resize', onScrollWindow);
        $(window).on('scroll', onScrollWindow);
    })();
}

$(document).ready(function () {
    window.superstar = window.superstar || {};

    window.superstar.ui = new PageIndex();
});
