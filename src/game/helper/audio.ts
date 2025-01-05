import {Howl, Howler} from 'howler';

export const shopMusic = new Howl({
  src: 'assets/audio/casio_city.ogg',
  loop: true,
})

export const gameMusic = new Howl({
  src: 'assets/audio/cats_on_venus.ogg',
  loop: true,
})

export const titleMusic = new Howl({
  src: 'assets/audio/sorry.ogg',
  loop: true,
})

export const beepSfx = new Howl({
  src: 'assets/audio/sfx/beep.wav',
  loop: false,
})

export const buySfx = new Howl({
  src: 'assets/audio/sfx/buy.wav',
  loop: false,
})

export const collideSfx = new Howl({
  src: 'assets/audio/sfx/collide.wav',
  loop: false,
})

export const wrongOrderSfx = new Howl({
  src: 'assets/audio/sfx/wrong_order.wav',
  loop: false,
})

export const menuOpenSfx = new Howl({
  src: 'assets/audio/sfx/menu_open.wav',
  loop: false,
})

export const goodOrderSfx = new Howl({
  src: 'assets/audio/sfx/good_order.wav',
  loop: false
})