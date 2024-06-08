import validate from 'validate.js'

// ----------------------------------------------------------------------------
// ハンバーガーメニューのトグル
// ----------------------------------------------------------------------------
export const toggleHamburgerMenu = () => {
  const $hamburger = $('.js-hamburger')
  const $menu = $('.js-menu')
  const activeClass = 'is-active'
  const noScrollClass = 'no-scroll'
  const $overlay = $('<div>', { class: 'overlay' }) // 空のdivタグを作成

  $hamburger.on('click', function () {
    $(this).toggleClass(activeClass)
    $menu.toggleClass(activeClass)

    // メニューが開いている時
    if ($menu.hasClass(activeClass)) {
      $('body').addClass(noScrollClass).prepend($overlay) // no-scrollクラスを追加し、空のdivタグをbodyの直下に追加
    } else {
      $('body').removeClass(noScrollClass)
      $('.overlay').remove() // 空のdivタグを削除
    }
  })

  // ブラウザの幅が751px以上になったら特定の処理を実行
  $(window).on('resize', function () {
    if ($(window).width() >= 751) {
      $('body').removeClass(noScrollClass)
      $('.overlay').remove()
      $menu.removeClass(activeClass)
      $hamburger.removeClass(activeClass)
    }
  })

  // 750px以下の時、.c-nav以下のaタグをクリックしたら特定の処理を実行
  $('.c-nav a').on('click', function () {
    if ($(window).width() <= 750) {
      $(this).toggleClass(activeClass)
      $menu.toggleClass(activeClass)
      $('body').removeClass(noScrollClass)
      $('.overlay').remove()
    }
  })
}

// ----------------------------------------------------------------------------
// スムーズスクロール
// ----------------------------------------------------------------------------
export const smoothScroll = (className, options) => {
  $.fn.smoothScrollTrigger = function (options) {
    // 引数を設定する
    const defaults = {
      speed: 700,
      offset: 0,
      easing: 'swing'
    }
    const settings = $.extend(defaults, options)

    this.on('click', function (e) {
      e.preventDefault()
      const href = $(this).attr('href')
      const target = $(href === '#' || href === '' ? 'html' : href)
      const position = target.offset().top - settings.offset
      $('body,html').stop().animate(
        {
          scrollTop: position
        },
        settings.speed,
        settings.easing
      )
      return false
    })

    return this
  }

  $(className).smoothScrollTrigger(options)
}

// ----------------------------------------------------------------------------
// フローティングナビゲーション
// ----------------------------------------------------------------------------
export const floatingNav = () => {
  const nav = $('.js-floating')
  const navHeight = nav.innerHeight()
  let timer = null

  $(window).on('load scroll resize', function () {
    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      const scrollTop = $(this).scrollTop()
      const footerTop = $('.l-footer').offset().top
      const windowHeight = $(this).outerHeight()

      if (scrollTop > 300) {
        nav.removeClass('is-hide').addClass('is-show')
        if (windowHeight + scrollTop > footerTop + navHeight) {
          const position = windowHeight + scrollTop - footerTop
          nav.css({ bottom: position })
        } else {
          nav.css({ bottom: 0 })
        }
      } else {
        nav.removeClass('is-show').addClass('is-hide')
      }
    }, 250)
  })
}

// ----------------------------------------------------------------------------
// アコーディオン
// ----------------------------------------------------------------------------
export const openAccordion = () => {
  const btn = $('.c-accordion__button')
  btn.on('click', function () {
    $(this).addClass('is-hide')
    $(this).prev('.c-accordion').slideDown(200)
  })
}

// ----------------------------------------------------------------------------
// 印刷プレビューを表示する
// ----------------------------------------------------------------------------
export const printPreview = () => {
  // 既存のクリックイベントを削除して、新たに設定
  $('.c-modal_printAction').on('click', function () {
    const $modalInner = $('.slick-slide.slick-current.slick-active').clone()

    console.log($modalInner)
    // クローンした要素をbodyの直下の最上部に一時的に追加
    $('body').prepend($modalInner)

    // 印刷実行
    window.print()

    // 印刷後、追加したクローンを削除
    $modalInner.remove()
  })
}

