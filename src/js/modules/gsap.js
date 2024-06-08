// import Lenis from '@studio-freight/lenis'
import gsap, { Power4 } from 'gsap'
import { ScrollTrigger } from 'gsap/all'

// ----------------------------------------------------------------------------
// GSAP-メニューアニメーション
// ----------------------------------------------------------------------------
export const gsapMenu = () => {
  const isMenuOpen = document.querySelector('.c-hamburger')
  const tl = gsap.timeline({ paused: true })

  tl.fromTo('.c-menu', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, top: 0, ease: Power4.easeOut }).fromTo(
    '.c-menu__item',
    { autoAlpha: 0, y: 40 },
    { autoAlpha: 1, y: 0, stagger: 0.1 }
  )

  const toggleMenu = () => {
    isMenuOpen.classList.toggle('active')

    const body = document.body
    const htmlTag = document.documentElement

    if (isMenuOpen.classList.contains('active')) {
      tl.play().timeScale(1)
      body.classList.add('u-lock')
      htmlTag.classList.add('u-lock')
    } else {
      tl.timeScale(2).reverse()
      body.classList.remove('u-lock')
      htmlTag.classList.remove('u-lock')
    }
  }

  // isMenuOpen にイベントリスナーを追加
  isMenuOpen.addEventListener('click', toggleMenu)

  // ウィンドウリサイズ時の挙動を追加
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 750 && isMenuOpen.classList.contains('active')) {
      toggleMenu()
    }
  })

  const menuLinks = document.querySelectorAll('.c-menu__link')

  menuLinks.forEach((link) => {
    link.addEventListener('click', toggleMenu)
  })
}

// ----------------------------------------------------------------------------
// GSAP-背景パララックス
// ----------------------------------------------------------------------------
export const gsapParallax = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (!isMobile) {
    gsap.registerPlugin(ScrollTrigger)
    gsap.utils.toArray('.js-parallax').forEach((wrap) => {
      const y = wrap.getAttribute('data-y') || -100

      gsap.to(wrap, {
        y,
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          once: true // パフォーマンスのために、一度だけトリガーするように設定
        }
      })
    })
  }
}

// ----------------------------------------------------------------------------
// GSAP-左から右へ横にスライドして画像を表示
// ----------------------------------------------------------------------------
export const gsapAddClipPathAnimationOnScroll = (selector = '.c-clip', startOffset = '70%', delayMultiplier = 100) => {
  const elements = document.querySelectorAll(selector)
  elements.forEach((element, index) => {
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: `top+=${startOffset} bottom`,
      end: 'bottom top',
      onEnter: () => {
        const timeoutId = setTimeout(() => {
          element.classList.add('active')

          // activeが付与されてから2秒後にtransitionをクリア
          setTimeout(() => {
            element.style.transition = 'none'
          }, 5000) // 2000ミリ秒（2秒）後
        }, delayMultiplier * index)

        // トリガーの後で不要になったタイマーはクリアする
        trigger.onKill = () => clearTimeout(timeoutId)
      },
      // onLeave: () => element.classList.remove('active'),
      // onEnterBack: () => element.classList.add('active'),
      // onLeaveBack: () => element.classList.remove('active'),
      scrub: true
    })
  })
}

// ----------------------------------------------------------------------------
// GSAP-リストを下からふわっと表示
// ----------------------------------------------------------------------------
export const gsapAddActiveClassOnScroll = () => {
  gsap.registerPlugin(ScrollTrigger)
  const elements = document.querySelectorAll('.c-target')

  elements.forEach((element, index) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top bottom', // 要素の上端がビューポートの下端に達したときに変更
      end: 'bottom top', // 要素の下端がビューポートの上端に達したとき
      onEnter: () => setTimeout(() => element.classList.add('active'), 10 * index), // 要素がビューポート内に入ったらactiveクラスを追加
      scrub: true // スクロールに合わせて処理を行う
    })
  })
}

// ----------------------------------------------------------------------------
// GSAP-svgラインアニメーションを逆再生で表示
// ----------------------------------------------------------------------------
export const gsapAnimateSvgYearOnScroll = () => {
  gsap.registerPlugin(ScrollTrigger)
  const applyPathAnimation = (path) => {
    const pathLength = path.getTotalLength()
    path.style.strokeDasharray = pathLength
    path.style.strokeDashoffset = pathLength // 初期値をパスの全長に設定
    path.style.strokeWidth = '1px'
    path.style.stroke = '#17aa5d'
    path.style.fill = 'none'

    gsap.to(path.style, {
      strokeDashoffset: 0, // 0に向けてアニメーションさせる
      duration: 2,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to(path.style, {
          fill: '#17aa5d',
          strokeWidth: '0px',
          duration: 1
        })
      }
    })
  }

  const svgBlocks = document.querySelectorAll('.c-phBlock__svg')

  svgBlocks.forEach((svg) => {
    ScrollTrigger.create({
      trigger: svg,
      start: 'top+=15% center',
      once: true,
      onEnter: () => {
        const pathsCls1 = svg.querySelectorAll('.cls-1')
        pathsCls1.forEach((path) => applyPathAnimation(path))

        const pathsCls2 = svg.querySelectorAll('.cls-2')
        pathsCls2.forEach((path) => applyPathAnimation(path))

        setTimeout(() => {
          document.querySelectorAll('.c-clip3').forEach((el) => el.classList.add('active'))

          // さらに2秒後にc-clip4にc-textクラスを付与
          setTimeout(() => {
            document.querySelectorAll('.c-clip4').forEach((el) => el.classList.add('c-text'))
          }, 1000) // ここで2秒後の処理を追加
        }, 1800)
      }
    })
  })
}

// -----------------------------------------------------------------------------------------------
// ページローダー
// -----------------------------------------------------------------------------------------------
export const pageLoader = () => {
  // まずHTMLをbodyタグの最後に追加
  const loadingHtml = `
    <div id="c-loading-wrap">
      <div id="loader" class="c-loader">
        <div id="progress-bar" class="progress-bar">
            <div id="progress" class="progress"></div>
        </div>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', loadingHtml)

  // HTMLが追加されたことを確認
  const progressBar = document.getElementById('progress')
  const loadingWrap = document.getElementById('c-loading-wrap')
  const mainContent = document.querySelector('.l-main')
  const headerContent = document.querySelector('.l-header')

  const skipLoader = () => {
    gsap.to(loadingWrap, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        loadingWrap.style.display = 'none'
        mainContent.style.opacity = 1
        headerContent.style.opacity = 1
        gsapAddActiveClassOnScroll()
      }
    })
  }

  const startLoader = () => {
    window.addEventListener('load', () => {
      gsap.to(progressBar, {
        width: '100%',
        duration: 3,
        onComplete: fadeOutLoader
      })
    })
  }

  const fadeOutLoader = () => {
    gsap.to(loadingWrap, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        loadingWrap.style.display = 'none'
        mainContent.style.opacity = 1
        headerContent.style.opacity = 1
      }
    })
  }

  if (sessionStorage.getItem('loaded')) {
    skipLoader()
    return true
  } else {
    sessionStorage.setItem('loaded', 'true')
    startLoader()
    return true
  }
}
