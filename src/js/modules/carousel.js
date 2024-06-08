
import 'slick-carousel'
import 'slick-carousel/slick/slick.css' // 追加
// import 'slick-carousel/slick/slick-theme.css' // 追加

// ----------------------------------------------------------------------------
// slickで無限ループスライダー
// ----------------------------------------------------------------------------
export const slickInfiniteScroll = () => {
  const slider = $('.slider')
  // ビューポートの高さを取得
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  // ビューポートの30%を計算
  const rootMarginValue = -(viewportHeight * -0.1) + 'px'

  const options = {
    root: null, // ビューポートをルートとして使用
    rootMargin: `0px 0px ${rootMarginValue} 0px`, // 下部のマージンを設定
    threshold: 0
  }

  const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 要素がビューポートに30%手前から入ったら初期化
        slider.slick({
          autoplay: true,
          autoplaySpeed: 0,
          speed: 5000,
          slidesToShow: 5,
          cssEase: 'linear',
          pauseOnHover: false,
          pauseOnFocus: false,
          responsive: [
            {
              breakpoint: 750,
              settings: {
                slidesToShow: 3
              }
            }
          ]
        })

        // 初期化後はobserverを切断
        observer.unobserve(entry.target)
      }
    })
  }

  // Intersection Observerを作成
  const observer = new IntersectionObserver(handleIntersect, options)

  // `.slider`要素を監視対象に追加
  observer.observe(slider[0])
}

// ----------------------------------------------------------------------------
// slickで片側はみ出スライダー
// ----------------------------------------------------------------------------
export const slickSetupPartialOutSlider = () => {
  $('.c-news__box').slick({
    infinite: true,
    prevArrow: '<a class="c-arrow m prev"><span class="dli-arrow-left"></span></a>',
    nextArrow: '<a class="c-arrow m next"><span class="dli-arrow-right"></span></a>',
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    adaptiveHeight: true,
    variableWidth: true,
    dots: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          pauseOnFocus: false,
          pauseOnHover: false
        }
      }
    ]
  })
}

// ----------------------------------------------------------------------------
// slickでフェード
// ----------------------------------------------------------------------------
export const slickFade = () => {
  $('.c-mv--bg--top__slick__inner').slick({
    autoplay: true,
    infinite: false,
    speed: 2000,
    autoplaySpeed: 6000,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          pauseOnFocus: false,
          pauseOnHover: false,
          centerMode: true
        }
      }
    ]
  })
}
