// archetypes.js — profession + pop-culture pack (FAMILY B bespoke per-char).
// Same approach as monsters.js: each character is its own function with explicit
// geometry tuned for a DISTINCT thumbnail-readable silhouette — different head-gear
// SHAPE, different body proportions, different held / worn / mounted gear that
// changes the OUTLINE, not just the colour. The previous parameterised attempt
// (character(s) with shared prop slots) made every archetype read as "civilian
// + one accessory", which failed the scroll-feed 2-second test. This file gives
// up parameter-sharing economy in exchange for the same silhouette punch the
// monster pack has — each is recognisable in 0.5s from outline alone.
//
// RIGGED for shelf-it customer walking: legs are hip-pivot groups (legL/legR),
// arms are shoulder-pivot groups (armL/armR), exposed on g.userData.rig so the
// walk loop can swing them. armBase holds a non-zero rest pose (delivery cradles
// a box at chest height, nurse cradles a clipboard) the swing layers on top of.
import * as THREE from 'three';
import { P, box, darken } from '../lib/prims.js';

const EYE = 0x241f1c, FRAME = 0x4a3526;
const SHADE = 0x14110e;                // tinted lens for wraparound sunglasses

function rig(g, legL, legR, armL, armR, armBase=0){
  g.add(legL); g.add(legR); g.add(armL); g.add(armR);
  g.userData.rig = { legL, legR, armL, armR };
  g.userData.armBase = armBase;
  if(armBase){ armL.rotation.x = armR.rotation.x = armBase; }
}
function finish(g){ g.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } }); }

// face primitive — eyes only; chars opt-in to shades / glasses separately
function eyes(g, headY, HW, HDP, eyeYOffset=0.02){
  const fz = HDP/2+0.01, eyeY = headY+eyeYOffset, eyeX = HW*0.26;
  g.add(box(0.12,0.12,0.04, EYE, -eyeX, eyeY, fz));
  g.add(box(0.12,0.12,0.04, EYE,  eyeX, eyeY, fz));
  return { fz, eyeY, eyeX };
}

