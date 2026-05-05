import { useEffect, useMemo, useRef, useState } from 'react';

type ViewMode = 'home' | 'detail';
type Aspect = '3:4' | '1:1' | '9:16' | '7:3.5' | '9:11' | '9:4.8';
type WorkItem = { title: string; slug: string; tag: string; type: string; desc: string; image?: string; detailImage?: string };

type Exp = { company: string; time: string; role: string; details: string[] };

const filters = ['全部', '新质生产力', 'KV海报', '详情设计', '直播&其他', '主图展示', '3D渲染'];
const categoryOrder: Record<string, number> = { 新质生产力: 0, KV海报: 1, 详情设计: 2, '直播&其他': 3, 主图展示: 4, '3D渲染': 5 };
const featuredMain: Record<string, number> = { 'main-image-17': 0, 'main-image-06': 1, 'main-image-12': 2 };
const featuredRender: Record<string, number> = {};
const renderBottomOrder: Record<string, number> = { 'render-04': 0, 'render-05': 1, 'render-06': 2 };
const heroSlides = ['https://i.111666.best/image/xJrWOU5rinHu3ceSCN1BHM.jpeg'];

const makeWorks = (tag: string, type: string, prefix: string, links: string[]): WorkItem[] => links.map((image, i) => ({
  title: `${prefix} ${String(i + 1).padStart(2, '0')}`,
  slug: `${prefix === '主图展示' ? 'main-image' : prefix === '直播视觉' ? 'live' : prefix === '3D渲染' ? 'render' : 'kv'}-${String(i + 1).padStart(2, '0')}`,
  tag,
  type,
  desc: `${tag}视觉展示项目。`,
  image,
}));

const kvWorks: WorkItem[] = makeWorks('KV海报', 'Campaign Visual', 'KV视觉', [
  'https://i.111666.best/image/dr2qkkZqtJZAPE4ktuqY1D.png',
  'https://i.111666.best/image/bcqAI23QfonGuZ9YkZX5zN.png',
  'https://i.111666.best/image/xivf2RCtv8jWANLcA5b6ET.png',
  'https://i.111666.best/image/vcpIFSz5B4KCFRKZ9MPaLk.jpg',
  'https://i.111666.best/image/uAFLwNmeSdim0K2ob1UjoF.jpg',
  'https://i.111666.best/image/F5fbiUw66xLxSTK10Wxbu7.gif',
  'https://i.111666.best/image/ZwRpG9DeMuNP5PxgO8jo61.png',
  'https://i.111666.best/image/o0BahaV9wKSJITBTMWGZjj.png',
  'https://i.111666.best/image/LTkiLhuU0N56NPIT2P0POm.png',
  'https://i.111666.best/image/And9vlOUucYRFw0CCDUeO6.jpg',
]);

const detailWorks: WorkItem[] = [
  { title: '儿童医学中心项目', slug: 'kv-case-01', tag: 'KV海报', type: 'Trust Visual', desc: '专业背书与科技感视觉项目。', image: 'https://i.111666.best/image/L4eoTnEsOZsrILQJdt6aVW.png', detailImage: 'https://i.111666.best/image/LO8SHeHlXC1QPuYjmLN1Fr.jpg' },
  { title: '营养补剂详情页设计', slug: 'detail-design-01', tag: '详情设计', type: 'Detail Page', desc: '详情页长图展示项目。', image: 'https://i.111666.best/image/wgPhMS1Bx043FCsGmN1CLJ.png', detailImage: 'https://i.111666.best/image/7ocUTgFpixpTZkGrslOzLE.jpeg' },
  { title: '母婴营养液详情页设计', slug: 'detail-design-02', tag: '详情设计', type: 'Detail Page', desc: '母婴营养品详情页设计。', image: 'https://i.111666.best/image/U3Gi2eAX07ghiJg7eVkrpo.png', detailImage: 'https://i.111666.best/image/PCIxpSHm7vopP8p9tq1Zxu.jpeg' },
  { title: '详情页设计 03', slug: 'detail-design-03', tag: '详情设计', type: 'Detail Page', desc: '详情页新增项目。', image: 'https://i.111666.best/image/LdPOuZiSVX7yZZeYbbnRQ4.png', detailImage: 'https://i.111666.best/image/Mh2lqbVDMzLCr7qcfjBuUh.jpeg' },
];

