(() => {
  const canvas = document.getElementById('aero-network');
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: -1000, y: -1000 };
  let width, height, points = [], frame = 0, last = 0;
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({length: Math.min(100, Math.max(24, Math.floor(width * height / 17000)))}, () => ({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.2+.7}));
    if (reduced.matches) draw(0);
  }
  function line(a,b,range,alpha) {
    const d = Math.hypot(a.x-b.x,a.y-b.y);
    if (d >= range) return;
    ctx.strokeStyle = `rgba(0,200,255,${(1-d/range)*alpha})`;
    ctx.lineWidth = .65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  function draw(delta) {
    ctx.clearRect(0,0,width,height);
    points.forEach((p,i) => {
      p.x += p.vx*delta; p.y += p.vy*delta;
      if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
      for(let j=i+1;j<points.length;j++)line(p,points[j],150,.22);
      if(!reduced.matches)line(p,pointer,220,.55);
      ctx.fillStyle='rgba(0,200,255,.55)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });
  }
  function tick(time){draw(last?Math.min((time-last)/16.67,2):1);last=time;frame=requestAnimationFrame(tick)}
  function start(){cancelAnimationFrame(frame);last=0;if(!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);else draw(0)}
  addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer.x=e.clientX;pointer.y=e.clientY}},{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000});
  document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
  resize();start();
})();
