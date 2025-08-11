import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { Barba } from '@barba/core';
import gsap from 'gsap';

Barba.init({
  transitions: [
    {
      name: 'page-transition',
      async leave(data) {
        await gsap.to(data.current.container, { opacity: 0, duration: 0.8 });
      },
      async enter(data) {
        await gsap.from(data.next.container, { opacity: 0, duration: 0.8 });
        initThreeScene();  // 每次進新頁時重新啟動 WebGL scene
      }
    }
  ]
});