// ----------------------------------------------------------------------------
// 画像を徐々に表示する CSS アニメーション
// ----------------------------------------------------------------------------
export const imageFadeIn = (options = {}) => {
  const images = document.querySelectorAll('.c-imageFadeIn')

  const defaultOptions = {
    threshold: 0.2,
    baseDelay: 100,
    ...options
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.intersectionRatio >= defaultOptions.threshold) {
          const delay = index * defaultOptions.baseDelay
          setTimeout(() => {
            entry.target.classList.add('img-animation')
            observer.unobserve(entry.target) // 監視を停止
          }, delay)
        }
      })
    },
    { threshold: defaultOptions.threshold }
  )

  images.forEach((img) => {
    observer.observe(img)
  })
}

// ----------------------------------------------------------------------------
// スクロールを検知してヘッダーを隠す
// ----------------------------------------------------------------------------
export const hideHeader = () => {
  let lastScrollTop = 0
  const body = document.body
  const threshold = 3 // 3pxのズレの閾値

  // throttle関数を定義
  const throttle = (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // スクロールイベントに反応する関数
  const onScroll = () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
    if (!body.classList.contains('u-lock')) {
      // スクロール位置の変化が閾値以上の場合のみ処理を実行
      if (Math.abs(scrollPosition - lastScrollTop) > threshold) {
        if (scrollPosition > lastScrollTop) {
          // 下にスクロールした場合
          body.classList.add('scroll')
        } else {
          // 上にスクロールした場合
          body.classList.remove('scroll')
        }
        lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition
      }
    }
  }

  // スクロールイベントにthrottleを適用
  window.addEventListener('scroll', throttle(onScroll, 100), false)
}

// ----------------------------------------------------------------------------
// ページトップボタンを隠す、固定する
// ----------------------------------------------------------------------------
export const toggleHockClass = () => {
  let lastScrollTop = 0
  window.addEventListener(
    'scroll',
    () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      const buttonRollup = document.querySelector('.c-button-rollup')

      if (!buttonRollup) return

      if (st > lastScrollTop) {
        // スクロールダウン時
        buttonRollup.classList.add('hock')
      } else {
        // スクロールアップ時
        // ブラウザの最下部から100px以内の場合は.hockを削除しない
        if (window.innerHeight + window.scrollY < document.body.offsetHeight - 100) {
          buttonRollup.classList.remove('hock')
        }
      }
      lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling
    },
    false
  )
}

// ----------------------------------------------------------------------------
// アンカースクロール
// ----------------------------------------------------------------------------
export const enableSmoothAnchorScroll = () => {
  // アンカーリンクをすべて選択
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      // デフォルトの動作（ページの瞬間移動）を防止
      event.preventDefault()

      // リンクのhref属性から、スクロール先のIDを取得
      const targetId = link.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // スクロール先の要素が存在する場合、その要素までスムーズにスクロール
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

// ----------------------------------------------------------------------------
// メニューの該当するリンクをホバーして、それ以外をopacityさせる
// ----------------------------------------------------------------------------
export const adjustLinkOpacityOnHover = () => {
  const nav = document.querySelector('.c-nav') // 仮定のナビゲーションコンテナ

  nav.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains('c-nav__link')) {
      document.querySelectorAll('.c-nav__link').forEach((link) => {
        if (link !== e.target) {
          link.style.opacity = '0.4'
        }
      })
    }
  })

  nav.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('c-nav__link')) {
      document.querySelectorAll('.c-nav__link').forEach((link) => {
        link.style.opacity = '1'
      })
    }
  })
}

