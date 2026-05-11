import { useEffect, useMemo, useRef, useState } from 'react';

type ViewMode = 'home' | 'detail';
type Aspect = '3:4' | '1:1' | '9:16' | '9:19' | '7:3.5' | '9:11' | '9:4.8';
type WorkItem = { title: string; slug: string; tag: string; type: string; desc: string; cover?: string; aspect?: Aspect; detailMedia?: string[] };
type ImageHostAuditItem = { label: string; field: string; url: string; slug?: string; hidden?: boolean };

type Exp = { company: string; time: string; role: string; details: string[] };

const filters = ['全部', '新质生产力', 'KV海报', '详情设计', '直播&其他', '主图展示', '3D渲染'];
const categoryOrder: Record<string, number> = { 新质生产力: 0, 详情设计: 1, KV海报: 2, '直播&其他': 3, 主图展示: 4, '3D渲染': 5 };
const featuredMain: Record<string, number> = {
  'main-image-blank-01': 0,
  'main-image-blank-02': 1,
  'main-image-blank-03': 2,
  'main-image-blank-04': 3,
  'main-image-blank-05': 4,
  'main-image-blank-06': 5,
  'main-image-square-01': 6,
  'main-image-square-02': 7,
  'main-image-square-03': 8,
  'main-image-square-04': 9,
  'main-image-square-05': 10,
  'main-image-square-06': 11,
  'main-image-17': 12,
  'main-image-05': 13,
  'main-image-09': 14,
  'main-image-extra-01': 15,
  'main-image-extra-02': 16,
  'main-image-extra-03': 17,
  'main-image-06': 18,
  'main-image-12': 19,
  'main-image-01': 20,
  'main-image-02': 21,
  'main-image-03': 22,
  'main-image-10': 23,
  'main-image-07': 24,
  'main-image-08': 25,
  'main-image-04': 26,
};
const featuredRender: Record<string, number> = {};
const renderBottomOrder: Record<string, number> = { 'render-04': 0, 'render-05': 1, 'render-06': 2 };
const hiddenWorks = new Set(['live-14', 'live-19', 'live-20', 'live-27', 'main-image-11', 'main-image-18', 'main-image-19', 'main-image-extra-01']);
const clearedMainImageSlugs = new Set([
  'main-image-extra-01',
]);
const heroSlides = ['https://cloud.video.taobao.com/vod/SLJpuEGQIXMfZWkVJlzEHhZg0afaSoOT_3Jgb3K1yvo.mp4'];
const contactQrImage = 'https://i.111666.best/image/mCX5aD5cQIWsbADdyQFDwK.jpg';

const makeWorks = (tag: string, type: string, prefix: string, links: string[]): WorkItem[] => links.map((cover, i) => ({
  title: `${prefix} ${String(i + 1).padStart(2, '0')}`,
  slug: `${prefix === '主图展示' ? 'main-image' : prefix === '直播视觉' ? 'live' : prefix === '3D渲染' ? 'render' : 'kv'}-${String(i + 1).padStart(2, '0')}`,
  tag,
  type,
  desc: `${tag}视觉展示项目。`,
  cover,
}));

const kvWorks: WorkItem[] = makeWorks('KV海报', 'Campaign Visual', 'KV视觉', [
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01Izq3dX2L08r89XmK3_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01JMH7oH2L08r865vMc_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01Z1WBnd2L08r9gtR6T_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01dfn7CH2L08r7qaFRt_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01IKLGCf2L08r8M8N2z_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01gIeLKK2L08r8Dm9WT_!!1879869629.gif',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01fo7eb52L08r8UJwIm_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01eRMMIe2L08r8HG9aj_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01rKpICI2L08r3Ul66M_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01pNhYJO2L08r8FVz1T_!!1879869629.jpg',
]);