const liveWorks = makeWorks('直播&其他', 'Live Visual', '直播视觉', [
  'https://i.111666.best/image/2hUVGRQDPhzHR2vwq0scra.png', 'https://i.111666.best/image/Bv0yoSushodDzNjzFTj40R.png',
  'https://i.111666.best/image/yOzofC2wNTbHn4C76FDVqL.png', 'https://i.111666.best/image/yrCgTimHNH25hwfRaFN5Zh.png',
  'https://i.111666.best/image/MM9xxIl3HSXYb2njhONizb.jpg', 'https://i.111666.best/image/sg721p5V7E3cxiPYOoROoE.png',
  'https://i.111666.best/image/SiDQUnr4lnDyFSzehziA4t.png', 'https://i.111666.best/image/uf6RKLJ8TGAD6DI4UXCVRw.png',
  'https://i.111666.best/image/E5rP1fgul3zCVngtoa57HE.png', 'https://i.111666.best/image/WgsJ8FodjTXTeLVIf0fmtZ.png',
  'https://i.111666.best/image/YzgJJXYOt1Z7Zn6KadHCOe.png', 'https://i.111666.best/image/tmoUTdGrBLlQWPV51HB0WF.png',
  'https://i.111666.best/image/GoBvcFaC1KVyPKFTibNRSI.png', 'https://i.111666.best/image/6ENnbgj8J3YQfg7LB8waPe.jpg',
  'https://i.111666.best/image/YOCFcT9Yq8WL6oRdaNr9ud.png', 'https://i.111666.best/image/1sPOLmbsmyi17qvpFlPVBX.png',
  'https://i.111666.best/image/I8aqCb0887e9elj1nOEonx.png', 'https://i.111666.best/image/TaREmxrQcQEMUQobbVPsPZ.png',
  'https://i.111666.best/image/xZW18k8UF0wFf7LUPhG6uQ.png', 'https://i.111666.best/image/2kX8MtVJmLKxurmEV1dM11.png',
  'https://i.111666.best/image/whI52ho6bLWPM0Gcgcn7u5.jpg', 'https://i.111666.best/image/IsR76OG1eSXSgglGmaRFtO.png',
  'https://i.111666.best/image/uYD0BQEq0tnK2tej1X8vfU.jpg',
  'https://i.111666.best/image/mC2wRHngp3S0gk1Wl85m8p.jpg',
  'https://i.111666.best/image/gtezIpDX7AaAoxfY1fZyPh.jpg',
  'https://i.111666.best/image/q1ayr630yHoO7q3MXx2yrb.jpg',
]).map((w, i) => ({ ...w, type: i >= 7 && i <= 10 ? 'Live Cover' : 'Live Visual' }));

