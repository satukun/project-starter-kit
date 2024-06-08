

import MicroModal from 'micromodal'
// ----------------------------------------------------------------------------
// modal
// ----------------------------------------------------------------------------

export const openModal = () => {
  let number = 0
  $('.c-card__trigger').on('click', function () {
    number = $('.c-card__trigger').index(this)
  })
  $('.c-card__list .c-linkArrow').on('click', function () {
    number = $('.c-card__list .c-linkArrow').index(this)
  })

  $('.c-comfirm').on('click', function () {
    $('.c-modal--comfirm').removeClass('is-hide')
    $('.c-modal--promotion').addClass('is-hide')
  })
  $('.c-card__trigger,.c-card__list .c-linkArrow').on('click', function () {
    $('.c-modal--promotion').removeClass('is-hide')
    $('.c-modal--comfirm').addClass('is-hide')
  })

  MicroModal.init({
    openClass: 'is-open',
    disableScroll: true,
    disableFocus: false,
    awaitOpenAnimation: true,
    awaitCloseAnimation: false,
    onShow: () => {
      $('.overlay--modal').remove() // 既存のオーバーレイを削除
      const $overlay = $('<div>', {
        class: 'overlay--modal',
        'aria-label': 'Close modal',
        'data-micromodal-close': ''
      })
      $('body').prepend($overlay)

      $('.c-modal').slick({
        infinite: true,
        prevArrow: '<a class="c-arrow l prev reverse"></a>',
        nextArrow: '<a class="c-arrow l next"></a>',
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        initialSlide: number,
        adaptiveHeight: true,
        variableWidth: true,
        responsive: [{ breakpoint: 750, settings: { slidesToShow: 1, arrows: true } }]
      })
    },
    onClose: () => {
      $('.overlay--modal').remove()
      $('.c-modal').slick('unslick')
    }
  })

  $(document).on('click', '.overlay--modal, [data-micromodal-close]', () => {
    MicroModal.close('modal')
  })
}