// ─── COP: broad-shouldered state trooper. TALL crowned cap, gear-laden belt,
//     chest badge (the teal accent), holster on right hip, wraparound shades ──
export function cop(){
  const g = new THREE.Group();
  const BW=1.10, BD=0.54, torsoH=0.80, legH=0.92, shoeH=0.18;
  const lx=0.24, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  const navy = darken(P.blue,0.45), trousers = darken(P.blue,0.55);
  [legL,legR].forEach(L=>{
    L.add(box(0.36,shoeH,BD,         P.ironD,  0, shoeH/2-hipY,        0.05));   // polished shoes
    L.add(box(0.32,legH,BD-0.06,     trousers, 0, (shoeH+legH/2)-hipY, 0));      // uniform trousers
    L.add(box(0.34,0.06,BD-0.04,     P.cream,  0, (shoeH+legH*0.55)-hipY, 0.02));// trouser stripe
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, navy, 0, torsoY, 0));                                 // uniform shirt
  g.add(box(0.20, 0.20, 0.04, P.cream, 0, torsoY+torsoH/2-0.13, BD/2+0.02));     // collar tab
  g.add(box(0.06, torsoH-0.14, 0.04, P.cream, 0, torsoY-0.05, BD/2+0.02));       // button placket
  // THICK utility belt — silhouette gets wider at the waist
  g.add(box(BW+0.06, 0.22, BD+0.05, P.ironD, 0, torsoY-torsoH/2+0.10, 0));
  for(let i=-1;i<=1;i++)                                                          // front pouches
    g.add(box(0.14,0.16,0.06, darken(P.blue,0.7), i*0.28, torsoY-torsoH/2+0.10, BD/2+0.03));
  g.add(box(0.22,0.26,0.20, P.ironD, BW/2+0.10, torsoY-torsoH/2-0.04, 0));        // right-hip holster
  g.add(box(0.08,0.10,0.08, darken(P.ironD,0.6), BW/2+0.10, torsoY-torsoH/2-0.18, 0.02)); // grip
  // chest BADGE — single teal accent, the cop cue
  g.add(box(0.20, 0.22, 0.05, P.accent, -BW/2+0.22, torsoY+0.12, BD/2+0.03));
  g.add(box(0.12, 0.04, 0.06, P.gold,   -BW/2+0.22, torsoY+0.12, BD/2+0.06));    // gold star centre
  // arms (shoulder pivots)
  const armW=0.26, armH=torsoH+legH*0.28, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.74, BD-0.06, navy,   0, (torsoY+torsoH/2-armH*0.36)-shoulderY, 0));
    A.add(box(armW, armH*0.26, BD-0.06, P.skin, 0, (torsoY+torsoH/2-armH*0.87)-shoulderY, 0));
    A.add(box(armW+0.04, 0.05, BD-0.04, P.cream, 0, (torsoY+torsoH/2-armH*0.70)-shoulderY, 0.01)); // sleeve stripe
  });
  // head + face
  const HW=0.56, HH=0.58, HDP=0.50;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.30,0.12,0.28, P.skin, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skin, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // wraparound shades — single dark band
  g.add(box(HW*0.96, 0.13, 0.05, SHADE, 0, headY+0.02, HDP/2+0.015));
  // TALL trooper cap — taller than a baseball cap so the silhouette adds height
  const topHead = headY+HH/2, cap = darken(P.blue,0.6);
  g.add(box(HW+0.06, 0.28, HDP+0.06, cap, 0, topHead+0.14, 0));                  // tall crown
  g.add(box(HW*0.82, 0.05, 0.22, cap, 0, topHead+0.04, HDP/2+0.10));             // peak
  g.add(box(HW+0.08, 0.06, HDP+0.08, P.ironD, 0, topHead+0.01, 0));              // hat band
  g.add(box(0.16, 0.12, 0.04, P.gold, 0, topHead+0.06, HDP/2+0.10));             // cap badge
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── NURSE: slim build, nurse cap with TEAL CROSS, both hands cradle a clipboard
//     held at waist height in front of the torso (silhouette = board-in-front) ──
export function nurse(){
  const g = new THREE.Group();
  const BW=0.86, BD=0.48, torsoH=0.76, legH=0.86, shoeH=0.16;
  const lx=0.20, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.28,shoeH,BD,     P.white, 0, shoeH/2-hipY,        0.05));        // white nursing shoes
    L.add(box(0.28,legH,BD-0.08, P.cream, 0, (shoeH+legH/2)-hipY, 0));           // scrub trousers
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, P.cream, 0, torsoY, 0));                              // scrub top
  g.add(box(0.06, torsoH*0.7, 0.04, darken(P.cream,0.4), 0, torsoY-0.04, BD/2+0.02)); // V-neck line
  // arms held FORWARD-ish to cradle the clipboard (shoulder pivots, armBase set)
  const armW=0.22, armH=torsoH+legH*0.26, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.70, BD-0.08, P.cream,  0, (torsoY+torsoH/2-armH*0.36)-shoulderY, 0));
    A.add(box(armW, armH*0.30, BD-0.08, P.skin,   0, (torsoY+torsoH/2-armH*0.86)-shoulderY, 0));
  });
  // CLIPBOARD held in front, hovering at waist — the unmistakable nurse silhouette
  g.add(box(BW-0.10, 0.46, 0.05, P.white,    0, torsoY-0.02, BD/2+0.22));         // board
  g.add(box(BW-0.10, 0.08, 0.06, P.accent,   0, torsoY+0.18, BD/2+0.22));         // teal clip (THE accent)
  for(let i=0;i<3;i++)
    g.add(box(BW-0.20, 0.02, 0.07, darken(P.cream,0.5), 0, torsoY+0.04-i*0.09, BD/2+0.225)); // scribble lines
  // head + face
  const HW=0.52, HH=0.56, HDP=0.46;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.26,0.12,0.24, P.skin, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skin, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // brown hair in a low bun behind the cap
  const topHead = headY+HH/2;
  g.add(box(HW+0.04,0.16,HDP+0.04, P.hairBrown, 0, topHead+0.04, 0));
  g.add(box(0.26, 0.22, 0.22, P.hairBrown, 0, topHead+0.14, -0.10));              // back bun
  g.add(box(0.12, HH*0.65, HDP*0.85, P.hairBrown, -(HW/2+0.03), headY-0.04, 0));
  g.add(box(0.12, HH*0.65, HDP*0.85, P.hairBrown,  (HW/2+0.03), headY-0.04, 0));
  // NURSE CAP — small white box on top with a TEAL CROSS (the canonical icon)
  g.add(box(HW+0.02, 0.12, HDP, P.white, 0, topHead+0.16, 0.02));
  g.add(box(0.10, 0.06, 0.04, P.accent, 0, topHead+0.16, HDP/2-0.04));            // cross horizontal
  g.add(box(0.04, 0.12, 0.04, P.accent, 0, topHead+0.16, HDP/2-0.04));            // cross vertical
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── FIREFIGHTER: BUNKER HELMET with rear-flared brim + front shield, oxygen tank
//     CYLINDER on the back (silhouette pokes out behind), gold turnout coat ──
export function firefighter(){
  const g = new THREE.Group();
  const BW=1.06, BD=0.56, torsoH=0.82, legH=0.92, shoeH=0.18;
  const lx=0.24, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  const coat = darken(P.gold,0.4), pant = darken(P.gold,0.48);
  [legL,legR].forEach(L=>{
    L.add(box(0.36,shoeH,BD,         P.ironD, 0, shoeH/2-hipY,        0.05));
    L.add(box(0.34,legH,BD-0.06,     pant,    0, (shoeH+legH/2)-hipY, 0));
    L.add(box(0.36,0.06,BD-0.04,     P.cream, 0, (shoeH+legH*0.30)-hipY, 0.02));  // reflective ankle band
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, coat, 0, torsoY, 0));                                  // turnout coat
  // reflective stripes — TEAL is the accent
  g.add(box(BW+0.02, 0.07, BD+0.02, P.accent, 0, torsoY+0.05, 0));
  g.add(box(BW+0.02, 0.07, BD+0.02, P.accent, 0, torsoY-0.18, 0));
  // OXYGEN TANK on the back — chunky cylinder-ish box, pokes out behind
  g.add(box(BW-0.30, torsoH+0.10, 0.26, darken(P.ironD,0.5), 0, torsoY+0.04, -BD/2-0.18));
  g.add(box(BW-0.20, 0.10, 0.28, P.ironD, 0, torsoY+torsoH*0.30, -BD/2-0.18));     // top valve cap
  g.add(box(0.08, torsoH*0.6, 0.06, darken(P.ironD,0.4), 0.20, torsoY+0.06, -BD/2-0.05)); // hose down right
  // arms (hold an axe in the right hand)
  const armW=0.26, armH=torsoH+legH*0.28, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.70, BD-0.06, coat,   0, (torsoY+torsoH/2-armH*0.36)-shoulderY, 0));
    A.add(box(armW, armH*0.30, BD-0.06, P.ironD, 0, (torsoY+torsoH/2-armH*0.86)-shoulderY, 0));// glove
  });
  // AXE in the right hand — handle + head sticking down past the arm
  const axeHandleY = (torsoY+torsoH/2-armH*0.86)-shoulderY - 0.30;
  armR.add(box(0.07, 0.60, 0.07, P.woodD, 0, axeHandleY, 0.10));                  // handle
  armR.add(box(0.30, 0.18, 0.10, P.steel,  0.10, axeHandleY-0.30, 0.10));         // axe head
  armR.add(box(0.10, 0.18, 0.10, darken(P.red,0.3), -0.10, axeHandleY-0.30, 0.10));// red back-spike
  // head + face
  const HW=0.56, HH=0.58, HDP=0.50;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.30,0.12,0.28, P.skinTan, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skinTan, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // BUNKER HELMET — front shield (tall raised) + rear flare brim, distinctive shape
  const topHead = headY+HH/2;
  const helmCol = darken(P.red, 0.35);
  g.add(box(HW+0.10, 0.18, HDP+0.10, helmCol, 0, topHead+0.10, 0));                // dome
  g.add(box(HW+0.10, 0.04, HDP+0.30, helmCol, 0, topHead+0.02, -0.10));            // REAR-FLARED brim (longer back)
  g.add(box(HW-0.04, 0.22, 0.10,     helmCol, 0, topHead+0.16, HDP/2+0.04));       // TALL front shield
  g.add(box(HW-0.18, 0.06, 0.12, P.cream, 0, topHead+0.18, HDP/2+0.10));           // shield emblem (white)
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── CONSTRUCTION: cream HARD HAT (rounded dome no peak), tool belt with a
//     HAMMER hanging on the right hip (silhouette has a stick poking down) ──
export function construction(){
  const g = new THREE.Group();
  const BW=1.06, BD=0.54, torsoH=0.80, legH=0.90, shoeH=0.18;
  const lx=0.22, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.34,shoeH+0.04,BD,     P.woodD,  0, (shoeH+0.04)/2-hipY, 0.05));   // work boots (taller)
    L.add(box(0.34,legH,BD-0.06,      P.woodD,  0, (shoeH+legH/2)-hipY, 0));      // brown work pants
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, darken(P.orange,0.5), 0, torsoY, 0));                  // work shirt
  // hi-vis VEST over the shirt, TEAL reflective stripe (the accent)
  g.add(box(BW+0.04, torsoH*0.78, 0.05, darken(P.gold,0.35), 0, torsoY-0.04, BD/2+0.025));
  g.add(box(BW+0.04, torsoH*0.78, 0.05, darken(P.gold,0.35), 0, torsoY-0.04, -BD/2-0.025));
  g.add(box(BW+0.06, 0.08, 0.06, P.accent, 0, torsoY-0.18, BD/2+0.030));
  g.add(box(BW+0.06, 0.08, 0.06, P.accent, 0, torsoY-0.18, -BD/2-0.030));
  // tool belt + HAMMER hanging on the right hip
  g.add(box(BW+0.04, 0.14, BD+0.04, P.woodD, 0, torsoY-torsoH/2+0.05, 0));         // belt
  g.add(box(0.10, 0.36, 0.08, P.woodD,  BW/2+0.10, torsoY-torsoH/2-0.15, 0));      // hammer handle (long)
  g.add(box(0.20, 0.10, 0.18, P.steel,  BW/2+0.10, torsoY-torsoH/2-0.34, 0));      // hammer head
  // arms (shoulder pivots)
  const armW=0.26, armH=torsoH+legH*0.28, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.62, BD-0.06, darken(P.orange,0.5), 0, (torsoY+torsoH/2-armH*0.31)-shoulderY, 0));
    A.add(box(armW, armH*0.38, BD-0.06, P.skinD,             0, (torsoY+torsoH/2-armH*0.81)-shoulderY, 0)); // bare forearms
    A.add(box(armW+0.02, 0.10, BD-0.04, darken(P.gold,0.45), 0, (torsoY+torsoH/2-armH*0.66)-shoulderY, 0.01)); // hi-vis cuff
  });
  // head + face
  const HW=0.56, HH=0.58, HDP=0.50;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.30,0.12,0.28, P.skinD, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skinD, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // brown stubble bangs visible under the hat
  const topHead = headY+HH/2;
  g.add(box(HW+0.04, 0.06, HDP+0.04, P.hairBrown, 0, topHead-0.02, 0));
  // HARD HAT — wide dome with a small front brim (no peak like a cap, different shape)
  g.add(box(HW+0.18, 0.18, HDP+0.16, P.cream, 0, topHead+0.10, 0));                // wide dome
  g.add(box(HW+0.04, 0.04, 0.20, P.cream, 0, topHead+0.02, HDP/2+0.06));           // small visor lip
  g.add(box(0.20, 0.06, 0.06, P.accent, 0, topHead+0.16, HDP/2+0.04));             // teal stripe? wait already used vest
  // ^ remove the cap stripe — single-accent rule. Replace with neutral logo:
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── DELIVERY: bike helmet (sleek rounded), holds a LARGE square thermal box at
//     chest height with both arms forward (silhouette = box-in-front) ──
export function delivery(){
  const g = new THREE.Group();
  const BW=0.96, BD=0.52, torsoH=0.78, legH=0.88, shoeH=0.16;
  const lx=0.22, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.32,shoeH,BD, P.ironD,           0, shoeH/2-hipY,        0.05));    // sneakers
    L.add(box(0.30,legH,BD-0.08, darken(P.slate,0.7), 0, (shoeH+legH/2)-hipY, 0));// dark trousers
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, darken(P.red,0.5), 0, torsoY, 0));                     // red branded shirt
  g.add(box(0.34, 0.08, 0.04, P.cream, -0.18, torsoY+0.16, BD/2+0.02));            // chest logo strip
  // arms pivoted forward to "hold" the box — armBase set in rig()
  const armW=0.22, armH=torsoH+legH*0.22, shoulderY=torsoY+torsoH/2-0.06;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.65, BD-0.08, darken(P.red,0.5), 0, -armH*0.30, 0));
    A.add(box(armW, armH*0.35, BD-0.08, P.skin,            0, -armH*0.78, 0));
  });
  // THE BOX — large square thermal carrier held in front at chest height (THE silhouette)
  const boxW = BW+0.16, boxH = torsoH*0.86, boxD = 0.40;
  g.add(box(boxW, boxH, boxD, P.accent, 0, torsoY-0.02, BD/2+boxD/2+0.10));        // teal thermal box
  g.add(box(boxW, 0.06, boxD+0.02, darken(P.accent,0.5), 0, torsoY+boxH*0.30, BD/2+boxD/2+0.10)); // hinge band
  g.add(box(boxW-0.20, 0.20, 0.04, P.cream, 0, torsoY-0.02, BD/2+boxD+0.11));      // brand sticker on front
  // head + face
  const HW=0.54, HH=0.56, HDP=0.48;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.28,0.12,0.26, P.skin, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skin, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // BIKE HELMET — rounded sleek (chunky dome but distinctly different from hardhat: it has vents)
  const topHead = headY+HH/2;
  const helmC = darken(P.slate, 0.6);
  g.add(box(HW+0.06, 0.20, HDP+0.06, helmC, 0, topHead+0.10, 0));
  g.add(box(HW+0.06, 0.04, 0.16, helmC, 0, topHead+0.02, HDP/2+0.04));             // short visor
  // bike helmet VENTS — slot lines that read as sport-helmet silhouette cue
  for(let i=-1;i<=1;i++)
    g.add(box(0.04, 0.20, 0.32, darken(helmC,0.5), i*0.18, topHead+0.10, 0));
  rig(g, legL, legR, armL, armR, -0.55);   // arms pre-rotated forward
  finish(g);
  return g;
}