const mainWorks = makeWorks('主图展示', 'Main Image', '主图展示', [
  'https://i.111666.best/image/Lo70P8qGMn4ZewQ2VQoevO.png', 'https://i.111666.best/image/EwvkbGSk1E44dWAtd5c6lV.png',
  'https://i.111666.best/image/VqhJSlUN75HQknf4nA1u7r.png', 'https://i.111666.best/image/uaEBVtPfSkHUJhiF0uEmk9.jpg',
  'https://i.111666.best/image/4wWa7krkYttYozeouZR2e6.jpg', 'https://i.111666.best/image/qOzTnVzpFhFkD8v5jl52Pw.jpg',
  'https://i.111666.best/image/WAJHHLoS4HCpEKswCVBscw.jpg', 'https://i.111666.best/image/WjjfYgE9Mv2LGJtY6Bv0v5.png',
  'https://i.111666.best/image/LUifZAhLUinKP4g1qWQ0hv.png', 'https://i.111666.best/image/SUOAFNoMctA5Ry1Ybecy1m.png',
  'https://i.111666.best/image/5Av81yx00UuMwOXp3D37ZJ.png', 'https://i.111666.best/image/EvgB7DN0bEVpbcuRhMmYld.png',
  'https://i.111666.best/image/yRCYd0dHLOXV6x1wD9g9nx.jpg', 'https://i.111666.best/image/QxOPj1Vz3MxZEf905osYgz.png',
  'https://i.111666.best/image/Im1a8a1Yqa2WOUoCXoS0pC.png', 'https://i.111666.best/image/GeEJRk5XCP4PfmxEtBo0oq.png',
  'https://i.111666.best/image/fQXMUjoO4BteqCTXtvERl0.png', 'https://i.111666.best/image/iDYKtiALx5oPeLqWsfFlhu.jpg',
  'https://i.111666.best/image/izjEJCjTOuqNACG4AGwwoy.png',
]);

const works: WorkItem[] = [
  ...detailWorks,
  ...kvWorks,
  { title: 'AIGC产品广告概念图', slug: 'aigc-01', tag: '新质生产力', type: 'AI Creative', desc: 'AI创意视觉项目。' },
  { title: 'AI产品场景合成', slug: 'aigc-02', tag: '新质生产力', type: 'Scene Generation', desc: 'AI场景合成视觉项目。' },
  ...liveWorks,
  ...makeWorks('3D渲染', '3D Render', '3D渲染', [
    'https://i.111666.best/image/gq2zS7THXnjifnW8H9ohga.jpeg',
    'https://i.111666.best/image/cAXrwJ5C5fR4jqTcKOReH9.jpeg',
    'https://i.111666.best/image/XR3sT81Mt7AVXFsB4svjap.jpeg',
    'https://i.111666.best/image/PDGsyymrqwc2Ca7sBkk90v.jpeg',
    'https://i.111666.best/image/S9ml6g3HdkArxpNGGDYtoq.jpeg',
    'https://i.111666.best/image/aHG2wtoiFpBp7kPtA260Mu.jpeg',    'https://i.111666.best/image/sOpeNNKWpWqhz9KnGIQ5SD.png',
    'https://i.111666.best/image/MnoH7RO5knEvM1IIlQHl3Y.png',
    'https://i.111666.best/image/9LAwbpmA1pRi5W77fBXSoA.png',
    'https://i.111666.best/image/Oe1voqOwQf95dfsu3M2BbA.png',
    'https://i.111666.best/image/Z2WGLqxCcroAy5rx738Hib.png',
    'https://i.111666.best/image/GaCUUMve5STeCtERtdurhs.png',
    'https://i.111666.best/image/fOBbXYjTdyRZ1f0hBC6FhX.png',
    'https://i.111666.best/image/06xm4FuQvA6tM7DsIXFw6u.png',
    'https://i.111666.best/image/gdaQygMrtaN8TARPAMuge2.jpg',
    'https://i.111666.best/image/haAsAqc1beleIY55HHsH2s.jpg',
    'https://i.111666.best/image/1kYM24aWap2juLngii93CO.jpg',
    'https://i.111666.best/image/Q68SblEYAqTbMFHh05WnCs.jpg',
  ]),
  ...mainWorks,
];

