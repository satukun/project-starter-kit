/**
 * カルーセル
 */
export const SlickCarousel = () => {
  $(".js-slick").slick({
    infinite: true,
    slidesToShow: 1,
    dots: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false,
        },
      },
    ],
  });
};

export const SlickCarouselSp = () => {
  $(window).on("load resize", function () {
    if ($(this).innerWidth() <= 640) {
      $(".js-slickSp").not(".slick-initialized").slick({
        infinite: false,
        slidesToShow: 1,
        dots: true,
        variableWidth: true,
        arrows: false,
      });
    } else {
      $(".js-slickSp.slick-initialized").slick("unslick");
    }
  });
};

/**
 * アコーディオン
 */
export const ToggleMore = () => {
  $(".js-toggleMore").on("click", function () {
    $(this).parents(".caseStudyTextBlock").children(".text").slideToggle();
    $(this).toggleClass("is-open");

    if ($(this).hasClass("is-open")) {
      $(this).text("閉じる");
    } else {
      $(this).text("詳しく読む");
    }
  });
};

export const ToggleAnswer = () => {
  $(".js-toggleAnswer").on("click", function () {
    let nav = $(".floatingNav");
    $(this).next().slideToggle();
    $(this).children(".text").toggleClass("is-open");
  });
};

/**
 * スムーズスクロール
 */
export const SmoothScroll = () => {
  $('a[href^="#"]').on("click", function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top - 10,
      },
      500
    );
  });
};

/**
 * スクロールエフェクト
 */
export const ActiveScrollEffect = () => {
  const target = document.querySelectorAll(".scrollEffect");
  const targetArray = Array.prototype.slice.call(target, 0);
  const options = {
    root: null,
    rootMargin: "-10% 0px",
    threshold: 0.2,
  };
  const observer = new IntersectionObserver(doWhenIntersect, options);
  targetArray.forEach((target) => {
    observer.observe(target);
  });

  /**
   * 交差したときに呼び出す関数
   * @param entries
   */
  function doWhenIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateEffect(entry.target);
      }
    });
  }

  /**
   * エフェクトをアクティブにするclassを付与
   * @param element
   */
  function activateEffect(element) {
    element.classList.add("is-active");
  }
};

/**
 * ローディング
 */
export const Loading = () => {
  $("html, body").css({ overflow: "hidden" });

  new Promise((resolve) => {
    setTimeout(() => {
      $(".js-loading").fadeOut(300);
      $("html, body").css({ overflow: "initial" });
      resolve();
    }, 1000);
  })
    .then(() => {
      $("body").addClass("is-loaded");
      $(".floatingNav").addClass("is-show");
    })
    .then(() => {
      setTimeout(() => {
        ActiveScrollEffect();
      }, 1000);
    })
    .then(() => {
      setTimeout(() => {
        $(".floatingNav").removeClass("is-hide is-show");
      }, 2000);
    });
};

/**
 * フローティングナビ
 */
export const FloatingNav = () => {
  $(window).on("scroll load", function () {
    let nav = $(".floatingNav");
    let navHeight = nav.innerHeight();
    let windowHeight = $(window).innerHeight();
    let windowScroll = $(window).scrollTop();
    let footer = $(".footerArea");
    let commonForTopBtn = $(".cp-PageTop");
    if (
      windowScroll + windowHeight >=
      footer.offset().top - (footer.innerHeight() - navHeight)
    ) {
      nav.removeClass("is-fixed");
      commonForTopBtn.addClass("is-footerSticky");
    } else {
      nav.addClass("is-fixed");
      commonForTopBtn.removeClass("is-footerSticky");
    }
  });
};

export const RIB = {
  Loading,
  SlickCarousel,
  SlickCarouselSp,
  ToggleMore,
  ToggleAnswer,
  SmoothScroll,
  FloatingNav
};