// ─── COWBOY: HUGE Stetson wide-brim disc, denim shirt + jeans, heeled boots,
//     bandana around the neck (TEAL = the accent), lasso coil at the hip ──
export function cowboy(){
  const g = new THREE.Group();
  const BW=1.00, BD=0.52, torsoH=0.78, legH=0.94, shoeH=0.22;     // taller shoeH = boots with heel
  const lx=0.22, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.34,shoeH,BD+0.02, P.woodD, 0, shoeH/2-hipY,         0.06));        // boots
    L.add(box(0.10,0.08,0.10,     darken(P.gold,0.3), 0, shoeH-0.10-hipY, BD/2+0.06)); // toe cap
    L.add(box(0.32,legH,BD-0.10,  darken(P.blue,0.7), 0, (shoeH+legH/2)-hipY, 0)); // jeans
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, darken(P.blue,0.55), 0, torsoY, 0));                   // denim shirt
  g.add(box(0.18, 0.18, 0.04, P.cream, -BW/2+0.18, torsoY+0.18, BD/2+0.02));       // chest pocket L
  g.add(box(0.18, 0.18, 0.04, P.cream,  BW/2-0.18, torsoY+0.18, BD/2+0.02));       // chest pocket R
  // bandana — TEAL around the neck (front+back panel + knot)
  g.add(box(BW-0.10, 0.16, 0.06, P.accent, 0, torsoY+torsoH/2-0.02,  BD/2+0.025));
  g.add(box(BW-0.10, 0.16, 0.06, P.accent, 0, torsoY+torsoH/2-0.02, -BD/2-0.025));
  g.add(box(0.10, 0.10, 0.10, P.accent, 0, torsoY+torsoH/2+0.04, -BD/2-0.06));     // knot
  // BIG belt buckle on a leather belt
  g.add(box(BW+0.02, 0.10, BD+0.02, P.woodD, 0, torsoY-torsoH/2+0.05, 0));
  g.add(box(0.20, 0.16, 0.04, P.gold, 0, torsoY-torsoH/2+0.04, BD/2+0.02));        // buckle
  // LASSO coil at the left hip — small brown loop
  g.add(box(0.16, 0.16, 0.10, P.woodL, -BW/2-0.06, torsoY-torsoH/2-0.04, 0.08));
  g.add(box(0.18, 0.04, 0.10, darken(P.woodL,0.3), -BW/2-0.06, torsoY-torsoH/2-0.04, 0.08));
  // arms (shoulder pivots)
  const armW=0.24, armH=torsoH+legH*0.28, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.66, BD-0.08, darken(P.blue,0.55), 0, (torsoY+torsoH/2-armH*0.33)-shoulderY, 0));
    A.add(box(armW, armH*0.34, BD-0.08, P.skinTan,           0, (torsoY+torsoH/2-armH*0.83)-shoulderY, 0));
  });
  // head + face
  const HW=0.54, HH=0.58, HDP=0.50;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.28,0.12,0.26, P.skinTan, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skinTan, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // a strip of blond hair visible under the hat brim
  const topHead = headY+HH/2;
  g.add(box(HW+0.02, 0.06, HDP+0.02, P.hairBlond, 0, topHead-0.02, 0));
  // STETSON — HUGE wide-brim disc + low rounded crown (silhouette = big plate on head)
  const stetson = darken(P.amber, 0.45);
  g.add(box(HW+0.50, 0.05, HDP+0.50, stetson, 0, topHead+0.02, 0));                // very wide brim
  g.add(box(HW+0.04, 0.18, HDP+0.04, stetson, 0, topHead+0.14, 0));                // low crown
  g.add(box(HW+0.04, 0.04, HDP-0.10, darken(stetson,0.3), 0, topHead+0.06, 0));    // hat band
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── PUNK: tall TEAL MOHAWK crest, spiked leather jacket, slim build ──
export function punk(){
  const g = new THREE.Group();
  const BW=0.92, BD=0.46, torsoH=0.78, legH=0.96, shoeH=0.18;
  const lx=0.18, hipY=shoeH+legH;     // narrow stance (slim)
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.30,shoeH+0.04,BD,     P.ironD, 0, (shoeH+0.04)/2-hipY, 0.05));     // chunky combat boots
    L.add(box(0.22,legH,BD-0.10, darken(P.slate,0.95), 0, (shoeH+legH/2)-hipY, 0));// skinny black jeans
    L.add(box(0.26,0.04,BD-0.08, P.ironD, 0, (shoeH+legH*0.55)-hipY, 0));          // belt around the leg (chain)
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, P.ironD, 0, torsoY, 0));                                // black leather jacket
  // jacket lapels — small triangular cream patches as collar V
  g.add(box(0.10, 0.18, 0.04, darken(P.ironD,0.4), -0.12, torsoY+torsoH*0.30, BD/2+0.02));
  g.add(box(0.10, 0.18, 0.04, darken(P.ironD,0.4),  0.12, torsoY+torsoH*0.30, BD/2+0.02));
  // stud pattern on the chest (small dots)
  for(let r=0;r<3;r++) for(let c=-1;c<=1;c++)
    g.add(box(0.04,0.04,0.04, P.steel, c*0.22, torsoY+0.10-r*0.12, BD/2+0.025));
  // SPIKED SHOULDERS — 3 short spikes per shoulder sticking UP (silhouette cue)
  for(const sx of [-1,1]) for(let i=-1;i<=1;i++){
    g.add(box(0.06, 0.18, 0.06, P.steel, sx*(BW/2-0.04)+i*0.04, torsoY+torsoH/2+0.08, i*0.06));
  }
  // arms (shoulder pivots, slim)
  const armW=0.20, armH=torsoH+legH*0.30, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.72, BD-0.10, P.ironD, 0, (torsoY+torsoH/2-armH*0.36)-shoulderY, 0));
    A.add(box(armW, armH*0.28, BD-0.10, P.skin,  0, (torsoY+torsoH/2-armH*0.86)-shoulderY, 0));
  });
  // head + face
  const HW=0.52, HH=0.56, HDP=0.46;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.26,0.12,0.24, P.skin, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skin, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // eye-line liner (subtle dark band)
  g.add(box(HW*0.96, 0.05, 0.04, EYE, 0, headY+0.10, HDP/2+0.012));
  // TALL TEAL MOHAWK — silhouette tower above the head
  const topHead = headY+HH/2;
  g.add(box(0.18, 0.18, HDP*0.82, P.ironD, 0, topHead+0.04, 0));                    // shaved-strip base (black)
  g.add(box(0.14, 0.60, HDP*0.72, P.accent, 0, topHead+0.36, 0));                  // TEAL tall crest
  g.add(box(0.08, 0.20, HDP*0.40, P.accent, 0, topHead+0.74, 0));                  // tapered tip
  // shaved sides — thin dark stubble
  g.add(box(0.05, 0.14, HDP*0.50, EYE, -(HW/2+0.02), topHead-0.06, 0));
  g.add(box(0.05, 0.14, HDP*0.50, EYE,  (HW/2+0.02), topHead-0.06, 0));
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── RAPPER: OVERSIZED — wide hoodie + baggy jeans + huge sneakers + big chain ──
export function rapper(){
  const g = new THREE.Group();
  const BW=1.30, BD=0.62, torsoH=0.84, legH=0.86, shoeH=0.22;     // big body, chunky feet
  const lx=0.28, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.44,shoeH,BD+0.06, P.white,                  0, shoeH/2-hipY,        0.08));   // chunky white kicks
    L.add(box(0.42,legH,BD-0.04,  darken(P.blue,0.55),      0, (shoeH+legH/2)-hipY, 0));     // baggy jeans (wide)
  });
  const torsoY = hipY+torsoH/2;
  // OVERSIZED hoodie — extra-wide torso with proud panels
  g.add(box(BW, torsoH, BD, darken(P.purple,0.4), 0, torsoY, 0));                   // hoodie body
  g.add(box(BW-0.10, 0.14, BD+0.04, darken(P.purple,0.55), 0, torsoY-torsoH/2+0.07, 0)); // bottom hem
  g.add(box(0.30, torsoH*0.4, BD+0.04, darken(P.purple,0.55), 0, torsoY-0.06, 0));   // central kangaroo pocket
  // THE CHAIN — thick gold-teal pendant across the chest (silhouette has weight at neck)
  g.add(box(0.50, 0.06, 0.05, P.accent, 0, torsoY+torsoH/2-0.04, BD/2+0.025));      // top chain
  g.add(box(0.20, 0.20, 0.06, P.accent, 0, torsoY+torsoH*0.20, BD/2+0.035));        // pendant block
  g.add(box(0.10, 0.10, 0.08, P.gold,    0, torsoY+torsoH*0.20, BD/2+0.060));       // gold detail
  // arms (oversized sleeves, hanging long)
  const armW=0.30, armH=torsoH+legH*0.30, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.78, BD-0.04, darken(P.purple,0.4), 0, (torsoY+torsoH/2-armH*0.39)-shoulderY, 0));
    A.add(box(armW-0.04, armH*0.22, BD-0.06, P.skinDk,       0, (torsoY+torsoH/2-armH*0.89)-shoulderY, 0));
  });
  // head + face
  const HW=0.58, HH=0.58, HDP=0.50;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.32,0.12,0.30, P.skinDk, 0, neckY, 0));
  const headY = neckY+0.06+HH/2;
  g.add(box(HW,HH,HDP, P.skinDk, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // backwards-style cap — crown on head, "peak" at the BACK (silhouette cue)
  const topHead = headY+HH/2;
  const cap = darken(P.red, 0.4);
  g.add(box(HW+0.06, 0.18, HDP+0.06, cap, 0, topHead+0.08, 0));                     // crown
  g.add(box(HW*0.78, 0.05, 0.22, cap, 0, topHead+0.02, -HDP/2-0.08));               // peak BACKWARD
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── BIKER: bulky leather jacket (shoulder padding), FULL-FACE round helmet
//     with a teal visor band, leather pants. Silhouette = wide-shoulder + ball-head ──
export function biker(){
  const g = new THREE.Group();
  const BW=1.14, BD=0.56, torsoH=0.82, legH=0.92, shoeH=0.20;
  const lx=0.26, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  [legL,legR].forEach(L=>{
    L.add(box(0.36,shoeH,BD+0.04, P.ironD, 0, shoeH/2-hipY,         0.06));         // heavy boots
    L.add(box(0.34,legH,BD-0.06,  P.ironD, 0, (shoeH+legH/2)-hipY,  0));            // leather pants
    L.add(box(0.36,0.10,BD-0.04,  darken(P.ironD,0.6), 0, (shoeH+legH*0.40)-hipY, 0)); // knee padding
  });
  const torsoY = hipY+torsoH/2;
  g.add(box(BW, torsoH, BD, P.ironD, 0, torsoY, 0));                                 // leather jacket
  // SHOULDER PADDING — extra layer that widens the silhouette at the shoulders
  g.add(box(BW+0.16, 0.20, BD+0.06, P.ironD, 0, torsoY+torsoH/2-0.04, 0));
  g.add(box(BW+0.20, 0.06, BD+0.10, darken(P.ironD,0.5), 0, torsoY+torsoH/2-0.14, 0)); // shoulder seam
  // jacket zipper line + breast emblem
  g.add(box(0.04, torsoH-0.10, 0.04, P.steel,    0, torsoY, BD/2+0.02));
  g.add(box(0.16, 0.14, 0.04, darken(P.red,0.4), -BW/2+0.20, torsoY+0.16, BD/2+0.02)); // red patch
  // belt with chain
  g.add(box(BW+0.04, 0.10, BD+0.02, P.steel, 0, torsoY-torsoH/2+0.05, 0));
  g.add(box(0.34, 0.08, 0.06, P.steel, BW/2-0.10, torsoY-torsoH/2-0.04, 0));         // hanging chain
  // arms — bulky leather sleeves
  const armW=0.30, armH=torsoH+legH*0.28, shoulderY=torsoY+torsoH/2-0.04;
  const ax=BW/2+0.06+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.78, BD-0.04, P.ironD, 0, (torsoY+torsoH/2-armH*0.39)-shoulderY, 0));
    A.add(box(armW+0.02, armH*0.22, BD-0.02, darken(P.ironD,0.4), 0, (torsoY+torsoH/2-armH*0.89)-shoulderY, 0)); // gauntlets
  });
  // FULL-FACE HELMET — large rounded "ball" head, no human face visible. TEAL visor band (the accent)
  const HW=0.62, HH=0.62, HDP=0.58;
  const neckY = torsoY+torsoH/2+0.04;
  g.add(box(0.30,0.10,0.28, P.skinTan, 0, neckY, 0));
  const headY = neckY+0.05+HH/2;
  const helm = darken(P.slate, 0.85);
  g.add(box(HW, HH, HDP, helm, 0, headY, 0));                                        // helmet body
  g.add(box(HW+0.04, 0.04, HDP+0.04, darken(helm,0.3), 0, headY+HH/2-0.04, 0));      // top seam
  // VISOR — teal accent band across the eye line, slightly proud
  g.add(box(HW-0.04, 0.16, 0.04, P.accent, 0, headY+0.06, HDP/2+0.02));
  g.add(box(HW-0.04, 0.04, 0.05, darken(helm,0.5), 0, headY+0.14, HDP/2+0.02));      // visor top edge
  g.add(box(HW-0.04, 0.04, 0.05, darken(helm,0.5), 0, headY-0.02, HDP/2+0.02));      // visor bottom edge
  // chin vents
  for(let i=-1;i<=1;i++) g.add(box(0.06, 0.06, 0.04, EYE, i*0.10, headY-HH/2+0.10, HDP/2+0.02));
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── GOTH: LONG HAIR down to chest, pale skin, all-black skirt + corset, heeled
//     boots, teal cross necklace. Silhouette = long-hair-and-skirt (very different
//     from every other char's short hair + trouser legs) ──
export function goth(){
  const g = new THREE.Group();
  const BW=0.88, BD=0.48, torsoH=0.76, legH=0.86, shoeH=0.22;     // heeled boots = taller shoeH
  const lx=0.18, hipY=shoeH+legH;
  const legL=new THREE.Group(), legR=new THREE.Group();
  legL.position.set(-lx,hipY,0); legR.position.set(lx,hipY,0);
  const paleSkin = darken(P.cream, 0.10);
  // LONG SKIRT — silhouette goes wide from the waist down (replaces trousers)
  const skirtY = shoeH + 0.50;
  g.add(box(BW+0.18, 0.96, BD+0.04, P.ironD, 0, skirtY, 0));                         // long black skirt
  g.add(box(BW+0.20, 0.04, BD+0.06, darken(P.ironD,0.4), 0, skirtY-0.48, 0));        // hem trim
  // boots peeking out below the skirt
  [legL,legR].forEach(L=>{
    L.add(box(0.24, shoeH, BD-0.10, P.ironD,          0, shoeH/2-hipY,          0.04));
    L.add(box(0.06, 0.08,  0.10,    darken(P.ironD,0.5), 0, shoeH/2-0.10-hipY,    BD/2-0.05)); // heel
    L.add(box(0.22, 0.20,  BD-0.12, paleSkin,         0, (shoeH+0.10)-hipY,      0));          // pale ankle
  });
  const torsoY = skirtY+0.48+torsoH/2-0.06;
  // CORSET top — black with cream lace cross-tie down the front
  g.add(box(BW, torsoH, BD, P.ironD, 0, torsoY, 0));
  for(let i=0;i<4;i++) g.add(box(0.18, 0.04, 0.04, P.cream, 0, torsoY+torsoH*0.30-i*0.16, BD/2+0.02)); // lace bars
  for(let i=0;i<3;i++) g.add(box(0.02, 0.16, 0.05, P.cream, 0, torsoY+torsoH*0.20-i*0.16, BD/2+0.025)); // vertical lace
  // CROSS NECKLACE — teal (the accent), prominent at the collarbone
  g.add(box(0.04, 0.20, 0.04, P.accent, 0, torsoY+torsoH/2-0.10, BD/2+0.04));        // vertical
  g.add(box(0.16, 0.04, 0.04, P.accent, 0, torsoY+torsoH/2-0.14, BD/2+0.04));        // horizontal
  // arms (slim)
  const armW=0.20, armH=torsoH+0.40, shoulderY=torsoY+torsoH/2;
  const ax=BW/2+0.02+armW/2;
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-ax,shoulderY,0); armR.position.set(ax,shoulderY,0);
  [armL,armR].forEach(A=>{
    A.add(box(armW, armH*0.72, BD-0.12, P.ironD,  0, (torsoY+torsoH/2-armH*0.36)-shoulderY, 0)); // black sleeves
    A.add(box(armW, armH*0.28, BD-0.12, paleSkin, 0, (torsoY+torsoH/2-armH*0.86)-shoulderY, 0));
  });
  // head + face — pale
  const HW=0.50, HH=0.56, HDP=0.46;
  const neckY = torsoY+torsoH/2+0.05;
  g.add(box(0.26,0.10,0.24, paleSkin, 0, neckY, 0));
  const headY = neckY+0.05+HH/2;
  g.add(box(HW,HH,HDP, paleSkin, 0, headY, 0));
  eyes(g, headY, HW, HDP);
  // heavy eye makeup band
  g.add(box(HW*0.9, 0.06, 0.04, EYE, 0, headY+0.07, HDP/2+0.012));
  // dark lipstick
  g.add(box(0.16, 0.05, 0.04, darken(P.purple,0.5), 0, headY-HH*0.30, HDP/2+0.012));
  // LONG HAIR — flowing down past the shoulders to chest level (silhouette cue)
  const hair = darken(P.purple, 0.95);
  const topHead = headY+HH/2;
  g.add(box(HW+0.04, 0.20, HDP+0.04, hair, 0, topHead+0.06, 0));                      // top crown
  g.add(box(HW+0.06, 0.40, 0.14, hair, 0, headY+0.04, -HDP*0.55));                    // back
  // long side curtains down past the shoulders
  g.add(box(0.16, 0.90, HDP*0.78, hair, -(HW/2+0.05), headY-0.46, -0.04));
  g.add(box(0.16, 0.90, HDP*0.78, hair,  (HW/2+0.05), headY-0.46, -0.04));
  // fringe over the forehead
  g.add(box(HW+0.04, 0.10, 0.10, hair, 0, headY+HH*0.30, HDP/2+0.01));
  rig(g, legL, legR, armL, armR);
  finish(g);
  return g;
}

// ─── export bundle — characters.js spreads this into CHARACTERS, same as MONSTERS ──
export const ARCHETYPES = { cop, nurse, firefighter, construction, delivery,
                            cowboy, punk, rapper, biker, goth };