const experiences: Exp[] = [
  { company: '上海巴九零网络科技有限公司', time: '2025.08 - 2026.06', role: '电商设计师', details: ['负责公司 brand IP 及周边电商产品的视觉系统搭建。', '负责大型营销活动的线上专题页、详情页及直播间视觉氛围设计。'] },
  { company: '上海哈晟智能科技有限公司', time: '2024.10 - 2025.05', role: '电商设计师', details: ['负责品牌产品站（抖音、京东、私域）相关设计，包含页面设计、产品渲染、抖音直播图等。负责全店新版主图优化', '负责公司各平台的风格统一，把握产品卖点，搭配不同场景风格进行场景渲染，提升产品的视觉表现力', '与运营团队合作，确保设计内容符合市场需求和用户喜好，提升转化率'] },
  { company: '上海纯米科技股份有限公司', time: '2022.03 - 2023.12', role: '电商设计师', details: ['负责品牌产品站（天猫、京东、官网、有品）相关设计，包含页面设计、产品渲染、产品包装设计等', '负责市场营销活动视觉设计，建立纯米科技品牌规范，根据公司的发展不断完善、优化品牌规范'] },
  { company: '上海恒辉品牌管理有限公司', time: '2020.06 - 2022.01', role: '电商设计师', details: ['主要负责品牌项目的设计工作，包括主页面视觉设计，二级页面，推广图钻展直通车详情页的设计工作', '协调安排设计成员与助理的工作输出，引导视觉方向，保持项目视觉风格的一致性'] },
];

const canOpen = (work: WorkItem) => work.tag === '详情设计' || Boolean(work.detailImage);

