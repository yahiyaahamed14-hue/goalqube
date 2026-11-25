"use client";
import { useEffect, useRef } from "react";
const land = [
 [[-168,70],[-135,72],[-120,59],[-100,52],[-82,50],[-58,53],[-65,42],[-81,25],[-98,17],[-110,30],[-125,48],[-160,60]],
 [[-81,12],[-65,11],[-48,1],[-35,-7],[-45,-23],[-56,-40],[-69,-55],[-76,-35],[-80,-5]],
 [[-52,60],[-42,60],[-20,78],[-40,84],[-62,77]],
 [[-17,36],[9,38],[34,30],[44,12],[51,11],[40,-13],[31,-30],[19,-35],[10,-18],[-1,4],[-16,15]],
 [[-10,36],[-10,58],[8,71],[30,71],[45,54],[31,39],[15,35]],
 [[30,70],[65,77],[120,73],[180,65],[170,52],[144,45],[139,34],[121,22],[109,1],[99,4],[85,22],[73,8],[61,25],[46,30],[31,42]],
 [[113,-11],[135,-12],[153,-24],[146,-39],[120,-34]], [[46,-13],[51,-16],[48,-26],[44,-24]], [[130,32],[141,45],[145,40],[137,30]], [[-8,50],[-3,59],[1,52]],
];
function onLand(x: number, y: number) {
 return land.some(poly => { let inside = false; for (let i=0,j=poly.length-1;i<poly.length;j=i++) { const [xi,yi]=poly[i], [xj,yj]=poly[j]; if ((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside; } return inside; });
}
const points: number[][]=[];
for(let lat=-55;lat<=80;lat+=2.6) for(let lon=-180;lon<180;lon+=2.6/Math.cos(lat*Math.PI/180)) if(onLand(lon,lat)) points.push([lon*Math.PI/180,lat*Math.PI/180]);
export default function FootballGlobe({ small = false }: { small?: boolean }) {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const canvas=ref.current; if(!canvas) return; const ctx=canvas.getContext("2d"); if(!ctx) return;
  let frame=0, angle=.35, visible=false, size=600;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resize=()=>{ size=canvas.clientWidth; const dpr=Math.min(window.devicePixelRatio||1,2); canvas.width=size*dpr; canvas.height=size*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  const draw=()=>{
   if(!visible) return;
   const c=size/2,r=size*.405; ctx.clearRect(0,0,size,size);
   const halo=ctx.createRadialGradient(c,c,r*.8,c,c,r*1.23); halo.addColorStop(0,"transparent"); halo.addColorStop(.48,"#fa5c0b77"); halo.addColorStop(.7,"#fd7b2035"); halo.addColorStop(1,"transparent"); ctx.fillStyle=halo; ctx.fillRect(0,0,size,size);
   const sphere=ctx.createRadialGradient(c-r*.3,c-r*.6,0,c,c,r); sphere.addColorStop(0,"#34202a"); sphere.addColorStop(.7,"#140e1b"); sphere.addColorStop(.9,"#5b291c"); sphere.addColorStop(1,"#ed6c1a"); ctx.fillStyle=sphere; ctx.beginPath(); ctx.arc(c,c,r,0,Math.PI*2); ctx.fill();
   for(const [lon,lat] of points) { const x=Math.cos(lat)*Math.sin(lon+angle), z=Math.cos(lat)*Math.cos(lon+angle); if(z<=0) continue; const y=-Math.sin(lat); ctx.fillStyle=`rgba(234,213,225,${.22+z*.65})`; ctx.beginPath(); ctx.arc(c+x*r,c+y*r,r*.0042*(.5+z*.6),0,Math.PI*2); ctx.fill(); }
   if(!reduced) { angle+=.0017; frame=requestAnimationFrame(draw); }
  };
  resize();
  const observer=new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting; cancelAnimationFrame(frame); if(visible) draw(); }); observer.observe(canvas);
  const ro=new ResizeObserver(()=>{ resize(); if(reduced) draw(); }); ro.observe(canvas);
  return ()=>{ cancelAnimationFrame(frame); observer.disconnect(); ro.disconnect(); };
 },[]);
 return <canvas ref={ref} className={`gq-globe ${small ? "gq-globe-small" : ""}`} role="img" aria-label="Rotating dotted globe with a glowing orange atmosphere"/>;
}