// ----------------------------------------------------------------------------
// 指定した要素をクローンして配置し、スクロール位置に応じて特定のクラスを追加または削除する
// ----------------------------------------------------------------------------
export const OnHeaderBoxPassingAnchor = () => {
  const url = window.location.href

  // URLに基づいて対象のセレクタを決定
  const isFishList = url.includes('fishlist')
  const isPromotionTool = url.includes('promotion-tool')
  const isRfmCertification = url.includes('rfm-certification')
  let anchorSelector, anchorSpSelector

  if (isFishList) {
    anchorSelector = '.p-fishList__anchor'
    anchorSpSelector = '.p-fishList__anchor--sp'
  } else if (isPromotionTool) {
    anchorSelector = '.p-promotionTool__anchor'
    anchorSpSelector = '.p-promotionTool__anchor--sp'
  } else if (isRfmCertification) {
    anchorSelector = '.p-rfm-certification__anchor'
    anchorSpSelector = '.p-rfm-certification__anchor--sp'
  } else {
    // URLが対象外の場合は処理を終了
    return
  }

  // 指定された要素を直後に配置する処理
  const cloneAndInsertElement = () => {
    const anchor = document.querySelector('.c-anchor')
    const anchorSp = document.querySelector(anchorSpSelector)
    if (anchor && anchorSp) {
      const clonedAnchor = anchor.cloneNode(true)
      anchorSp.insertAdjacentElement('afterend', clonedAnchor)
    } else {
      console.error(`必要な要素が見つかりません: ${anchorSelector} または ${anchorSpSelector}`)
    }
  }

  // スクロールイベントを監視する関数
  const checkScroll = () => {
    const anchor = document.querySelector(anchorSelector)
    const anchorSp = document.querySelector(anchorSpSelector)
    const headerHeight = document.querySelector('.l-header__box').offsetHeight

    if (!anchor || !anchorSp) {
      console.error('要素が見つかりません: ' + anchorSelector + ' または ' + anchorSpSelector)
      return
    }

    if (window.pageYOffset + headerHeight >= anchor.offsetTop) {
      anchorSp.classList.add('on')
    } else {
      anchorSp.classList.remove('on')
      anchorSp.classList.remove('ov')
    }
  }

  // リサイズイベントを監視する関数
  const checkResize = () => {
    const anchorSp = document.querySelector(anchorSpSelector)
    if (window.innerWidth >= 751) {
      anchorSp.classList.remove('on')
      anchorSp.classList.remove('ov')
    } else {
      anchorSp.classList.add('on')
    }
  }

  // .anchor--sp要素のクリックイベントに対する処理を設定
  document.querySelector(anchorSpSelector).addEventListener('click', function () {
    // .ovクラスの追加または削除をトグルする
    this.classList.toggle('ov')
  })

  // .c-anchor内のaタグのクリックイベントに対する処理をイベント委譲で設定
  document.addEventListener('click', (event) => {
    if (window.innerWidth < 750 && event.target.closest('.c-anchor a')) {
      const anchorSp = document.querySelector(anchorSpSelector)
      if (anchorSp) {
        anchorSp.classList.remove('ov')
      }
    }
  })

  cloneAndInsertElement()
  window.addEventListener('scroll', checkScroll)
  window.addEventListener('resize', checkResize)
}

// -----------------------------------------------------------------------------------------------
// 特定のクラスがある場合、ナビのリンクをアンカーへ変更
// -----------------------------------------------------------------------------------------------
export const naviAnchor = () => {
  // '.p-top' クラスがページ内に存在するかチェック
  if (document.querySelector('.p-top')) {
    // ナビゲーション内のすべてのリンクを取得
    const links = document.querySelectorAll('.c-nav a')

    // 各リンクをループ処理
    links.forEach((link) => {
      // href属性から相対パスを取得
      const path = link.getAttribute('href')

      // 相対パスが特定のフォーマットに一致するかチェック
      if (path && path.startsWith('../') && path.endsWith('/')) {
        // パスから新しいアンカーIDを作成 (例: "../news/" -> "#news")
        const newAnchor = '#' + path.split('/')[1]

        // 新しいhref属性をリンクに設定
        link.setAttribute('href', newAnchor)
      }
    })
  }
}

// -----------------------------------------------------------------------------------------------
// スクロール量が、p-promotionTool__anchorのクラスが付与されている要素 - l-headerクラス要素の位置まできたらalertを表示する
// -----------------------------------------------------------------------------------------------
export const showAlert = () => {
  const url = window.location.href
  let targetElement

  if (url.includes('fishlist')) {
    targetElement = document.querySelector('.p-fishList__anchor')
  } else if (url.includes('promotion-tool')) {
    targetElement = document.querySelector('.p-promotionTool__anchor')
  } else if (url.includes('rfm-certification')) {
    targetElement = document.querySelector('.p-rfm-certification__anchor')
  }

  const shadow = document.querySelector('.c-anchor--shadow')

  if (targetElement) {
    const header = document.querySelector('.l-header')
    const headerHeight = header.offsetHeight
    const offset = shadow.offsetTop - headerHeight

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop

      // スクロール位置が offset を超えた場合
      if (scrollPosition >= offset) {
        targetElement.classList.add('on')
      } else {
        targetElement.classList.remove('on')
      }
    }

    // 初期状態を確認し、スクロール量が条件を満たしていれば 'on' クラスを追加
    const handlePageLoad = () => {
      if (window.pageYOffset >= headerHeight) {
        targetElement.classList.add('on')
      }
      handleScroll() // 初期状態も確認
    }

    // DOMContentLoadedイベントで初期状態を確認し、スクロール時にも適用
    document.addEventListener('DOMContentLoaded', handlePageLoad)
    window.addEventListener('scroll', handleScroll)
  }
}