function TopNav({ isScrolled, onNavClick }: { isScrolled: boolean; onNavClick: (filter: string) => void }) {
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${isScrolled ? 'border-b border-white/10 bg-black/35 backdrop-blur-2xl' : 'bg-transparent'}`}>
      <div className="relative h-[56px] w-full px-6">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute left-[50px] top-1/2 -translate-y-1/2 text-[26px] font-semibold text-white">WANG JUN</button>
        <nav className="absolute left-[315px] top-1/2 hidden -translate-y-1/2 items-center gap-7 lg:flex">
          {filters.map((item) => <button key={item} type="button" onClick={() => onNavClick(item)} className="text-[16px] font-semibold text-white/85 hover:text-white">{item}</button>)}
        </nav>
        <div className="absolute right-[50px] top-1/2 flex -translate-y-1/2 items-center gap-4">
          <button aria-label="搜索" type="button" className="text-white/80"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></button>
          <div className="group relative"><button type="button" className="rounded-full bg-white/10 px-5 py-2 text-[15px] font-semibold text-white">联系方式</button><div className="pointer-events-none absolute right-0 top-[calc(100%+14px)] z-50 w-[220px] opacity-0 shadow-2xl transition group-hover:opacity-100"><img src="https://i.111666.best/image/mCX5aD5cQIWsbADdyQFDwK.jpg" alt="联系方式二维码" className="w-full rounded-xl" /></div></div>
        </div>
      </div>
    </header>
  );
}

function DetailPage({ detailProject, onBack }: { detailProject?: WorkItem; onBack: () => void }) {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => setWidth(null), [detailProject?.detailImage]);
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TopNav isScrolled={true} onNavClick={() => {}} />
      <main className="pt-20">
        <section className="px-6 py-10 md:px-10">
          <div className="mx-auto mb-8 flex max-w-[1200px] items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="text-sm uppercase tracking-[0.28em] text-white/35">Detail Project</p><h2 className="mt-3 text-3xl font-semibold md:text-5xl">{detailProject?.title ?? '详情设计项目'}</h2></div>
            <button type="button" onClick={onBack} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white">返回作品集</button>
          </div>
          <p className="mx-auto mb-8 max-w-[1200px] text-sm leading-7 text-white/60">这里是详情设计二级页展示区域，仅保留一张长图用于完整展示详情页设计稿。</p>
          <div className="mx-auto w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-2xl" style={{ maxWidth: width ? `${width}px` : '1200px' }}>
            {detailProject?.detailImage ? <img src={detailProject.detailImage} alt={detailProject.title} className="block h-auto w-full" onLoad={(e) => setWidth(e.currentTarget.naturalWidth)} /> : <div className="flex min-h-[900px] items-center justify-center bg-neutral-900 text-white/45">详情长图占位区域</div>}
          </div>
        </section>
      </main>
      <button type="button" onClick={onBack} className="fixed bottom-6 right-6 z-[80] rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl hover:bg-white/15 md:bottom-8 md:right-8">返回作品集 ↩</button>
    </div>
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
  const worksRef = useRef<HTMLElement | null>(null);
  const detailProject = works.find((work) => work.slug === detailSlug);

  const filteredWorks = useMemo(() => {
    const getSortAspect = (work: WorkItem) => {
      if (work.tag === '主图展示') return aspectMap[work.slug] ?? '3:4';
      if (work.tag === '直播&其他') return aspectMap[work.slug] ?? '9:16';
      if (work.tag === '3D渲染') return aspectMap[work.slug] ?? '9:11';
      if (work.tag === '详情设计') return '9:16';
      if (work.tag === 'KV海报') return aspectMap[work.slug] ?? '3:4';
      return 'default';
    };

    const aspectOrder: Record<string, number> = {
      '9:16': 0,
      '3:4': 1,
      '1:1': 2,
      '7:3.5': 3,
      '9:11': 4,
      '9:4.8': 5,
      default: 99,
    };

    const list = works.filter((work) => (work.image || work.detailImage) && (activeFilter === '全部' || work.tag === activeFilter));

    return list.map((work, index) => ({ work, index })).sort((a, b) => {
      const openDelta = Number(canOpen(b.work)) - Number(canOpen(a.work));
      if (openDelta) return openDelta;

      if (activeFilter === '全部') {
        const category = (categoryOrder[a.work.tag] ?? 999) - (categoryOrder[b.work.tag] ?? 999);
        if (category) return category;
      }


      const aAspect = getSortAspect(a.work);
      const bAspect = getSortAspect(b.work);
      const aspectDelta = (aspectOrder[aAspect] ?? 99) - (aspectOrder[bAspect] ?? 99);
      if (aspectDelta) return aspectDelta;

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
  const aspectClass = (work: WorkItem) => {
    if (work.tag === '主图展示') {
      if (aspectMap[work.slug] === '1:1') return 'aspect-square';
      return 'aspect-[3/4]';
    }
    if (work.tag === '直播&其他') {
      if (aspectMap[work.slug] === '7:3.5') return 'aspect-[2/1]';
      if (aspectMap[work.slug] === '1:1') return 'aspect-square';
      return 'aspect-[9/16]';
    }
    if (work.tag === '详情设计') return 'aspect-[9/16]';
    if (work.tag === 'KV海报') {
      if (aspectMap[work.slug] === '9:16') return 'aspect-[9/16]';
      return 'aspect-[3/4]';
    }
    if (work.tag === '3D渲染') {
      if (aspectMap[work.slug] === '9:4.8') return 'aspect-[9/4.8]';
      if (aspectMap[work.slug] === '3:4') return 'aspect-[3/4]';
      return 'aspect-[9/11]';
    }
    return 'aspect-[4/5]';
  };
  const workImage = (work: WorkItem) => {
    const fallback = <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f1f1f,rgba(255,70,70,0.35),#0a0a0a)]" />;
    if (!work.image) return fallback;
    return <>{fallback}<img src={work.image} alt={work.title} className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 object-contain opacity-0 transition-opacity duration-500" onLoad={(e) => {
      const img = e.currentTarget; img.style.opacity = '1';
      if (work.tag === '主图展示' || work.tag === '直播&其他' || work.tag === '3D渲染' || work.tag === 'KV海报') {
        const ratio = img.naturalWidth / img.naturalHeight;
        const candidates = work.tag === '主图展示'
          ? ([{ key: '3:4', ratio: 3 / 4 }, { key: '1:1', ratio: 1 }] as Array<{ key: Aspect; ratio: number }>)
          : work.tag === '3D渲染'
            ? ([{ key: '9:11', ratio: 9 / 11 }, { key: '3:4', ratio: 3 / 4 }, { key: '9:4.8', ratio: 9 / 4.8 }] as Array<{ key: Aspect; ratio: number }>)
            : work.tag === 'KV海报'
              ? ([{ key: '9:16', ratio: 9 / 16 }, { key: '3:4', ratio: 3 / 4 }] as Array<{ key: Aspect; ratio: number }>)
              : ([{ key: '9:16', ratio: 9 / 16 }, { key: '1:1', ratio: 1 }, { key: '7:3.5', ratio: 7 / 3.5 }] as Array<{ key: Aspect; ratio: number }>);
        const detected = candidates.reduce((a, b) => Math.abs(ratio - b.ratio) < Math.abs(ratio - a.ratio) ? b : a).key;
        setAspectMap((prev) => prev[work.slug] === detected ? prev : { ...prev, [work.slug]: detected });
      }
    }} /></>;
  };

  const layoutKey = (work: WorkItem) => {
    if (work.tag === '主图展示') return `主图展示-${aspectMap[work.slug] ?? '3:4'}`;
    if (work.tag === '直播&其他') return `直播&其他-${aspectMap[work.slug] ?? '9:16'}`;
    if (work.tag === '3D渲染') return `3D渲染-${aspectMap[work.slug] ?? '9:11'}`;
    if (work.tag === '详情设计') return '通用-9:16';
    if (work.tag === 'KV海报') {
      const kvAspect = aspectMap[work.slug] ?? '3:4';
      return kvAspect === '9:16' ? '通用-9:16' : `KV海报-${kvAspect}`;
    }
    return `${work.tag}-default`;
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

  if (view === 'detail') return <DetailPage detailProject={detailProject} onBack={() => { setReturnToWorks(true); setView('home'); }} />;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TopNav isScrolled={isScrolled} onNavClick={handleFilter} />
      <main>
        <section className="relative aspect-video min-h-[720px] overflow-hidden border-b border-white/10 bg-neutral-950">
          <img src={heroSlides[currentSlide]} alt="首屏海报" className="absolute inset-0 h-full w-full object-cover" />
          {heroSlides.length > 1 && (
            <>
              <button type="button" aria-label="上一张轮播" onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-8 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/28 text-white/85 backdrop-blur-xl hover:bg-white/16"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg></button>
              <button type="button" aria-label="下一张轮播" onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)} className="absolute right-8 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/28 text-white/85 backdrop-blur-xl hover:bg-white/16"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 18l6-6-6-6" /></svg></button>
              <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">{heroSlides.map((slide, i) => <button key={`${slide}-${i}`} type="button" aria-label={`切换到第 ${i + 1} 页`} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition ${currentSlide === i ? 'w-10 bg-white' : 'w-2.5 bg-white/45'}`} />)}</div>
            </>
          )}
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:px-10 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl"><div className="aspect-[4/5] overflow-hidden rounded-[26px]"><img src="https://duk.tw/vNC4qH.png" alt="portrait" className="h-full w-full object-cover" /></div><h4 className="mt-6 text-[42px] font-semibold">汪军</h4><div className="mt-5 flex flex-wrap gap-2 text-sm text-white/72"><span className="rounded-full border border-white/10 px-3 py-1">30岁</span><span className="rounded-full border border-white/10 px-3 py-1">江西</span><span className="rounded-full border border-white/10 px-3 py-1">6年设计经验</span></div><div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-sm text-white/62"><p>电话：18607967343（微信同号）</p><p>邮箱：1623571697@qq.com</p></div></div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"><p className="text-base font-semibold">个人优势</p><p className="mt-4 text-[15px] leading-8 text-white/72">喜欢尝试前沿科技，始终认为 AIGC 是新质生产力，持续将 AI 能力融入设计流程，提升效率与商业转化表现。</p></div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"><p className="mb-4 text-base font-semibold">擅长工具</p><div className="flex flex-wrap gap-3">{['ChatGPT', 'Gemini', 'Photoshop', 'Cinema 4D', 'Octane'].map((tool) => <span key={tool} className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/82">{tool}</span>)}</div></div>
          </aside>
          <section><h3 className="mb-8 text-[58px] font-semibold leading-none md:text-[64px]">Experience</h3>{experiences.map((item) => <div key={item.company} className="border-b border-white/10 py-8 first:pt-0"><div className="flex flex-col gap-4 md:flex-row md:justify-between"><div><h4 className="text-[28px] font-semibold md:text-[30px]">{item.company}</h4><p className="mt-2 text-base text-white/42">{item.role}</p></div><div className="text-[18px] text-white/48">{item.time}</div></div><div className="mt-6 space-y-1 text-[15px] leading-8 text-white/72 md:text-[16px]">{item.details.map((detail) => <p key={detail}>· {detail}</p>)}</div></div>)}</section>
        </section>

        <section ref={worksRef} className="mx-auto max-w-7xl px-6 py-14 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm uppercase tracking-[0.28em] text-white/40">Selected Works</p><h2 className="mt-3 text-4xl font-semibold">作品展示</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">包含新质生产力、KV海报、详情设计、直播&其他、3D渲染、主图展示等多个方向。</p></div><div className="flex shrink-0 flex-nowrap items-center gap-2 whitespace-nowrap text-sm">{filters.map((filter) => <button key={filter} type="button" onClick={() => handleFilter(filter)} className={`rounded-full px-3.5 py-2 transition ${activeFilter === filter ? 'bg-white text-black' : 'border border-white/10 bg-white/[0.03] text-white/78 hover:bg-white/[0.08]'}`}>{filter}</button>)}</div></div>
          <div className="mt-8 space-y-5">
            {groupedWorks.map((group) => (
              <div key={`${group.key}-${group.startIndex}`} className={`grid items-start gap-5 ${groupGridClass(group.key)}`}>
                {group.items.map((work, groupIndex) => {
                  const index = group.startIndex + groupIndex;
                  const openable = canOpen(work);
                  return <div key={work.slug} role={openable ? 'button' : undefined} tabIndex={openable ? 0 : -1} onClick={() => { if (openable) { setDetailSlug(work.slug); setView('detail'); } }} onKeyDown={(e) => { if (openable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setDetailSlug(work.slug); setView('detail'); } }} className={`group h-fit overflow-hidden rounded-[15px] border bg-white/[0.025] transition hover:-translate-y-1 ${openable ? 'cursor-pointer border-white/24' : 'border-white/10'}`}><div className={`relative ${aspectClass(work)} overflow-hidden`}>{workImage(work)}<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /><div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur-md">{work.tag}</div>{openable && (
                    <>
                      <div className="pointer-events-none absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/18 bg-black/38 px-3.5 py-2 text-xs font-medium text-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/14 group-hover:text-white">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/35" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
                        </span>
                        完整案例 ↗
                      </div>
                      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_8%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.52)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute left-5 right-5 top-1/2 z-20 flex -translate-y-1/2 translate-y-4 items-center justify-between gap-4 rounded-[15px] border border-white/18 bg-black/52 px-5 py-4 opacity-0 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-2xl ring-1 ring-white/8 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.26em] text-white/42">Open Case</p>
                          <p className="mt-1 text-base font-semibold text-white">查看完整项目</p>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg text-black shadow-[0_10px_28px_rgba(255,255,255,0.18)]">↗</span>
                      </div>
                    </>
                  )}<div className="absolute bottom-0 left-0 right-0 p-5"><div className="flex items-end justify-between gap-4"><div><p className="text-[14px] font-medium text-white">{String(index + 1).padStart(2, '0')}</p></div><div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75 backdrop-blur-md">{work.type}</div></div></div></div></div>;
                })}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