const detailWorks: WorkItem[] = [
  { title: '详情页设计 03', slug: 'detail-design-03', tag: '详情设计', type: 'Detail Page', desc: '详情页新增项目。', cover: 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01QEWeQx2L08r8ZcoHS_!!1879869629.png', detailMedia: ['https://img.alicdn.com/imgextra/i2/1879869629/O1CN01Swp9Ee2L08r8mAW21_!!1879869629.png', 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN018CnkV32L08r8jCYqw_!!1879869629.png'] },
  { title: '营养补剂详情页设计', slug: 'detail-design-01', tag: '详情设计', type: 'Detail Page', desc: '详情页长图展示项目。', cover: 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01bEqyNW2L08r9ROACe_!!1879869629.jpg', detailMedia: ['https://img.alicdn.com/imgextra/i3/1879869629/O1CN01djOqkN2L08r818kd7_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01GjlyD72L08r8Yf0wt_!!1879869629.jpg'] },
  { title: '母婴营养液详情页设计', slug: 'detail-design-02', tag: '详情设计', type: 'Detail Page', desc: '母婴营养品详情页设计。', cover: 'https://cloud.video.taobao.com/vod/Ci7wv6EpVaYddwN7NTuhBGBUp2njvXfqvrIp-c8nN1g.mp4', detailMedia: ['https://cloud.video.taobao.com/vod/yCY7UUA2241Evh5M5hN4cUQvfnTC1QOtRoSrZ2HreOc.mp4', 'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01aqsrtE2L08r8RCKn5_!!1879869629.png', 'https://cloud.video.taobao.com/vod/2szG_tkyL4LKTP1CSfiJmUMICu4E5cLtTJfLuylEiPo.mp4', 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN012rE0Aa2L08r8Lj13t_!!1879869629.png', 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01nFcg3e2L08r3ZHipI_!!1879869629.jpg'] },
  { title: '儿童医学中心项目', slug: 'kv-case-01', tag: 'KV海报', type: 'Trust Visual', desc: '专业背书与科技感视觉项目。', cover: 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01Uagzuo2L08r7yKYaP_!!1879869629.png', detailMedia: ['https://img.alicdn.com/imgextra/i3/1879869629/O1CN01BeqBUG2L08r817sP4_!!1879869629.jpg'] },
];

const liveWorks = makeWorks('直播&其他', 'Live Visual', '直播视觉', [
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01tsOAKO2L08r8E8yl3_!!1879869629.png', 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01bVp3ar2L08r86RLCB_!!1879869629.png',
  'https://cloud.video.taobao.com/vod/uOVrHjIaR9mB3nV5_5_J9dYbded2vW7_yiPV19qGOo4.mp4', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01yTGHMO2L08r8FqjIN_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01NpYJxK2L08r8RgOT4_!!1879869629.png', 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01b9xMD42L08r8Hbhjc_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01c9d17S2L08r8OHuks_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN018Q5qeh2L08r8Z3toO_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01SH0l9p2L08r8UgQhH_!!1879869629.png', 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01liMIUV2L08r3V8atk_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN019nv71V2L08r8ItnBI_!!1879869629.png', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01whrPhm2L08r8Italk_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01cy8HfA2L08r7qwfjE_!!1879869629.png', 'https://i.111666.best/image/6ENnbgj8J3YQfg7LB8waPe.jpg',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01NxZxDG2L08r8MZUR8_!!1879869629.png', 'https://img.alicdn.com/imgextra/i4/1879869629/O1CN017musHt2L08r7qxPUG_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01tz9pfj2L08r8HcRYV_!!1879869629.png', 'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01mee7bi2L08r8RgGEb_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01CNzsS82L08r8FrKmF_!!1879869629.jpg', 'https://i.111666.best/image/2kX8MtVJmLKxurmEV1dM11.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01CNzsS82L08r8FrKmF_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01slUWiA2L08r8MZDnK_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01T1ejhf2L08r8apXVm_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i1/1879869629/O1CN016PcRrw2L08r8Ivs9D_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01fR4FLe2L08r8ItnFb_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01OdJkfH2L08r8i8w3f_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN019nv71V2L08r8ItnBI_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01J6ChHU2L08r8mb21J_!!1879869629.jpg',
]).map((w, i) => ({ ...w, type: i >= 7 && i <= 10 ? 'Live Cover' : 'Live Visual', aspect: ['live-07', 'live-23', 'live-28'].includes(w.slug) ? '9:19' as Aspect : undefined }));

const liveExtraWorks: WorkItem[] = [
  {
    title: '直播视觉新增 01',
    slug: 'live-extra-01',
    tag: '直播&其他',
    type: 'Live Visual',
    desc: '直播&其他新增视频项目。',
    cover: 'https://cloud.video.taobao.com/vod/7_AeOsMyFPLHT5ic8KiPHkKmf3baXaE5qe99SU_tGy8.mp4',
    aspect: '1:1',
  },
];

const mainWorks = makeWorks('主图展示', 'Main Image', '主图展示', [
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN0145jNP62L08r9LWus4_!!1879869629.png', 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01MHhZdJ2L08r7woU0o_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01yIsJ582L08r89XqOG_!!1879869629.png', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN017asOES2L08r9cC8tu_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01uGQTom2L08r8riSdC_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01HVxNmA2L08r863i7H_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01jaP32B2L08r7zeqUN_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01iku4Zo2L08r9H1TQ4_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN0186ntSQ2L08r94UucF_!!1879869629.gif', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01oIKdCe2L08r4PgHhe_!!1879869629.png',
  'https://i.111666.best/image/5Av81yx00UuMwOXp3D37ZJ.png', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01l3C82W2L08r8FUuQ7_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01GG0Fjt2L08r8YjUJF_!!1879869629.jpg', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01eqmQLd2L08r8hhwoT_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01bFx90Z2L08r8t2vKw_!!1879869629.png', 'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01GF5yCf2L08r89WZOh_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01nYsiwb2L08r8lNB2q_!!1879869629.png', 'https://i.111666.best/image/iDYKtiALx5oPeLqWsfFlhu.jpg',
  'https://i.111666.best/image/izjEJCjTOuqNACG4AGwwoy.png',
]);

const mainExtraImages = [
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01oyMlcd2L08r8hixEP_!!1879869629.png',
  'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01FxGfe32L08r8YgKsV_!!1879869629.jpg',
  'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01WINO5s2L08r8M8Eeo_!!1879869629.png',
];

const mainExtraWorks: WorkItem[] = mainExtraImages.map((cover, i) => ({
  title: `Main Image Extra ${String(i + 1).padStart(2, '0')}`,
  slug: `main-image-extra-${String(i + 1).padStart(2, '0')}`,
  tag: mainWorks[0].tag,
  type: 'Main Image',
  desc: 'Main image placeholder.',
  cover,
})).map((work) => (clearedMainImageSlugs.has(work.slug) ? { ...work, cover: undefined } : work));

const mainBlankWorks: WorkItem[] = Array.from({ length: 6 }, (_, i): WorkItem => ({
  title: `Main Image Blank ${String(i + 1).padStart(2, '0')}`,
  slug: `main-image-blank-${String(i + 1).padStart(2, '0')}`,
  tag: mainWorks[0].tag,
  type: 'Main Image',
  desc: 'Main image placeholder.',
  aspect: '3:4',
})).map((work, i) => {
  const coverMap = [
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01ywYacR2L08rAaRQms_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01EloUEd2L08r938itC_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01fi98352L08r9Kb36E_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01qK5xUD2L08r4OjoPD_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01s0Fg8T2L08r8qPd8O_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01eFAuBS2L08r9Agtjm_!!1879869629.png',
  ];
  return coverMap[i] && !clearedMainImageSlugs.has(work.slug) ? { ...work, cover: coverMap[i] } : work;
});

const mainSquareBlankWorks: WorkItem[] = Array.from({ length: 6 }, (_, i): WorkItem => ({
  title: `Main Image Square ${String(i + 1).padStart(2, '0')}`,
  slug: `main-image-square-${String(i + 1).padStart(2, '0')}`,
  tag: mainWorks[0].tag,
  type: 'Main Image',
  desc: 'Main image placeholder.',
  aspect: '1:1',
})).map((work, i) => {
  const coverMap = [
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01F4BqOE2L08r9SQ8tI_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01CrFUO92L08r8qOpG2_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN019ol82T2L08r9AiNBf_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01uFoLWv2L08r998g0o_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01H9qI7W2L08rAaSIrv_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01sjHgZs2L08r8zIyGR_!!1879869629.png',
  ];
  return coverMap[i] && !clearedMainImageSlugs.has(work.slug) ? { ...work, cover: coverMap[i] } : work;
});

const works: WorkItem[] = [
  ...detailWorks,
  ...kvWorks,
  { title: 'AIGC产品广告概念图', slug: 'aigc-01', tag: '新质生产力', type: 'AI Creative', desc: 'AI创意视觉项目。', cover: 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01am20I32L08r8iQO4W_!!1879869629.jpg', detailMedia: ['https://img.alicdn.com/imgextra/i4/1879869629/O1CN01V4ALXm2L08r86ge37_!!1879869629.png', 'https://cloud.video.taobao.com/vod/CPlfefYnvWMCyl005NQjRAeRZ-sov_MqX0mBschlTJQ.mp4'] },
  { title: 'AI产品场景合成', slug: 'aigc-02', tag: '新质生产力', type: 'Scene Generation', desc: 'AI场景合成视觉项目。', cover: 'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01Rr9Keh2L08rCy30ch_!!1879869629.png', detailMedia: ['https://cloud.video.taobao.com/vod/IO8DnbJHU37tJ4Bzwov5vbzv7S0toxHMdu98biFuN1A.mp4', 'https://img.alicdn.com/imgextra/i2/1879869629/O1CN019tUQB62L08r7wKSZ3_!!1879869629.png'] },
  ...liveWorks,
  ...liveExtraWorks,
  ...makeWorks('3D渲染', '3D Render', '3D渲染', [
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01BiGcWW2L08r8GwSFY_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01U3rMGb2L08r9jzuUn_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01DlA8I32L08r8PHWvy_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i1/1879869629/O1CN015ld1An2L08r8XLFEd_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01YtTLo32L08r9k06yV_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01z5vFM42L08r8Gvqnp_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i1/1879869629/O1CN0172tRqD2L08r8XPo7G_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN013N1NV42L08r8XNnP2_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01HiwjPZ2L08r8kxsuH_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01PDLyHP2L08r8bqAGD_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i3/1879869629/O1CN01bzJn9u2L08r7tgWWG_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01fva3VK2L08r8GyP0n_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i4/1879869629/O1CN01QZ48mn2L08r8LZgIV_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01a8weI42L08r7znuBe_!!1879869629.png',
    'https://img.alicdn.com/imgextra/i1/1879869629/O1CN01NNAn4q2L08r7ykGlr_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01BnKi2Q2L08r8IyclK_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01Ff4a5u2L08r8Rj0vR_!!1879869629.jpg',
    'https://img.alicdn.com/imgextra/i2/1879869629/O1CN01UtxC8e2L08r8Rkl1F_!!1879869629.jpg',
  ]),
  ...mainBlankWorks,
  ...mainSquareBlankWorks,
  ...mainExtraWorks,
  ...mainWorks.map((work) => (clearedMainImageSlugs.has(work.slug) ? { ...work, cover: undefined } : work)),
];

const experiences: Exp[] = [
  { company: '上海巴九零网络科技有限公司', time: '2025.08-至今', role: '电商设计师', details: ['旗舰店品牌感重塑：负责“金斯健贝旗舰店”视觉升级，针对原有视觉逻辑混乱的痛点，通过重新定义视觉风格并建立规范，建立具有高辨识度和信任感的品牌视觉形象。', '深度利用 AI 工具：利用AIGC解决设计问题（例如AI提示词工作台），将AI能力融入工作并建立工作流', '深入与运营团队沟通交流，确保设计内容符合市场需求和用户喜好，提升转化率'] },
  { company: '上海晗晟智能科技有限公司', time: '2024.06 - 2025.07', role: '电商设计师', details: ['负责品牌产品站相关设计，包含页面设计、产品渲染、抖音直播图等。负责全店新版主图优化', '负责公司各平台的风格统一，把握产品卖点，搭配不同场景风格进行场景渲染，提升产品的视觉表现力', '与运营团队合作，确保设计内容符合市场需求和用户喜好，提升转化率'] },
  { company: '上海纯米科技股份有限公司', time: '2022.03 - 2024.02', role: '电商设计师', details: ['负责品牌产品站（天猫、京东、官网、有品）相关设计，包含页面设计、产品渲染、产品包装设计等', '负责市场营销活动视觉设计，建立纯米科技品牌规范，根据公司的发展不断完善、优化品牌规范'] },
  { company: '上海恒辉品牌管理有限公司', time: '2018.06 - 2022.01', role: '电商设计师', details: ['主要负责品牌项目的设计工作，包括主页面视觉设计，二级页面，推广图钻展直通车详情页的设计工作'] },
];

const isPlaceholderWork = (work: WorkItem) => work.slug.startsWith('main-image-extra-') || work.slug.startsWith('main-image-blank-') || work.slug.startsWith('main-image-square-') || clearedMainImageSlugs.has(work.slug);
const canOpen = (work: WorkItem) => work.tag === '详情设计' || work.slug === 'aigc-02' || Boolean(work.detailMedia?.length);
const isVideo = (url: string) => /\.mp4(?:$|\?)/i.test(url);
const isImageHost = (url?: string) => Boolean(url && /(i\.111666\.best|duk\.tw)/i.test(url));
const isEditModeEnabled = () => new URLSearchParams(window.location.search).get('edit') === '1';
const aspectCandidates: Array<{ key: Aspect; ratio: number }> = [
  { key: '9:19', ratio: 9 / 19 },
  { key: '9:16', ratio: 9 / 16 },
  { key: '3:4', ratio: 3 / 4 },
  { key: '9:11', ratio: 9 / 11 },
  { key: '1:1', ratio: 1 },
  { key: '7:3.5', ratio: 7 / 3.5 },
  { key: '9:4.8', ratio: 9 / 4.8 },
];
const aspectCandidatesForWork = (work: WorkItem): Array<{ key: Aspect; ratio: number }> => {
  if (work.tag === '主图展示') return [
    { key: '3:4', ratio: 3 / 4 },
    { key: '1:1', ratio: 1 },
  ];
  if (work.tag === '3D渲染') return [
    { key: '9:11', ratio: 9 / 11 },
    { key: '3:4', ratio: 3 / 4 },
    { key: '9:4.8', ratio: 9 / 4.8 },
  ];
  if (work.tag === 'KV海报') return [
    { key: '9:16', ratio: 9 / 16 },
    { key: '3:4', ratio: 3 / 4 },
  ];
  if (work.tag === '直播&其他') return [
    { key: '9:16', ratio: 9 / 16 },
    { key: '1:1', ratio: 1 },
    { key: '7:3.5', ratio: 7 / 3.5 },
  ];
  if (work.tag === '详情设计') return [{ key: '9:16', ratio: 9 / 16 }];
  if (work.tag === '新质生产力') return [{ key: '1:1', ratio: 1 }];
  return aspectCandidates;
};
const defaultAspectForTag = (work: WorkItem): Aspect => {
  if (work.tag === '主图展示') return '3:4';
  if (work.tag === '直播&其他') return '9:16';
  if (work.tag === '3D渲染') return '9:11';
  if (work.tag === '详情设计') return '9:16';
  if (work.tag === 'KV海报') return '3:4';
  return '1:1';
};
const detectAspectForWork = (work: WorkItem, ratio: number) => {
  const candidates = aspectCandidatesForWork(work);
  return candidates.reduce((a, b) => Math.abs(ratio - b.ratio) < Math.abs(ratio - a.ratio) ? b : a).key;
};

const imageHostItems = [
  ...heroSlides.map((url, index) => ({ label: `首屏轮播 ${String(index + 1).padStart(2, '0')}`, field: 'heroSlides', url })),
  { label: '联系方式二维码', field: 'contactQrImage', url: contactQrImage },
  ...works.flatMap((work) => ([
    { label: `${work.title} / ${work.slug}`, field: 'cover', url: work.cover, slug: work.slug, hidden: hiddenWorks.has(work.slug) },
    ...(work.detailMedia ?? []).map((url, index) => ({ label: `${work.title} / ${work.slug} / 媒体 ${index + 1}`, field: 'detailMedia', url, slug: work.slug, hidden: hiddenWorks.has(work.slug) })),
  ])),
].filter((item): item is ImageHostAuditItem => isImageHost(item.url) && !(item as ImageHostAuditItem).hidden);

function ImageHostAuditPanel({ onItemSelect }: { onItemSelect: (item: ImageHostAuditItem) => void }) {
  return (
    <aside className="fixed bottom-6 left-6 z-[90] hidden w-[360px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[18px] border border-amber-300/35 bg-black/82 text-white shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:block">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-amber-100">图床链接标记</p>
          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-100">{imageHostItems.length} 个</span>
        </div>
        <p className="mt-1 text-[12px] leading-5 text-white/48">以下链接来自 i.111666.best / duk.tw，需要替换为无需 VPN 的地址。</p>
      </div>
      <div className="max-h-[52vh] overflow-auto p-3">
        <div className="space-y-2">
          {imageHostItems.map((item, index) => (
            <button key={`${item.field}-${item.url}-${index}`} type="button" onClick={() => onItemSelect(item)} disabled={item.hidden} className={`block w-full rounded-[12px] border p-3 text-left transition ${item.hidden ? 'cursor-not-allowed border-white/8 bg-white/[0.025] opacity-55' : 'border-white/10 bg-white/[0.045] hover:border-amber-300/45 hover:bg-amber-300/[0.07]'}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] font-semibold leading-5 text-white/86">{String(index + 1).padStart(2, '0')} · {item.label}</p>
                <span className="shrink-0 rounded-full bg-amber-300/12 px-2 py-0.5 text-[10px] text-amber-100">{item.hidden ? '已隐藏' : item.field}</span>
              </div>
              <p className="mt-1 break-all text-[11px] leading-5 text-white/42">{item.url}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function TopNav({ isScrolled, onNavClick }: { isScrolled: boolean; onNavClick: (filter: string) => void }) {
  const isEditMode = isEditModeEnabled();
  const showQrHostLabel = isEditMode && isImageHost(contactQrImage);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${isScrolled ? 'border-b border-white/8 bg-[rgba(10,10,10,0.8)] shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-2xl' : 'bg-transparent'}`}>
      <div className="relative h-[72px] w-full px-6 md:px-8">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute left-6 top-1/2 -translate-y-1/2 text-[14px] font-medium uppercase tracking-[0.32em] text-white md:left-8">WANG JUN</button>
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:flex">
          {filters.map((item) => <button key={item} type="button" onClick={() => onNavClick(item)} className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/62 transition hover:text-white">{item}</button>)}
        </nav>
        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-4 md:right-8">
          <div className="group relative"><button type="button" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2 text-[14px] font-medium text-white transition hover:bg-white/[0.08]">联系方式</button>{showQrHostLabel && <div className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-50 rounded-md border border-amber-300/70 bg-amber-950/90 px-3 py-1.5 text-[12px] font-semibold text-amber-100 shadow-xl backdrop-blur-md">图床链接 / contactQrImage</div>}<div className="pointer-events-none absolute right-0 top-[calc(100%+14px)] z-50 w-[220px] translate-y-2 opacity-0 shadow-2xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><img src={contactQrImage} alt="联系方式二维码" className="w-full rounded-[18px] border border-white/10" /></div></div>
        </div>
      </div>
    </header>
  );
}

function DetailPage({ detailProject, onBack, onNavClick, onAuditItemSelect }: { detailProject?: WorkItem; onBack: () => void; onNavClick: (filter: string) => void; onAuditItemSelect: (item: ImageHostAuditItem) => void }) {
  const [width, setWidth] = useState<number | null>(null);
  const detailMedia = detailProject?.detailMedia ?? [];
  const detailMediaKey = detailMedia.join('|');
  useEffect(() => {
    setWidth(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [detailProject?.slug, detailMediaKey]);
  const showHostLabel = isEditModeEnabled() && detailMedia.some((media) => isImageHost(media));
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <TopNav isScrolled={true} onNavClick={onNavClick} />
      {isEditModeEnabled() && <ImageHostAuditPanel onItemSelect={onAuditItemSelect} />}
      <main className="pt-20">
        <section className="px-6 py-8 md:px-10">
          <div className="mx-auto mb-6 flex max-w-[1200px] items-start justify-between gap-4 border-b border-white/8 pb-5">
            <div><p className="text-[10px] uppercase tracking-[0.32em] text-white/34">Detail Project</p><h2 className="mt-2 text-3xl font-semibold text-white md:text-[42px]">{detailProject?.title ?? '详情设计项目'}</h2>{showHostLabel && <div className="mt-3 inline-flex rounded-md border border-amber-300/70 bg-amber-950/80 px-3 py-1.5 text-[12px] font-semibold text-amber-100 shadow-xl backdrop-blur-md">二级页图床链接 / {detailProject?.slug}</div>}</div>
            <button type="button" onClick={onBack} className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[13px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition hover:bg-white/[0.08]">返回作品集</button>
          </div>
          <div className="mx-auto w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.28)]" style={{ maxWidth: width ? `${width}px` : '1200px' }}>
            {detailMedia.length ? detailMedia.map((media, index) => (
              <div key={media} className="bg-transparent leading-none">
                {isVideo(media) ? <video src={media} className="block h-auto w-full" autoPlay muted loop playsInline controls preload="metadata" onLoadedMetadata={(e) => {
                  const videoWidth = e.currentTarget.videoWidth;
                  setWidth((current) => current ?? videoWidth);
                }} /> : <img src={media} alt={`${detailProject?.title ?? '详情设计项目'} ${index + 1}`} className="block h-auto w-full" onLoad={(e) => {
                  const naturalWidth = e.currentTarget.naturalWidth;
                  setWidth((current) => current ?? naturalWidth);
                }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
              </div>
            )) : <div className="flex min-h-[900px] items-center justify-center bg-neutral-900 text-white/45">详情长图占位区域</div>}
          </div>
        </section>
      </main>
      <button type="button" onClick={onBack} className="fixed bottom-6 right-6 z-[80] rounded-full border border-white/12 bg-[rgba(14,14,16,0.78)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl transition hover:bg-[rgba(26,26,28,0.9)] md:bottom-8 md:right-8">返回作品集 ↩</button>
    </div>
  );
}

function EditModeGuide() {
  return (
    <aside className="fixed bottom-6 right-6 z-[95] hidden w-[320px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[18px] border border-sky-300/30 bg-slate-950/88 text-white shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:block">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-sky-100">定位模式</p>
        <p className="mt-1 text-[12px] leading-5 text-white/55">每张卡片都会显示当前编号和稳定 slug。后面你直接发“编号”或“slug”给我就行。</p>
      </div>
      <div className="space-y-2 px-4 py-3 text-[12px] leading-5 text-white/72">
        <p>示例：清空 `25`</p>
        <p>示例：替换 `main-image-square-03`</p>
      </div>
    </aside>
  );
}

export default function EcommerceDesignerPortfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [view, setView] = useState<ViewMode>('home');
  const [detailSlug, setDetailSlug] = useState('detail-design-01');
  const [returnToWorks, setReturnToWorks] = useState(false);
  const [aspectMap, setAspectMap] = useState<Record<string, Aspect>>({});
  const [videoAspectMap, setVideoAspectMap] = useState<Record<string, number>>({});
  const worksRef = useRef<HTMLElement | null>(null);
  const detailProject = works.find((work) => work.slug === detailSlug);
  const isEditMode = isEditModeEnabled();

  const filteredWorks = useMemo(() => {
    const getSortAspect = (work: WorkItem) => {
      return work.aspect ?? aspectMap[work.slug] ?? defaultAspectForTag(work);
    };

    const aspectOrder: Record<string, number> = {
      '9:16': 0,
      '9:19': 1,
      '3:4': 2,
      '1:1': 3,
      '7:3.5': 4,
      '9:11': 5,
      '9:4.8': 6,
      default: 99,
    };
    const liveAspectOrder: Record<string, number> = {
      '9:16': 0,
      '1:1': 1,
      '9:19': 2,
      '7:3.5': 3,
      default: 99,
    };

    const list = works.filter((work) => !hiddenWorks.has(work.slug) && (work.cover || work.detailMedia?.length || work.tag === '新质生产力' || isPlaceholderWork(work)) && (activeFilter === '全部' || work.tag === activeFilter));

    return list.map((work, index) => ({ work, index })).sort((a, b) => {
      if (activeFilter === '全部') {
        const category = (categoryOrder[a.work.tag] ?? 999) - (categoryOrder[b.work.tag] ?? 999);
        if (category) return category;
      }

      const openDelta = Number(canOpen(b.work)) - Number(canOpen(a.work));
      if (openDelta) return openDelta;

      const aAspect = getSortAspect(a.work);
      const bAspect = getSortAspect(b.work);
      const currentAspectOrder = a.work.tag === '直播&其他' && b.work.tag === '直播&其他' ? liveAspectOrder : aspectOrder;
      const aspectDelta = (currentAspectOrder[aAspect] ?? 99) - (currentAspectOrder[bAspect] ?? 99);
      if (aspectDelta) return aspectDelta;

      if (a.work.tag === '主图展示' && b.work.tag === '主图展示') {
        const coverDelta = Number(Boolean(b.work.cover)) - Number(Boolean(a.work.cover));
        if (coverDelta) return coverDelta;
      }

      if (a.work.tag === '3D渲染' && b.work.tag === '3D渲染') {
        const aBottom = renderBottomOrder[a.work.slug] ?? -1;
        const bBottom = renderBottomOrder[b.work.slug] ?? -1;
        const bottomDelta = Number(aBottom !== -1) - Number(bBottom !== -1);
        if (bottomDelta) return bottomDelta;
        if (aBottom !== -1 && bBottom !== -1) return aBottom - bBottom;
      }

      if (a.work.tag === '主图展示' && b.work.tag === '主图展示') {
        const featured = (featuredMain[a.work.slug] ?? 999) - (featuredMain[b.work.slug] ?? 999);
        if (featured) return featured;
      }

      return a.index - b.index;
    }).map(({ work }) => work);
  }, [activeFilter, aspectMap]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { if (view === 'detail') window.scrollTo({ top: 0, behavior: 'auto' }); }, [view]);
  useEffect(() => { if (view === 'home' && returnToWorks && worksRef.current) { worksRef.current.scrollIntoView({ behavior: 'auto', block: 'start' }); setReturnToWorks(false); } }, [view, returnToWorks]);

  const handleFilter = (filter: string) => { setActiveFilter(filter); requestAnimationFrame(() => worksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  const handleDetailFilter = (filter: string) => {
    setActiveFilter(filter);
    setReturnToWorks(true);
    setView('home');
  };
  const openDetail = (slug: string) => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setDetailSlug(slug);
    setView('detail');
  };
  const scrollToWorkCard = (slug: string) => {
    window.setTimeout(() => {
      document.querySelector(`[data-work-slug="${slug}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };
  const handleAuditItemSelect = (item: ImageHostAuditItem) => {
    if (item.hidden) return;
    if (item.field === 'heroSlides' || item.field === 'contactQrImage') {
      setView('home');
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      return;
    }
    if (!item.slug) return;
    if (item.field === 'detailMedia') {
      setDetailSlug(item.slug);
      setView('detail');
      return;
    }
    const work = works.find((candidate) => candidate.slug === item.slug);
    if (!work) return;
    setView('home');
    setActiveFilter(work.tag);
    scrollToWorkCard(item.slug);
  };
  const aspectClass = (work: WorkItem) => {
    const aspect = work.aspect ?? aspectMap[work.slug] ?? defaultAspectForTag(work);
    if (aspect === '1:1') return 'aspect-square';
    if (aspect === '3:4') return 'aspect-[3/4]';
    if (aspect === '9:16') return 'aspect-[9/16]';
    if (aspect === '9:19') return 'aspect-[9/19]';
    if (aspect === '7:3.5') return 'aspect-[2/1]';
    if (aspect === '9:11') return 'aspect-[9/11]';
    if (aspect === '9:4.8') return 'aspect-[9/4.8]';
    return 'aspect-[4/5]';
  };
  const workImage = (work: WorkItem) => {
    const fallback = <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f1f1f,rgba(255,70,70,0.35),#0a0a0a)]" />;
    if (!work.cover) return fallback;
    if (isVideo(work.cover)) {
      return <>{fallback}<video src={work.cover} className="absolute inset-0 h-full w-full object-contain object-top opacity-0 transition-opacity duration-500" autoPlay muted loop playsInline preload="metadata" onLoadedMetadata={(e) => {
        const video = e.currentTarget;
        if (video.videoWidth && video.videoHeight) {
          const ratio = video.videoWidth / video.videoHeight;
          setVideoAspectMap((prev) => prev[work.slug] === ratio ? prev : { ...prev, [work.slug]: ratio });
          if (!work.aspect) {
            const detected = detectAspectForWork(work, ratio);
            setAspectMap((prev) => prev[work.slug] === detected ? prev : { ...prev, [work.slug]: detected });
          }
        }
      }} onLoadedData={(e) => { e.currentTarget.style.opacity = '1'; }} /></>;
    }
    return <>{fallback}<img src={work.cover} alt={work.title} className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 object-contain opacity-0 transition-opacity duration-500" onLoad={(e) => {
      const img = e.currentTarget; img.style.opacity = '1';
      if (!work.aspect) {
        const ratio = img.naturalWidth / img.naturalHeight;
        const detected = detectAspectForWork(work, ratio);
        setAspectMap((prev) => prev[work.slug] === detected ? prev : { ...prev, [work.slug]: detected });
      }
    }} /></>;
  };

  const layoutKey = (work: WorkItem) => {
    const aspect = work.aspect ?? aspectMap[work.slug] ?? defaultAspectForTag(work);
    return `${work.tag}-${aspect}`;
  };

  const groupedWorks = filteredWorks.reduce<Array<{ key: string; items: WorkItem[]; startIndex: number }>>((groups, work, index) => {
    const key = layoutKey(work);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(work);
    } else {
      groups.push({ key, items: [work], startIndex: index });
    }
    return groups;
  }, []);

  const groupGridClass = (key: string) => {
    if (key === '3D渲染-9:4.8') return 'md:grid-cols-1 xl:grid-cols-2';
    if (key === '直播&其他-7:3.5') return 'md:grid-cols-1 xl:grid-cols-2';
    return 'md:grid-cols-2 xl:grid-cols-3';
  };
  const mediaAspectStyle = (work: WorkItem) => !work.aspect && !aspectMap[work.slug] && videoAspectMap[work.slug] ? { aspectRatio: videoAspectMap[work.slug] } : undefined;

  if (view === 'detail') return <DetailPage detailProject={detailProject} onBack={() => { setReturnToWorks(true); setView('home'); }} onNavClick={handleDetailFilter} onAuditItemSelect={handleAuditItemSelect} />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <TopNav isScrolled={isScrolled} onNavClick={handleFilter} />
      {isEditMode && <ImageHostAuditPanel onItemSelect={handleAuditItemSelect} />}
      {isEditMode && <EditModeGuide />}
      <main>
        <section className="relative aspect-video min-h-[720px] overflow-hidden border-b border-white/8 bg-[#080808]">
          {isVideo(heroSlides[currentSlide]) ? (
            <video
              key={heroSlides[currentSlide]}
              src={heroSlides[currentSlide]}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <img src={heroSlides[currentSlide]} alt="首屏海报" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {heroSlides.length > 1 && (
            <>
              <button type="button" aria-label="上一张轮播" onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-8 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[rgba(10,10,12,0.36)] text-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:bg-white/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg></button>
              <button type="button" aria-label="下一张轮播" onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)} className="absolute right-8 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[rgba(10,10,12,0.36)] text-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:bg-white/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 18l6-6-6-6" /></svg></button>
              <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">{heroSlides.map((slide, i) => <button key={`${slide}-${i}`} type="button" aria-label={`切换到第 ${i + 1} 页`} onClick={() => setCurrentSlide(i)} className={`rounded-full transition ${currentSlide === i ? 'h-2.5 w-10 bg-white' : 'h-2.5 w-2.5 bg-white/40'}`} />)}</div>
            </>
          )}
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:px-10 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"><div className="aspect-[4/5] overflow-hidden rounded-[20px]"><img src="https://img.alicdn.com/imgextra/i1/1879869629/O1CN01Sy9MW92L08r8EKara_!!1879869629.png" alt="portrait" className="h-full w-full object-cover" /></div><p className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-white/34">About</p><h4 className="mt-3 text-[40px] font-semibold text-white">汪军</h4><div className="mt-5 flex flex-wrap gap-2 text-sm text-white/70"><span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">30岁</span><span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">江西</span><span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">6年设计经验</span></div><div className="mt-4 space-y-2 border-t border-white/8 pt-4 text-sm text-white/60"><p>电话：18607967343（微信同号）</p><p>邮箱：1623571697@qq.com</p></div></div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"><p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/34">Strength</p><p className="mt-4 text-[15px] leading-8 text-white/70">喜欢尝试前沿科技，始终认为 AIGC 是新质生产力，持续将 AI 能力融入设计流程，提升效率与商业转化表现。</p></div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"><p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/34">Tools</p><div className="flex flex-wrap gap-3">{['ChatGPT', 'Gemini', 'Photoshop', 'Cinema 4D', 'Octane'].map((tool) => <span key={tool} className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/76">{tool}</span>)}</div></div>
          </aside>
          <section><p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/34">Experience</p><h3 className="mb-8 mt-3 text-[58px] font-semibold leading-none text-white md:text-[64px]">Experience</h3>{experiences.map((item) => <div key={item.company} className="mt-4 border-b border-white/8 py-7 first:mt-0 first:pt-0"><div className="flex flex-col gap-4 md:flex-row md:justify-between"><div><h4 className="text-[28px] font-semibold text-white md:text-[30px]">{item.company}</h4><p className="mt-2 text-base text-white/52">{item.role}</p></div><div className="text-[14px] uppercase tracking-[0.14em] text-white/30">{item.time}</div></div><div className="mt-6 space-y-2 text-[15px] leading-8 text-white/70 md:text-[16px]">{item.details.map((detail) => <p key={detail} className="grid grid-cols-[14px_minmax(0,1fr)] gap-2"><span className="text-white/28">·</span><span>{detail}</span></p>)}</div></div>)}</section>
        </section>

        <section ref={worksRef} className="mx-auto max-w-7xl px-6 py-14 md:px-10">
          <div className="bg-transparent p-0">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/34">Selected Works</p>
                <div className="mt-3 flex flex-wrap items-center gap-3"><h2 className="text-4xl font-semibold text-white">作品展示</h2></div>
              </div>
              <div className="sticky top-[84px] z-30 bg-[rgba(13,13,14,0.92)] py-1 backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-1.5 rounded-[14px] bg-[#111112] p-1 text-sm">
                {filters.map((filter) => <button key={filter} type="button" onClick={() => handleFilter(filter)} className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${activeFilter === filter ? 'border-white bg-white text-black' : 'border-white/8 bg-transparent text-white/60 hover:border-white/14 hover:bg-white/[0.03] hover:text-white'}`}>{filter}</button>)}
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-5">
            {groupedWorks.map((group) => (
              <div key={`${group.key}-${group.startIndex}`} className={`grid items-start gap-5 ${groupGridClass(group.key)}`}>
                {group.items.map((work, groupIndex) => {
                  const index = group.startIndex + groupIndex;
                  const displayNumber = String(index + 1).padStart(2, '0');
                  const openable = canOpen(work);
                  const mediaSrc = work.cover ?? work.detailMedia?.[0] ?? '';
                  const hostLabel = isImageHost(work.cover);
                  return <div key={work.slug} data-display-number={displayNumber} data-work-slug={work.slug} data-media-src={mediaSrc} data-image-host={hostLabel ? 'true' : undefined} role={openable ? 'button' : undefined} tabIndex={openable ? 0 : -1} onClick={() => { if (openable) openDetail(work.slug); }} onKeyDown={(e) => { if (openable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDetail(work.slug); } }} className={`group h-fit overflow-hidden rounded-[16px] border bg-[#111112] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.14)] ${openable ? 'cursor-pointer border-white/10 hover:border-white/14' : 'border-white/8'}`}><div className={`relative ${aspectClass(work)} overflow-hidden bg-[#141415]`} style={mediaAspectStyle(work)}>{workImage(work)}<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,0.01)_14%,rgba(6,6,7,0.03)_44%,rgba(6,6,7,0.18)_100%)]" /><div className="absolute left-3.5 top-3.5 rounded-full border border-white/8 bg-[rgba(6,6,7,0.18)] px-2.5 py-1 text-[10px] font-medium text-white/58 backdrop-blur-md">{work.tag}</div>{isEditMode && <div className="pointer-events-none absolute left-4 top-[52px] z-30 max-w-[calc(100%-32px)] rounded-md border border-sky-300/60 bg-slate-950/82 px-3 py-1.5 text-[12px] font-semibold text-sky-100 shadow-xl backdrop-blur-md"><div>{displayNumber} · {work.slug}</div><div className="mt-0.5 text-[11px] font-medium text-white/62">{work.cover ? '有图' : '空白'} · {work.aspect ?? defaultAspectForTag(work)}</div></div>}{isEditMode && hostLabel && <div className="pointer-events-none absolute left-4 top-[108px] z-30 rounded-md border border-amber-300/70 bg-amber-950/80 px-3 py-1.5 text-[12px] font-semibold text-amber-100 shadow-xl backdrop-blur-md"><div>图床链接</div><div className="mt-0.5 text-[11px]">{work.slug}</div></div>}{openable && (
                    <>
                      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(6,6,7,0.01)_0%,rgba(6,6,7,0.04)_46%,rgba(6,6,7,0.24)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute bottom-3.5 left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-full border border-white/10 bg-[rgba(9,9,10,0.38)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white/78 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        查看项目
                      </div>
                    </>
                  )}</div></div>;
                })}
              </div>
            ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