// -----------------------------------------------------------------------------------------------
// フォームバリデーション
// -----------------------------------------------------------------------------------------------
export const formValidate = () => {
  const form = document.querySelector('form')
  const submitButton = form.querySelector('.c-button')

  // バリデーションルールの設定
  const constraints = {
    companyName: {
      presence: { allowEmpty: false, message: '^必須項目です' }
    },
    departmentName: {
      presence: { allowEmpty: false, message: '^必須項目です' }
    },
    contactName: {
      presence: { allowEmpty: false, message: '^必須項目です' }
    },
    kana: {
      presence: { allowEmpty: false, message: '^必須項目です' }
    },
    telephoneNumber: {
      presence: { allowEmpty: false, message: '^必須項目です' }
      // format: {
      //   pattern: '\\d{2,4}\\d{2,4}\\d{3,4}',
      //   message: '^電話番号の形式が正しくありません'
      // }
    },
    email: {
      presence: { allowEmpty: false, message: '^必須項目です' }
      // email: { message: '^メールアドレスの形式が正しくありません' }
    },
    emailConfirm: {
      presence: { allowEmpty: false, message: '^必須項目です' },
      equality: {
        attribute: 'email',
        message: '^メールアドレスが一致しません'
      }
    },
    postalCode: {
      presence: { allowEmpty: false, message: '^必須項目です' }
      // format: {
      //   pattern: '\\d{3}\\d{4}',
      //   message: '^郵便番号の形式が正しくありません'
      // }
    },
    address: {
      presence: { allowEmpty: false, message: '^必須項目です' }
    }
  }

  // エラーメッセージを表示する関数
  const showErrors = (form, errors) => {
    // 全てのエラー要素をクリア
    form.querySelectorAll('.error').forEach((errorElement) => {
      errorElement.textContent = ''
    })

    // エラーがある場合にメッセージを表示
    if (errors) {
      Object.keys(errors).forEach((key) => {
        const errorElement = form.querySelector(`#error-${key}`)
        if (errorElement) {
          // フォーマットエラーまたは一致エラーの場合のみカスタムメッセージを表示
          const message = errors[key][0].includes('形式') || errors[key][0].includes('一致') ? errors[key][0] : '必須項目です'
          errorElement.textContent = message
        }
      })
    }
  }

  const validateForm = () => {
    const errors = validate(form, constraints)
    showErrors(form, errors)
    const isValid = !errors
    const isBlankHidden = document.querySelector('.c-form__blank').classList.contains('none')

    if (isValid && isBlankHidden) {
      submitButton.classList.remove('disabled')
      submitButton.disabled = false
    } else {
      submitButton.classList.add('disabled')
      submitButton.disabled = true
    }
  }

  // 各入力フィールドに対してchangeイベントを設定
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', validateForm)
  })

  // .c-card__input クラスが付与された要素に対してclickイベントを設定
  const cardInputs = document.querySelectorAll('.c-card__input')
  cardInputs.forEach((input) => {
    input.addEventListener('click', validateForm)
  })

  // c-form__table内のspan要素に対するclickイベントを設定
  document.querySelector('.c-form__table').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'span') {
      validateForm()
    }
  })

  // 初回実行でフォームの状態をチェック
  validateForm()
}

// -----------------------------------------------------------------------------------------------
// スクロールをしたらpageTopボタンにactiveクラスを付与して隠す
// -----------------------------------------------------------------------------------------------
export const pageTopActive = () => {
  const pageTop = document.querySelector('.pageTop')
  let lastScrollTop = 0

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop
    if (st > lastScrollTop) {
      pageTop.classList.add('active')
    } else {
      pageTop.classList.remove('active')
    }
    lastScrollTop = st <= 0 ? 0 : st
  })
}

// -----------------------------------------------------------------------------------------------
// すべての画像に対して右クリックメニュー、ドラッグ、選択を無効化
// -----------------------------------------------------------------------------------------------
export const preventImageCopy = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img')

    images.forEach((img) => {
      // 右クリックメニューを無効化
      img.addEventListener('contextmenu', function (e) {
        e.preventDefault()
      })

      // ドラッグを無効化
      img.addEventListener('dragstart', function (e) {
        e.preventDefault()
      })

      // 選択を無効化
      img.addEventListener('selectstart', function (e) {
        e.preventDefault()
      })
    })
  })
}
