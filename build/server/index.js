import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Link, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useNavigation, Form } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { FaInstagram } from "react-icons/fa";
import { SiGroupme } from "react-icons/si";
import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import fs from "node:fs/promises";
import path from "node:path";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("div", {
    className: "site-shell",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "site-header",
      children: [/* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "brand",
        "aria-label": "Novi Engineering Club home",
        children: [/* @__PURE__ */ jsx("span", {
          className: "brand-mark",
          children: "NE"
        }), /* @__PURE__ */ jsxs("span", {
          className: "brand-copy",
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Novi Engineering Club"
          }), /* @__PURE__ */ jsx("small", {
            children: "Make things. Make them fly."
          })]
        })]
      }), /* @__PURE__ */ jsxs("nav", {
        className: "main-nav",
        "aria-label": "Main navigation",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/#projects",
          children: "Our builds"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/drone",
          children: "Drone"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/rocket",
          children: "Model rocket"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/sponsors",
          children: "Sponsors"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/meetings",
          children: "Meetings"
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/meetings",
          className: "nav-cta",
          children: ["Join the club ", /* @__PURE__ */ jsx("span", {
            "aria-hidden": "true",
            children: "↗"
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      id: "content",
      children: /* @__PURE__ */ jsx(Outlet, {})
    }), /* @__PURE__ */ jsxs("footer", {
      className: "site-footer",
      children: [/* @__PURE__ */ jsxs("span", {
        children: ["© ", (/* @__PURE__ */ new Date()).getFullYear(), " NOVI ENGINEERING CLUB · NOVI, MICHIGAN"]
      }), /* @__PURE__ */ jsxs("span", {
        className: "footer-social",
        children: [/* @__PURE__ */ jsx("a", {
          href: "https://www.instagram.com/noviengineeringig/",
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "Instagram",
          children: /* @__PURE__ */ jsx(FaInstagram, {
            size: 16
          })
        }), /* @__PURE__ */ jsx("a", {
          href: "https://groupme.com/join_group/104854219/05ltImUw",
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "GroupMe",
          children: /* @__PURE__ */ jsx(SiGroupme, {
            size: 15
          })
        }), /* @__PURE__ */ jsx(Link, {
          to: "/admin",
          children: "Admin"
        })]
      })]
    })]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const useIsStaticRenderer = () => false;
const DEFAULT_SLIDES = [
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/316d1761-fd79-4ca9-b8d4-f2bb20521a00/w=800"
    },
    title: "For Sitting\nMetal\nMinimal"
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/aeaa0756-9647-4f6c-d900-204bd25e4a00/w=800"
    },
    title: "For Living\nConcrete\nForm"
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800"
    },
    title: "For Working\nSteel\nClean"
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800"
    },
    title: "For Resting\nLinen\nQuiet"
  }
];
const PERSPECTIVE = 1100;
const PRESS_SCALE = 0.965;
const PRESS_SHIFT = 6;
const BLUR_WIDTH = 42;
const OVERLAY_DARKEN = 0.35;
function cssTransition(t) {
  const dur = t && typeof t.duration === "number" ? t.duration : 0.55;
  let ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";
  const e = t?.ease;
  if (Array.isArray(e) && e.length === 4) {
    ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
  } else if (typeof e === "string") {
    const map = {
      linear: "linear",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out"
    };
    ease = map[e] || "ease";
  }
  return { dur, ease };
}
function __OriginkitBase_BlurCarousel(props) {
  props = { ...COMPONENT_DEFAULTS, ...props };
  const {
    slides = DEFAULT_SLIDES,
    movement = "horizontal",
    cardWidth = 480,
    cardHeight = 500,
    radius = 8,
    tilt = 9,
    blurAmount = 14,
    arrowColor = "#ffffff",
    arrowInactiveColor = "rgba(255,255,255,0.6)",
    arrowSize = 26,
    autoplay = false,
    transition,
    showTitle = true,
    titleFont,
    titleColor = "#ffffff",
    titlePosition,
    style
  } = props;
  const tp = titlePosition || {};
  const corner = tp.position || "topLeft";
  const isTop = corner === "topLeft" || corner === "topRight";
  const isRight = corner === "topRight" || corner === "bottomRight";
  const padLeft = tp.paddingLeft ?? 26;
  const padRight = tp.paddingRight ?? 26;
  const padTop = tp.paddingTop ?? 24;
  const padBottom = tp.paddingBottom ?? 24;
  const isStatic = useIsStaticRenderer();
  const list = slides && slides.length ? slides : DEFAULT_SLIDES;
  const n = list.length;
  const vertical = movement === "vertical";
  const [index, setIndex] = useState(0);
  const [pressDir, setPressDir] = useState(0);
  const [hoverSide, setHoverSide] = useState(0);
  useEffect(() => {
    setIndex((i) => Math.max(0, Math.min(n - 1, i)));
  }, [n]);
  const go = useCallback(
    (dir) => {
      setIndex((i) => {
        return ((i + dir) % n + n) % n;
      });
    },
    [n]
  );
  const delay = transition && typeof transition.delay === "number" ? transition.delay : 4;
  useEffect(() => {
    if (!autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1e3;
    const id = window.setInterval(() => go(1), ms);
    return () => window.clearInterval(id);
  }, [isStatic, autoplay, delay, n, go]);
  const onArrowDown = (dir) => (e) => {
    if (autoplay) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setHoverSide(dir);
    setPressDir(dir);
  };
  const onArrowUp = (dir) => (e) => {
    if (autoplay) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    go(dir);
    setPressDir(0);
  };
  const onArrowCancel = () => setPressDir(0);
  const onArrowEnter = (dir) => () => {
    if (!autoplay) setHoverSide(dir);
  };
  const onArrowLeave = () => {
    setHoverSide(0);
  };
  const onKeyDown = useCallback(
    (e) => {
      const next = vertical ? "ArrowDown" : "ArrowRight";
      const prev = vertical ? "ArrowUp" : "ArrowLeft";
      if (e.key === next) {
        e.preventDefault();
        go(1);
      } else if (e.key === prev) {
        e.preventDefault();
        go(-1);
      }
    },
    [go, vertical]
  );
  const { dur, ease } = cssTransition(transition);
  const tiltTransition = `transform ${dur}s ${ease}`;
  const fadeTransition = `opacity ${dur}s ease`;
  const radiusPx = Math.max(0, Math.min(20, radius)) / 20 * (Math.min(cardWidth, cardHeight) / 2);
  const rootStyle = {
    ...style || {},
    position: "relative",
    width: "100%",
    height: "100%",
    minWidth: 200,
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    outline: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent"
  };
  const frameStyle = {
    position: "relative",
    width: `min(100%, ${cardWidth}px)`,
    height: "100%",
    borderRadius: radiusPx,
    clipPath: `inset(0 round ${radiusPx}px)`,
    overflow: "hidden",
    background: "#0c0c0c",
    transformStyle: "preserve-3d",
    transformOrigin: "center center",
    transform: vertical ? `translateY(${pressDir * PRESS_SHIFT}px) rotateX(${-pressDir * tilt}deg) scale(${pressDir !== 0 ? PRESS_SCALE : 1})` : `translateX(${pressDir * PRESS_SHIFT}px) rotateY(${pressDir * tilt}deg) scale(${pressDir !== 0 ? PRESS_SCALE : 1})`,
    transition: tiltTransition
  };
  const titleStyle = (i) => ({
    position: "absolute",
    left: padLeft,
    right: padRight,
    [isTop ? "top" : "bottom"]: isTop ? padTop : padBottom,
    textAlign: isRight ? "right" : "left",
    color: titleColor,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: "1.12em",
    letterSpacing: "-0.01em",
    whiteSpace: "pre-line",
    textShadow: "0 2px 14px rgba(0,0,0,0.35)",
    opacity: i === index ? 1 : 0,
    transition: fadeTransition,
    pointerEvents: "none",
    zIndex: 4,
    ...titleFont || {}
  });
  const arrowWrap = (dir) => {
    const base = {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: arrowSize + 18,
      height: arrowSize + 18,
      zIndex: 5,
      cursor: "pointer",
      color: hoverSide === dir ? arrowColor : arrowInactiveColor,
      transition: "color 0.25s ease, transform 0.2s ease",
      touchAction: "none"
    };
    if (vertical) {
      return {
        ...base,
        left: "50%",
        [dir < 0 ? "top" : "bottom"]: 14,
        transform: "translateX(-50%)"
      };
    }
    return {
      ...base,
      top: "50%",
      [dir < 0 ? "left" : "right"]: 14,
      transform: "translateY(-50%)"
    };
  };
  const blurOverlay = (dir) => {
    const common = {
      position: "absolute",
      backdropFilter: `blur(${blurAmount}px)`,
      WebkitBackdropFilter: `blur(${blurAmount}px)`,
      opacity: hoverSide === dir ? 1 : 0,
      transition: "opacity 0.4s ease",
      pointerEvents: "none",
      zIndex: 3
    };
    if (vertical) {
      const grad2 = dir < 0 ? "linear-gradient(to bottom, #000 0%, transparent 100%)" : "linear-gradient(to top, #000 0%, transparent 100%)";
      return {
        ...common,
        left: 0,
        right: 0,
        [dir < 0 ? "top" : "bottom"]: 0,
        height: `${BLUR_WIDTH}%`,
        maskImage: grad2,
        WebkitMaskImage: grad2
      };
    }
    const grad = dir < 0 ? "linear-gradient(to right, #000 0%, transparent 100%)" : "linear-gradient(to left, #000 0%, transparent 100%)";
    return {
      ...common,
      top: 0,
      bottom: 0,
      [dir < 0 ? "left" : "right"]: 0,
      width: `${BLUR_WIDTH}%`,
      maskImage: grad,
      WebkitMaskImage: grad
    };
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: rootStyle,
      tabIndex: 0,
      role: "group",
      "aria-roledescription": "carousel",
      onKeyDown,
      children: /* @__PURE__ */ jsxs("div", { style: frameStyle, children: [
        list.map(
          (s, i) => s.image?.src ? /* @__PURE__ */ jsx(
            "img",
            {
              src: s.image.src,
              srcSet: s.image.srcSet,
              alt: s.image.alt || s.title || "",
              draggable: false,
              style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: i === index ? 1 : 0,
                transition: fadeTransition
              }
            },
            i
          ) : /* @__PURE__ */ jsx(
            "div",
            {
              role: "img",
              "aria-label": `${s.title || "Club"} photo placeholder`,
              style: {
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: i % 2 === 0 ? "linear-gradient(145deg, #191a1d, #09090a 72%)" : "linear-gradient(35deg, #111214, #202124 65%, #0b0b0c)",
                opacity: i === index ? 1 : 0,
                transition: fadeTransition
              },
              children: /* @__PURE__ */ jsx("span", { style: { color: "#6f7379", fontSize: 10, letterSpacing: ".14em" }, children: "ADD PHOTO" })
            },
            i
          )
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,${OVERLAY_DARKEN}) 0%, rgba(0,0,0,0) 42%)`,
              pointerEvents: "none"
            }
          }
        ),
        showTitle && list.map((s, i) => /* @__PURE__ */ jsx("div", { style: titleStyle(i), children: s.title }, i)),
        /* @__PURE__ */ jsx("div", { style: blurOverlay(-1) }),
        /* @__PURE__ */ jsx("div", { style: blurOverlay(1) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            role: "button",
            "aria-label": "Previous slide",
            style: arrowWrap(-1),
            onPointerDown: onArrowDown(-1),
            onPointerUp: onArrowUp(-1),
            onPointerCancel: onArrowCancel,
            onPointerEnter: onArrowEnter(-1),
            onPointerLeave: onArrowLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                width: arrowSize,
                height: arrowSize,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(
                  "polyline",
                  {
                    points: vertical ? "6 15 12 9 18 15" : "15 18 9 12 15 6"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            role: "button",
            "aria-label": "Next slide",
            style: arrowWrap(1),
            onPointerDown: onArrowDown(1),
            onPointerUp: onArrowUp(1),
            onPointerCancel: onArrowCancel,
            onPointerEnter: onArrowEnter(1),
            onPointerLeave: onArrowLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                width: arrowSize,
                height: arrowSize,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(
                  "polyline",
                  {
                    points: vertical ? "6 9 12 15 18 9" : "9 18 15 12 9 6"
                  }
                )
              }
            )
          }
        )
      ] })
    }
  );
}
const COMPONENT_DEFAULTS = {
  slides: DEFAULT_SLIDES,
  movement: "vertical",
  cardWidth: 500,
  cardHeight: 500,
  radius: 0,
  tilt: 45,
  blurAmount: 40,
  arrowInactiveColor: "#FFFFFF",
  arrowColor: "#ffffff",
  arrowSize: 40,
  autoplay: false,
  transition: {
    type: "tween",
    duration: 0.2,
    delay: 4,
    ease: "linear"
  },
  showTitle: false,
  titleFont: {
    variant: "Bold",
    fontSize: "30px",
    letterSpacing: "-0.01em",
    lineHeight: "1.12em"
  },
  titleColor: "#ffffff",
  titlePosition: {
    position: "topLeft",
    paddingLeft: 26,
    paddingRight: 26,
    paddingTop: 24,
    paddingBottom: 24
  }
};
const __originkitPresetProps$1 = {
  "movement": "horizontal",
  "cardWidth": 1200,
  "tilt": 9,
  "blurAmount": 10
};
function BlurCarousel(props) {
  return /* @__PURE__ */ jsx(__OriginkitBase_BlurCarousel, { ...__originkitPresetProps$1, ...props });
}
const MAX_DPR = 2;
const REF_WIDTH = 1200;
const MAX_TEX = 4096;
const HANDLES = 3;
const CELL_ASPECT = 0.6;
const DRIFT_X = 0.08;
const DRIFT_Y = 0.04;
const DRIFT_RATE = 1.3;
const DRIFT_RATE_Y = 1.3 * 1.3;
const SWEEP_RATE = 0.5;
const SWEEP_BAND = 0.28;
const RESNAP = 0.2;
const DAMP_REF = 20;
const SPEED_REF = 50;
const LABEL_MAX = 0.6;
const DOT_DIAMETER = 4 / 440;
const DOT_PITCH = 12 / 440;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const fract = (x) => x - Math.floor(x);
function parseColor(input, fallback) {
  if (!input) return fallback;
  let s = String(input).trim();
  if (s.slice(0, 4).toLowerCase() === "var(") {
    const comma = s.indexOf(",");
    const close = s.lastIndexOf(")");
    if (comma < 0 || close < comma) return fallback;
    s = s.slice(comma + 1, close).trim();
  }
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) {
      let x = "";
      for (const c of h) x += c + c;
      h = x;
    }
    if (h.length === 6) h += "ff";
    if (h.length !== 8 || /[^0-9a-f]/i.test(h)) return fallback;
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      parseInt(h.slice(6, 8), 16) / 255
    ];
  }
  const m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i);
  if (!m) return fallback;
  const parts = m[2].split(/[\s,/]+/).filter((p2) => p2.length > 0);
  if (parts.length < 3) return fallback;
  const num = (t, scale) => {
    const v = parseFloat(t);
    if (!Number.isFinite(v)) return 0;
    return t.indexOf("%") >= 0 ? v / 100 * scale : v;
  };
  const alpha = parts.length > 3 ? clamp(num(parts[3], 1), 0, 1) : 1;
  if (m[1].toLowerCase().slice(0, 3) === "rgb") {
    return [
      clamp(num(parts[0], 255) / 255, 0, 1),
      clamp(num(parts[1], 255) / 255, 0, 1),
      clamp(num(parts[2], 255) / 255, 0, 1),
      alpha
    ];
  }
  const hh = fract(parseFloat(parts[0]) / 360);
  const sat = clamp(num(parts[1], 1), 0, 1);
  const li = clamp(num(parts[2], 1), 0, 1);
  const q = li < 0.5 ? li * (1 + sat) : li + sat - li * sat;
  const p = 2 * li - q;
  const chan = (t) => {
    let u = fract(t);
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [chan(hh + 1 / 3), chan(hh), chan(hh - 1 / 3), alpha];
}
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAG = `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uRes;
uniform vec2 uAtlas;
uniform vec2 uPtr;
uniform float uReach;
uniform vec3 uText;
uniform vec3 uShade;
uniform vec4 uAccent;
uniform vec2 uV0;
uniform vec2 uV1;
uniform vec2 uV2;
uniform float uHalf;

varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 blurRG(vec2 uv, float e) {
    vec4 sum = vec4(0.0);
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float th = radians(fi / 6.0 * 360.0);
        vec2 dir = vec2(cos(th), sin(th));
        vec2 off = dir * (hash(vec2(fi, uv.x + uv.y)) + e);
        sum += texture2D(uMap, uv + off * e);
    }
    return (sum / 6.0).rg;
}

vec2 segment(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
    return vec2(length(ap - ab * t), t);
}

float stroke(float d, float lw, float px) {
    return 1.0 - smoothstep(lw, lw + px, d);
}

float dashedLine(vec2 p, vec2 a, vec2 b, float lw, float px) {
    vec2 s = segment(p, a, b);
    float dash = step(0.5, fract(s.y * length(b - a) * 100.0));
    return stroke(s.x, lw, px) * dash;
}

float boxEdge(vec2 p, vec2 c, float h, float lw, float px) {
    vec2 q = abs(p - c) - vec2(h);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return stroke(abs(d), lw, px);
}

void main() {
    float aspect = uRes.x / uRes.y;

    vec2 E = (vUv * uRes - (uRes - uAtlas) * 0.5) / uAtlas;
    float inside = step(0.0, E.x) * step(E.x, 1.0) * step(0.0, E.y) * step(E.y, 1.0);
    vec2 safeUv = clamp(E, 0.0, 1.0);

    float b = clamp(1.0 - E.y * 3.5, 0.0, 1.0) * 0.008;
    vec2 soft = blurRG(safeUv, b);
    vec2 sharp = blurRG(safeUv, b * 0.1);

    float d = length((vUv - uPtr) / vec2(1.0, aspect));
    float k = 1.0 - pow(smoothstep(0.0, max(uReach, 1e-4), d), 3.0);

    float mask = mix(soft.r, sharp.g, k) * inside;
    vec3 fill = mix(uShade, uText, smoothstep(0.0, 1.0, E.y));

    vec2 P = vec2(vUv.x * aspect, vUv.y);
    float px = 1.0 / uRes.y;
    float lw = px * 0.2;
    float lines = max(
        max(dashedLine(P, uV0, uV1, lw, px), dashedLine(P, uV1, uV2, lw, px)),
        dashedLine(P, uV2, uV0, lw, px)
    );
    float boxes = max(
        max(boxEdge(P, uV0, uHalf, lw, px), boxEdge(P, uV1, uHalf, lw, px)),
        boxEdge(P, uV2, uHalf, lw, px)
    );
    float A = max(lines, boxes) * uAccent.a * (1.0 - vUv.y);

    vec4 card = vec4(fill * mask, mask);
    vec4 comp = vec4(uAccent.rgb * A, A) + card * (1.0 - A);

    gl_FragColor = comp * pow(clamp(E.y, 0.0, 1.0), 0.7);
}`;
function compile(gl, vs, fs2) {
  const make = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const p = gl.createProgram();
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs2));
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  return p;
}
function fontString(f, px) {
  return `${f.style} ${f.weight} ${px}px ${f.family}`;
}
function buildAtlas(text, f, drawFontPx, dpr) {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  const setFont = (ctx2, px) => {
    ctx2.font = fontString(f, px);
    try {
      if ("letterSpacing" in ctx2) {
        ;
        ctx2.letterSpacing = f.letterSpacing;
      }
    } catch (e) {
    }
  };
  const measure = (px) => {
    setFont(probe, px);
    const m2 = probe.measureText(text);
    const asc = m2.actualBoundingBoxAscent || px * 0.8;
    const desc = m2.actualBoundingBoxDescent || px * 0.22;
    return { w: Math.max(1, m2.width), asc, desc };
  };
  let fpx = Math.max(8, drawFontPx * dpr);
  let m = measure(fpx);
  let pad = fpx * 0.12;
  const over = Math.max(
    (m.w + pad * 2) / MAX_TEX,
    (m.asc + m.desc + pad * 2) / MAX_TEX
  );
  if (over > 1) {
    fpx = Math.max(8, fpx / over);
    m = measure(fpx);
    pad = fpx * 0.12;
  }
  const w = Math.max(1, Math.ceil(m.w + pad * 2));
  const h = Math.max(1, Math.ceil(m.asc + m.desc + pad * 2));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);
  setFont(ctx, fpx);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = "#ff0000";
  ctx.fillText(text, pad, pad + m.asc);
  const block = m.asc + m.desc;
  ctx.strokeStyle = "#00ff00";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, block * DOT_DIAMETER);
  ctx.setLineDash([0, Math.max(2, block * DOT_PITCH)]);
  ctx.strokeText(text, pad, pad + m.asc);
  const cssPerPx = drawFontPx / fpx;
  return { canvas, cssW: w * cssPerPx, cssH: h * cssPerPx };
}
const HANDLE_DEFAULTS = { size: 109, spread: 27, labels: true };
function __OriginkitBase_VectorWordmark(props) {
  const {
    text = "VECTOR",
    font = {
      fontFamily: "Inter",
      fontWeight: 800,
      fontSize: "200px",
      lineHeight: "1em",
      letterSpacing: "-0.02em",
      textAlign: "left"
    },
    background = "#000000",
    textColor = "#FFFFFF",
    shade = "#FFFFFF",
    accent = "#FFFFFF",
    reach = 290,
    speed = 50,
    damping = 60,
    handles,
    style
  } = props;
  const hg = { ...HANDLE_DEFAULTS, ...handles ?? {} };
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([null, null, null]);
  const rawSize = font?.fontSize;
  const fontSpec = {
    family: font?.fontFamily || "Inter, system-ui, sans-serif",
    weight: String(font?.fontWeight ?? 500),
    style: font?.fontStyle === "italic" ? "italic" : "normal",
    size: Math.max(8, parseFloat(String(rawSize ?? 240)) || 240),
    letterSpacing: String(font?.letterSpacing ?? "0px")
  };
  const accentRGBA = parseColor(accent, [1, 1, 1, 0.4]);
  const labelColor = `rgb(${Math.round(accentRGBA[0] * 255)}, ${Math.round(
    accentRGBA[1] * 255
  )}, ${Math.round(accentRGBA[2] * 255)})`;
  const live = useRef({
    text,
    fontSpec,
    textColor,
    shade,
    background,
    accentRGBA,
    reach,
    speed,
    damping,
    hg
  });
  live.current.text = text;
  live.current.fontSpec = fontSpec;
  live.current.textColor = textColor;
  live.current.shade = shade;
  live.current.background = background;
  live.current.accentRGBA = accentRGBA;
  live.current.reach = reach;
  live.current.speed = speed;
  live.current.damping = damping;
  live.current.hg = hg;
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const attrs = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance"
    };
    const gl = canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs);
    if (!gl) return;
    const isGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    const prog = compile(gl, VERT, FRAG);
    const U = {
      map: gl.getUniformLocation(prog, "uMap"),
      res: gl.getUniformLocation(prog, "uRes"),
      atlas: gl.getUniformLocation(prog, "uAtlas"),
      ptr: gl.getUniformLocation(prog, "uPtr"),
      reach: gl.getUniformLocation(prog, "uReach"),
      text: gl.getUniformLocation(prog, "uText"),
      shade: gl.getUniformLocation(prog, "uShade"),
      accent: gl.getUniformLocation(prog, "uAccent"),
      v0: gl.getUniformLocation(prog, "uV0"),
      v1: gl.getUniformLocation(prog, "uV1"),
      v2: gl.getUniformLocation(prog, "uV2"),
      half: gl.getUniformLocation(prog, "uHalf")
    };
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let alive = true;
    let boxW = Math.max(1, host.offsetWidth);
    let boxH = Math.max(1, host.offsetHeight);
    let boxDirty = true;
    let dpr = 1;
    let bufW = 0;
    let bufH = 0;
    let atlasRatioW = 1;
    let atlasRatioH = 1;
    let atlasKey = "";
    function drawFontPx() {
      return live.current.fontSpec.size * (boxW / REF_WIDTH);
    }
    function resize() {
      boxW = Math.max(1, host.offsetWidth);
      boxH = Math.max(1, host.offsetHeight);
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(boxW * dpr));
      const h = Math.max(1, Math.round(boxH * dpr));
      if (w === bufW && h === bufH) return;
      bufW = w;
      bufH = h;
      canvas.width = w;
      canvas.height = h;
    }
    function rebuildAtlas() {
      const L = live.current;
      const f = L.fontSpec;
      const px = Math.max(8, drawFontPx());
      const atlas = buildAtlas(L.text || " ", f, px, dpr);
      if (!atlas) return;
      atlasRatioW = Math.max(1e-4, atlas.cssW / px);
      atlasRatioH = Math.max(1e-4, atlas.cssH / px);
      if (typeof document !== "undefined" && document.fonts) {
        try {
          const probe = fontString(f, 64);
          if (!document.fonts.check(probe)) {
            const again = () => {
              if (alive) atlasKey = "";
            };
            document.fonts.load(probe, L.text).then(again, again);
          }
        } catch (e) {
        }
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        atlas.canvas
      );
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      const cw = atlas.canvas.width;
      const ch = atlas.canvas.height;
      const pot = (cw & cw - 1) === 0 && (ch & ch - 1) === 0;
      if (isGL2 || pot) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        );
      } else {
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR
        );
      }
    }
    const target = { x: -0.5, y: 0.5 };
    const eased = { x: -0.5, y: 0.5 };
    const cells = [];
    const verts = [];
    for (let i = 0; i < HANDLES; i += 1) {
      cells.push({ x: -0.5, y: 0.5 });
      verts.push({ x: -0.5, y: 0.5 });
    }
    let hasPointer = false;
    let sweepClock = 0;
    let driftT = 0;
    function snap(x, y, cw, ch) {
      const cx = Math.floor(x / cw);
      const cy = Math.floor(y / ch);
      const found = [];
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          const px = (cx + i + 0.5) * cw;
          const py = (cy + j + 0.5) * ch;
          found.push({ x: px, y: py, d: Math.hypot(px - x, py - y) });
        }
      }
      found.sort((a, b) => a.d - b.d);
      for (let i = 0; i < HANDLES; i += 1) {
        cells[i].x = found[i + 1].x;
        cells[i].y = found[i + 1].y;
      }
    }
    const onMove = (e) => {
      hasPointer = true;
      const r = host.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    };
    host.addEventListener("pointermove", onMove);
    let raf = 0;
    let last = 0;
    let running = true;
    function sync() {
      const L = live.current;
      if (boxDirty) {
        boxDirty = false;
        resize();
      }
      const f = L.fontSpec;
      const key = [
        L.text,
        f.family,
        f.weight,
        f.style,
        f.letterSpacing,
        dpr,
        Math.ceil(Math.max(8, drawFontPx()) / 64)
      ].join("|");
      if (key !== atlasKey) {
        atlasKey = key;
        rebuildAtlas();
      }
    }
    function step(dt) {
      const L = live.current;
      const rate = Math.max(0, L.speed) / SPEED_REF;
      const cw = Math.max(0.01, L.hg.spread / 100);
      const ch = cw * CELL_ASPECT;
      const aspect = boxW / boxH;
      if (!hasPointer) {
        const band = atlasRatioH * Math.max(8, drawFontPx()) / boxH;
        target.x += dt * SWEEP_RATE * rate;
        target.y = (1 - band) / 2 + SWEEP_BAND * band;
        if (target.x > 1.5) {
          target.x = -0.5;
          eased.x = -0.5;
        }
        sweepClock += dt;
        if (sweepClock >= RESNAP) {
          sweepClock = 0;
          snap(target.x * aspect, target.y, cw, ch);
        }
      } else {
        snap(target.x * aspect, target.y, cw, ch);
      }
      const damp = clamp(L.damping / 100 * DAMP_REF * dt, 0, 1);
      eased.x += (target.x - eased.x) * damp;
      eased.y += (target.y - eased.y) * damp;
      driftT += dt * rate;
      for (let i = 0; i < HANDLES; i += 1) {
        const c = cells[i];
        const sx = Math.round(c.x / cw - 0.5);
        const sy = Math.round(c.y / ch - 0.5);
        const h1 = fract(Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453);
        const h2 = fract(Math.sin(sx * 269.5 + sy * 183.3) * 43758.5453);
        verts[i].x = c.x + DRIFT_X * cw * Math.sin(driftT * DRIFT_RATE + h1 * Math.PI * 2);
        verts[i].y = c.y + DRIFT_Y * ch * Math.sin(driftT * DRIFT_RATE_Y + h2 * Math.PI * 2);
      }
    }
    function writeLabels() {
      const L = live.current;
      const aspect = boxW / boxH;
      const half = L.hg.size / 2;
      for (let i = 0; i < HANDLES; i += 1) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const bx = verts[i].x / aspect;
        const by = verts[i].y;
        const gx = Math.round(clamp(bx * 100, 0, 100));
        const gy = Math.round(clamp(by * 100, 0, 100));
        el.style.transform = `translate(${bx * boxW - half}px, ${(1 - by) * boxH - half}px)`;
        el.style.opacity = String(LABEL_MAX);
        el.textContent = `${gx}, ${gy}`;
      }
    }
    function draw() {
      const L = live.current;
      const tc = parseColor(L.textColor, [0.859, 0.918, 0.992, 1]);
      const sc = parseColor(L.shade, [0.035, 0.063, 0.102, 1]);
      const ac = L.accentRGBA;
      gl.viewport(0, 0, bufW, bufH);
      gl.useProgram(prog);
      gl.uniform1i(U.map, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(U.res, boxW, boxH);
      const px = Math.max(8, drawFontPx());
      gl.uniform2f(U.atlas, atlasRatioW * px, atlasRatioH * px);
      gl.uniform2f(U.ptr, eased.x, eased.y);
      gl.uniform1f(U.reach, Math.max(1, L.reach) / boxW);
      gl.uniform3f(U.text, tc[0], tc[1], tc[2]);
      gl.uniform3f(U.shade, sc[0], sc[1], sc[2]);
      gl.uniform4f(U.accent, ac[0], ac[1], ac[2], ac[3]);
      gl.uniform2f(U.v0, verts[0].x, verts[0].y);
      gl.uniform2f(U.v1, verts[1].x, verts[1].y);
      gl.uniform2f(U.v2, verts[2].x, verts[2].y);
      gl.uniform1f(U.half, L.hg.size / 2 / boxH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    const frame = (now) => {
      const dt = last ? Math.min(0.1, (now - last) / 1e3) : 0;
      last = now;
      sync();
      step(dt);
      writeLabels();
      draw();
      raf = requestAnimationFrame(frame);
    };
    const gate = () => {
      if (running && !document.hidden) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const ro = new ResizeObserver(() => {
      boxDirty = true;
    });
    ro.observe(host);
    document.addEventListener("visibilitychange", gate);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(
        () => {
          if (alive) atlasKey = "";
        },
        () => {
        }
      );
    }
    gate();
    return () => {
      alive = false;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", gate);
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: hostRef,
      style: {
        position: "relative",
        overflow: "hidden",
        background,
        minWidth: 1200,
        minHeight: 800,
        width: "100%",
        height: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          "canvas",
          {
            ref: canvasRef,
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block"
            }
          }
        ),
        hg.labels ? [0, 1, 2].map((i) => /* @__PURE__ */ jsx(
          "div",
          {
            ref: (el) => {
              labelRefs.current[i] = el;
            },
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              opacity: LABEL_MAX,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: labelColor
            }
          },
          i
        )) : null
      ]
    }
  );
}
const __originkitPresetProps = {
  "font": {
    "fontFamily": "Inter",
    "variant": "Extra Bold",
    "fontWeight": 800,
    "fontSize": "200px",
    "lineHeight": "1em",
    "letterSpacing": "-0.02em",
    "textAlign": "left"
  },
  "handles": {
    "size": 109,
    "labels": true,
    "spread": 27
  }
};
function VectorWordmark(props) {
  return /* @__PURE__ */ jsx(__OriginkitBase_VectorWordmark, { ...__originkitPresetProps, ...props });
}
function meta$5({}) {
  return [{
    title: "Novi Engineering Club"
  }, {
    name: "description",
    content: "Novi High School students building a drone and a model rocket from scratch."
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("main", {
    className: "home-page",
    children: [/* @__PURE__ */ jsxs("section", {
      className: "hero section-wrap",
      children: [/* @__PURE__ */ jsx("p", {
        className: "eyebrow",
        children: "NOVI HIGH SCHOOL · NOVI, MICHIGAN"
      }), /* @__PURE__ */ jsx("h1", {
        className: "sr-only",
        children: "Engineering Club"
      }), /* @__PURE__ */ jsxs("div", {
        className: "wordmark-stack",
        "aria-hidden": "true",
        children: [/* @__PURE__ */ jsx("div", {
          className: "wordmark-line",
          children: /* @__PURE__ */ jsx(VectorWordmark, {
            text: "ENGINEERING",
            font: {
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 700,
              fontSize: "154px",
              letterSpacing: "-0.06em"
            },
            background: "#050505",
            textColor: "#f1f2f3",
            shade: "#858a91",
            accent: "rgba(205, 210, 218, 0.3)",
            reach: 145,
            speed: 12,
            damping: 72,
            handles: {
              size: 76,
              spread: 29,
              labels: false
            },
            style: {
              minWidth: 0,
              minHeight: 0,
              height: "100%"
            }
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "wordmark-line",
          children: /* @__PURE__ */ jsx(VectorWordmark, {
            text: "CLUB",
            font: {
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 700,
              fontSize: "154px",
              letterSpacing: "-0.06em"
            },
            background: "#050505",
            textColor: "#f1f2f3",
            shade: "#858a91",
            accent: "rgba(205, 210, 218, 0.3)",
            reach: 145,
            speed: 12,
            damping: 72,
            handles: {
              size: 76,
              spread: 29,
              labels: false
            },
            style: {
              minWidth: 0,
              minHeight: 0,
              height: "100%"
            }
          })
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: "hero-intro",
        children: "A few Novi students, a lot of curiosity, and two things we’re building from scratch: a drone and a model rocket."
      }), /* @__PURE__ */ jsxs("div", {
        className: "hero-actions",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/#projects",
          className: "button button-light",
          children: ["See what we’re building ", /* @__PURE__ */ jsx("span", {
            "aria-hidden": "true",
            children: "↓"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/meetings",
          className: "text-link",
          children: ["Come by a meeting ", /* @__PURE__ */ jsx("span", {
            "aria-hidden": "true",
            children: "↗"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "hero-carousel",
        children: /* @__PURE__ */ jsx(BlurCarousel, {
          slides: [{
            title: "BUILD NIGHT"
          }, {
            title: "DRONE PROJECT"
          }, {
            title: "MODEL ROCKET"
          }],
          movement: "horizontal",
          cardWidth: 1120,
          cardHeight: 390,
          radius: 0,
          tilt: 5,
          blurAmount: 8,
          arrowColor: "#f1f2f3",
          arrowInactiveColor: "rgba(229, 230, 232, 0.6)",
          arrowSize: 22,
          showTitle: true,
          titleColor: "#e5e6e8",
          titleFont: {
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: ".12em"
          },
          titlePosition: {
            position: "topLeft",
            paddingLeft: 28,
            paddingTop: 26
          },
          style: {
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            height: "100%"
          }
        })
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "projects-section section-wrap",
      id: "projects",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "section-heading",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "eyebrow",
            children: "WHAT WE’RE WORKING ON"
          }), /* @__PURE__ */ jsxs("h2", {
            children: ["Built from", /* @__PURE__ */ jsx("br", {}), "the ground up."]
          })]
        }), /* @__PURE__ */ jsxs("p", {
          className: "section-aside",
          children: ["We’re learning as we go.", /* @__PURE__ */ jsx("br", {}), "These projects are still taking shape."]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "project-grid",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/drone",
          className: "project-card project-card-link",
          "aria-label": "View the drone project",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "image-placeholder project-image",
            children: [/* @__PURE__ */ jsx("span", {
              className: "placeholder-cross",
              children: "＋"
            }), /* @__PURE__ */ jsx("span", {
              children: "DRONE PHOTO"
            }), /* @__PURE__ */ jsx("small", {
              children: "Frame / electronics / first flight"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "project-meta",
            children: [/* @__PURE__ */ jsx("span", {
              children: "PROJECT 01"
            }), /* @__PURE__ */ jsx("span", {
              children: "IN PROGRESS"
            })]
          }), /* @__PURE__ */ jsx("h3", {
            children: "The drone"
          }), /* @__PURE__ */ jsxs("p", {
            children: ["Our own frame, flight controls, and a lot of testing. ", /* @__PURE__ */ jsx("span", {
              className: "copy-placeholder",
              children: "Add a short update from the team."
            })]
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/rocket",
          className: "project-card project-card-link",
          "aria-label": "View the model rocket project",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "image-placeholder project-image",
            children: [/* @__PURE__ */ jsx("span", {
              className: "placeholder-cross",
              children: "＋"
            }), /* @__PURE__ */ jsx("span", {
              children: "ROCKET PHOTO"
            }), /* @__PURE__ */ jsx("small", {
              children: "Sketch / build / launch"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "project-meta",
            children: [/* @__PURE__ */ jsx("span", {
              children: "PROJECT 02"
            }), /* @__PURE__ */ jsx("span", {
              children: "IN PROGRESS"
            })]
          }), /* @__PURE__ */ jsx("h3", {
            children: "The model rocket"
          }), /* @__PURE__ */ jsxs("p", {
            children: ["A student-built rocket, from the first sketch to launch day. ", /* @__PURE__ */ jsx("span", {
              className: "copy-placeholder",
              children: "Add a short update from the team."
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "join-section",
      children: /* @__PURE__ */ jsxs("div", {
        className: "section-wrap join-inner",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "eyebrow",
            children: "NO EXPERIENCE REQUIRED"
          }), /* @__PURE__ */ jsxs("h2", {
            children: ["Interested?", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
              children: "Come build with us."
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "join-info",
          children: [/* @__PURE__ */ jsx("p", {
            children: "We’re always glad to meet people who want to learn, make things, or lend a hand."
          }), /* @__PURE__ */ jsxs(Link, {
            to: "/meetings",
            className: "button button-outline",
            children: ["Meeting details ", /* @__PURE__ */ jsx("span", {
              "aria-hidden": "true",
              children: "↗"
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "sponsor-strip section-wrap",
      children: [/* @__PURE__ */ jsx("p", {
        className: "eyebrow",
        children: "THANKS TO OUR SUPPORTERS"
      }), /* @__PURE__ */ jsxs("div", {
        className: "sponsor-placeholders",
        children: [/* @__PURE__ */ jsx("span", {
          children: "SPONSOR LOGO"
        }), /* @__PURE__ */ jsx("span", {
          children: "COMMUNITY PARTNER"
        }), /* @__PURE__ */ jsx("span", {
          children: "ADD ANOTHER"
        })]
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function meta$4({}) {
  return [{
    title: "Drone Project | Novi Engineering Club"
  }, {
    name: "description",
    content: "Follow the Novi Engineering Club's student-built drone project."
  }];
}
const drone = UNSAFE_withComponentProps(function DronePage() {
  return /* @__PURE__ */ jsxs("main", {
    className: "detail-page section-wrap",
    children: [/* @__PURE__ */ jsxs("section", {
      className: "detail-copy",
      children: [/* @__PURE__ */ jsx("p", {
        className: "eyebrow",
        children: "PROJECT 01 · IN PROGRESS"
      }), /* @__PURE__ */ jsx("h1", {
        children: "The drone."
      }), /* @__PURE__ */ jsx("p", {
        className: "detail-lede",
        children: "Designed and built by Novi students, from the frame up."
      }), /* @__PURE__ */ jsx("p", {
        children: "We’re working through the design, electronics, and flight controls together. The goal is to understand every part of the build and learn through testing."
      }), /* @__PURE__ */ jsxs("div", {
        className: "detail-notes",
        children: [/* @__PURE__ */ jsx("p", {
          className: "eyebrow",
          children: "PROJECT NOTES"
        }), /* @__PURE__ */ jsx("p", {
          className: "detail-placeholder",
          children: "Add the current design, what the team is testing, and what you want to try next."
        })]
      }), /* @__PURE__ */ jsx(Link, {
        to: "/#projects",
        className: "detail-back",
        children: "← Back to all projects"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "image-placeholder detail-image",
      role: "img",
      "aria-label": "Placeholder for a photo of the drone project",
      children: [/* @__PURE__ */ jsx("span", {
        className: "placeholder-cross",
        children: "＋"
      }), /* @__PURE__ */ jsx("span", {
        children: "DRONE PHOTO"
      }), /* @__PURE__ */ jsx("small", {
        children: "Add a photo of the frame, electronics, or first flight"
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: drone,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3({}) {
  return [{
    title: "Model Rocket Project | Novi Engineering Club"
  }, {
    name: "description",
    content: "Follow the Novi Engineering Club's student-built model rocket project."
  }];
}
const rocket = UNSAFE_withComponentProps(function RocketPage() {
  return /* @__PURE__ */ jsxs("main", {
    className: "detail-page section-wrap",
    children: [/* @__PURE__ */ jsxs("section", {
      className: "detail-copy",
      children: [/* @__PURE__ */ jsx("p", {
        className: "eyebrow",
        children: "PROJECT 02 · IN PROGRESS"
      }), /* @__PURE__ */ jsx("h1", {
        children: "The model rocket."
      }), /* @__PURE__ */ jsx("p", {
        className: "detail-lede",
        children: "A student-built rocket, from the first sketch to launch day."
      }), /* @__PURE__ */ jsx("p", {
        children: "We’re learning about stability, structure, and how each part of a rocket works. The project will take shape through careful design, building, and testing."
      }), /* @__PURE__ */ jsxs("div", {
        className: "detail-notes",
        children: [/* @__PURE__ */ jsx("p", {
          className: "eyebrow",
          children: "PROJECT NOTES"
        }), /* @__PURE__ */ jsx("p", {
          className: "detail-placeholder",
          children: "Add the current design, the next build milestone, and launch updates here."
        })]
      }), /* @__PURE__ */ jsx(Link, {
        to: "/#projects",
        className: "detail-back",
        children: "← Back to all projects"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "image-placeholder detail-image",
      role: "img",
      "aria-label": "Placeholder for a photo of the model rocket project",
      children: [/* @__PURE__ */ jsx("span", {
        className: "placeholder-cross",
        children: "＋"
      }), /* @__PURE__ */ jsx("span", {
        children: "MODEL ROCKET PHOTO"
      }), /* @__PURE__ */ jsx("small", {
        children: "Add a sketch, build photo, or launch image"
      })]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rocket,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({}) {
  return [{
    title: "Sponsors | Novi Engineering Club"
  }, {
    name: "description",
    content: "Meet the people and organizations supporting Novi Engineering Club."
  }];
}
const sponsors = ["SPONSOR LOGO", "COMMUNITY PARTNER", "SCHOOL PARTNER", "ADD A SUPPORTER"];
const sponsors_default = UNSAFE_withComponentProps(function SponsorsPage() {
  return /* @__PURE__ */ jsxs("main", {
    className: "sponsors-page section-wrap",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "sponsors-heading",
      children: [/* @__PURE__ */ jsx("p", {
        className: "eyebrow",
        children: "NOVI ENGINEERING CLUB"
      }), /* @__PURE__ */ jsxs("h1", {
        children: ["Made possible", /* @__PURE__ */ jsx("br", {}), "together."]
      }), /* @__PURE__ */ jsx("p", {
        children: "We’re grateful to the people and organizations who help students turn ideas into real projects."
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "sponsor-grid",
      "aria-label": "Club sponsors and partners",
      children: sponsors.map((sponsor) => /* @__PURE__ */ jsxs("div", {
        className: "sponsor-card",
        children: [/* @__PURE__ */ jsx("span", {
          className: "sponsor-logo-placeholder",
          children: "＋"
        }), /* @__PURE__ */ jsx("span", {
          children: sponsor
        })]
      }, sponsor))
    }), /* @__PURE__ */ jsx("p", {
      className: "sponsor-thanks",
      children: "Add sponsor names, logos, and a short thank-you here."
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sponsors_default,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function MeetingWidget({ date, topic, minutesLink }) {
  return /* @__PURE__ */ jsxs("div", { className: "meeting-widget bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row justify-between items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "meeting-info text-center md:text-left mb-2 md:mb-0", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: date }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300", children: topic })
    ] }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: minutesLink,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300",
        children: "Meeting Minutes"
      }
    )
  ] });
}
function UpcomingMeetingWidget({
  date,
  topic,
  location
}) {
  return /* @__PURE__ */ jsx("div", { className: "meeting-widget bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row justify-between items-center", children: /* @__PURE__ */ jsxs("div", { className: "meeting-info text-center md:text-left mb-2 md:mb-0", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: date }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300", children: topic }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-400", children: [
      "Location: ",
      location
    ] })
  ] }) });
}
const upcomingMeetings$1 = [{ "date": "Tuesday, November 19, 2025", "topic": "Project TT-02 progress review.", "location": "Room 101" }, { "date": "Thursday, November 21, 2025", "topic": "Introduction to Project Fly.", "location": "Room 102" }];
const pastMeetings$1 = [{ "date": "November 12, 2025", "topic": "Brainstorming new project ideas", "minutesLink": "#" }, { "date": "November 5, 2025", "topic": "Introduction to the club and elections", "minutesLink": "#" }];
const meetingsData = {
  upcomingMeetings: upcomingMeetings$1,
  pastMeetings: pastMeetings$1
};
const {
  upcomingMeetings,
  pastMeetings
} = meetingsData;
function meta$1({}) {
  return [{
    title: "Meetings"
  }, {
    name: "description",
    content: "Novi Engineering Club Meeting Schedule"
  }];
}
const meetings = UNSAFE_withComponentProps(function Meetings() {
  return /* @__PURE__ */ jsxs("div", {
    className: "meetings-page",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-4xl font-bold mb-4",
      children: "Meetings"
    }), /* @__PURE__ */ jsx("p", {
      className: "mb-2",
      children: "We usually meet on Wednesdays in the iCube at the Novi Public Library, we also meet on fridays, in the CAT Lab"
    }), /* @__PURE__ */ jsx("h2", {
      className: "text-2xl font-semibold mb-2",
      children: "Upcoming Meetings"
    }), /* @__PURE__ */ jsx("div", {
      className: "upcoming-meetings-list",
      children: upcomingMeetings.map((meeting, index) => /* @__PURE__ */ jsx(UpcomingMeetingWidget, {
        date: meeting.date,
        topic: meeting.topic,
        location: meeting.location
      }, index))
    }), /* @__PURE__ */ jsx("h2", {
      className: "text-2xl font-semibold mb-2",
      children: "Past Meetings"
    }), /* @__PURE__ */ jsx("div", {
      className: "past-meetings-list",
      children: pastMeetings.map((meeting, index) => /* @__PURE__ */ jsx(MeetingWidget, {
        date: meeting.date,
        topic: meeting.topic,
        minutesLink: meeting.minutesLink
      }, index))
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: meetings,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function MarkdownEditor({
  initialContent = "",
  onSave,
  isSaving = false
}) {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(true);
  const editorRef = useRef(null);
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  const handleSave = () => {
    onSave(content);
  };
  const insertMarkdown = (before, after = "") => {
    if (!editorRef.current) return;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
      textarea.focus();
    }, 0);
  };
  return /* @__PURE__ */ jsxs("div", { className: "admin-editor flex flex-col gap-4 h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-editor-toolbar flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("# "),
          className: "admin-tool-button",
          title: "Heading 1",
          children: "H1"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("## "),
          className: "admin-tool-button",
          title: "Heading 2",
          children: "H2"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("**", "**"),
          className: "admin-tool-button",
          title: "Bold",
          children: /* @__PURE__ */ jsx("strong", { children: "B" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("_", "_"),
          className: "admin-tool-button",
          title: "Italic",
          children: /* @__PURE__ */ jsx("em", { children: "I" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("[", "](url)"),
          className: "admin-tool-button",
          title: "Link",
          children: "Link"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("![alt](", ")"),
          className: "admin-tool-button",
          title: "Image",
          children: "Image"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("- "),
          className: "admin-tool-button",
          title: "List",
          children: "List"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("```\n", "\n```"),
          className: "admin-tool-button",
          title: "Code Block",
          children: "Code"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => insertMarkdown("> "),
          className: "admin-tool-button",
          title: "Quote",
          children: "Quote"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowPreview(!showPreview),
            className: "admin-tool-button",
            children: showPreview ? "Hide Preview" : "Show Preview"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSave,
            disabled: isSaving,
            className: "admin-tool-button admin-button-primary",
            children: isSaving ? "Saving..." : "Save"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold mb-2", children: "Markdown Editor" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: editorRef,
            value: content,
            onChange: (e) => setContent(e.target.value),
            className: "admin-textarea",
            placeholder: "Enter your markdown content here..."
          }
        )
      ] }),
      showPreview && /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold mb-2", children: "Preview" }),
        /* @__PURE__ */ jsx("div", { className: "admin-preview flex-1 overflow-auto p-3 markdown", children: /* @__PURE__ */ jsx(
          ReactMarkdown,
          {
            remarkPlugins: [remarkGfm],
            components: {
              img: (props) => /* @__PURE__ */ jsx("img", { ...props, className: "max-w-full h-auto", alt: props.alt })
            },
            children: content
          }
        ) })
      ] })
    ] })
  ] });
}
async function loader$2({
  request
}) {
  try {
    const projectsPath = path.join(process.cwd(), "app/routes/projects");
    const projectDirs = await fs.readdir(projectsPath, {
      withFileTypes: true
    });
    const projects = await Promise.all(projectDirs.filter((dirent) => dirent.isDirectory()).map(async (dirent) => {
      const mdPath = path.join(projectsPath, dirent.name, `${dirent.name}.md`);
      try {
        const content = await fs.readFile(mdPath, "utf-8");
        return {
          name: dirent.name,
          content
        };
      } catch {
        return {
          name: dirent.name,
          content: ""
        };
      }
    }));
    return {
      projects
    };
  } catch (error) {
    console.error("Error reading projects:", error);
    return {
      projects: []
    };
  }
}
async function action({
  request
}) {
  if (request.method !== "POST") {
    return {
      error: "Method not allowed"
    };
  }
  try {
    const formData = await request.formData();
    const projectName = formData.get("projectName");
    const content = formData.get("content");
    const _action = formData.get("_action");
    if (!projectName) {
      return {
        error: "Project name is required"
      };
    }
    const projectsPath = path.join(process.cwd(), "app/routes/projects");
    const projectDirPath = path.join(projectsPath, projectName);
    const mdFilePath = path.join(projectDirPath, `${projectName}.md`);
    if (_action === "delete") {
      try {
        await fs.rm(projectDirPath, {
          recursive: true,
          force: true
        });
        return {
          success: true,
          message: `Project ${projectName} deleted`
        };
      } catch (error) {
        return {
          error: `Failed to delete project: ${error}`
        };
      }
    }
    if (!content) {
      return {
        error: "Content is required"
      };
    }
    try {
      await fs.mkdir(projectDirPath, {
        recursive: true
      });
    } catch (error) {
      return {
        error: `Failed to create project directory: ${error}`
      };
    }
    try {
      await fs.writeFile(mdFilePath, content, "utf-8");
      return {
        success: true,
        message: `Project ${projectName} saved successfully`,
        projectName
      };
    } catch (error) {
      return {
        error: `Failed to write markdown file: ${error}`
      };
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      error: "Failed to process request"
    };
  }
}
const admin = UNSAFE_withComponentProps(function AdminPanel() {
  const {
    projects
  } = useLoaderData();
  const navigation = useNavigation();
  const isInitialized = useRef(false);
  const getInitialProject = () => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedProject");
      if (stored && projects.find((p) => p.name === stored)) {
        return stored;
      }
    }
    return projects.length > 0 ? projects[0].name : null;
  };
  const [selectedProject, setSelectedProject] = useState(getInitialProject);
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    if (selectedProject && typeof window !== "undefined") {
      sessionStorage.setItem("selectedProject", selectedProject);
    }
  }, [selectedProject]);
  useEffect(() => {
    if (projects.length > 0 && !isInitialized.current && !selectedProject) {
      setSelectedProject(projects[0].name);
      isInitialized.current = true;
    }
  }, [projects, selectedProject]);
  const currentProject = projects.find((p) => p.name === selectedProject);
  const isSaving = navigation.state === "submitting";
  useEffect(() => {
    if (navigation.state === "idle") {
      setNotification({
        message: "Project saved successfully!",
        type: "success"
      });
      setTimeout(() => setNotification(null), 3e3);
    }
  }, [navigation.state]);
  const handleSaveProject = (content) => {
    if (!selectedProject) return;
    const form = document.getElementById(`project-form-${selectedProject}`);
    if (form) {
      const contentInput = form.querySelector('textarea[name="content"]');
      if (contentInput) {
        contentInput.value = content;
      }
      form.submit();
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "admin-panel flex",
    children: [/* @__PURE__ */ jsx("div", {
      className: "admin-sidebar overflow-y-auto",
      children: /* @__PURE__ */ jsxs("div", {
        className: "admin-sidebar-inner",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "admin-title",
          children: "Admin Panel"
        }), /* @__PURE__ */ jsxs("div", {
          className: "mb-8",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "admin-section-label",
            children: "Projects"
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-2",
            children: projects.map((project) => /* @__PURE__ */ jsx("button", {
              onClick: () => {
                setSelectedProject(project.name);
                setShowNewProjectForm(false);
              },
              className: `admin-project-button ${selectedProject === project.name ? "is-selected" : ""}`,
              children: project.name
            }, project.name))
          })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setShowNewProjectForm(true),
          className: "admin-new-project",
          children: "+ New Project"
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "admin-main flex-1 flex flex-col overflow-hidden",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "admin-header",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "admin-page-heading",
          children: showNewProjectForm ? "Create New Project" : `Edit: ${selectedProject || "Select a project"}`
        }), notification && /* @__PURE__ */ jsx("div", {
          className: `admin-notification ${notification.type === "success" ? "is-success" : "is-error"}`,
          children: notification.message
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "admin-body flex-1 overflow-hidden",
        children: showNewProjectForm ? (
          // New Project Form
          /* @__PURE__ */ jsxs(Form, {
            method: "post",
            id: "new-project-form",
            className: "admin-form flex flex-col gap-4 h-full",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "admin-label",
                children: "Project Name"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                name: "projectName",
                value: newProjectName,
                onChange: (e) => setNewProjectName(e.target.value),
                placeholder: "e.g., my-awesome-project",
                className: "admin-input"
              }), /* @__PURE__ */ jsx("p", {
                className: "admin-hint",
                children: "This will be used as the folder and markdown filename"
              })]
            }), /* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "content",
              value: "# New Project\\n\\nAdd your content here..."
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex gap-3",
              children: [/* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => {
                  setShowNewProjectForm(false);
                  setNewProjectName("");
                },
                className: "admin-button admin-button-secondary",
                children: "Cancel"
              }), /* @__PURE__ */ jsx("button", {
                type: "submit",
                disabled: isSaving || !newProjectName.trim(),
                className: "admin-button admin-button-primary",
                children: isSaving ? "Creating..." : "Create Project"
              })]
            })]
          })
        ) : currentProject ? (
          // Edit Project Form
          /* @__PURE__ */ jsxs(Form, {
            method: "post",
            id: `project-form-${selectedProject}`,
            className: "admin-form flex flex-col gap-4 h-full",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "projectName",
              value: selectedProject || ""
            }), /* @__PURE__ */ jsx("textarea", {
              name: "content",
              defaultValue: currentProject.content,
              className: "hidden"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex-1 overflow-hidden",
              children: /* @__PURE__ */ jsx(MarkdownEditor, {
                initialContent: currentProject.content,
                onSave: handleSaveProject,
                isSaving
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "flex justify-end",
              children: /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => {
                  if (confirm(`Are you sure you want to delete the project "${selectedProject}"? This action cannot be undone.`)) {
                    const deleteForm = document.createElement("form");
                    deleteForm.method = "POST";
                    deleteForm.innerHTML = `
                        <input type="hidden" name="projectName" value="${selectedProject}" />
                        <input type="hidden" name="_action" value="delete" />
                        <input type="hidden" name="content" value="" />
                      `;
                    document.body.appendChild(deleteForm);
                    deleteForm.submit();
                    document.body.removeChild(deleteForm);
                  }
                },
                className: "admin-button admin-button-danger",
                children: "Delete Project"
              })
            })]
          }, selectedProject)
        ) : /* @__PURE__ */ jsx("div", {
          className: "flex items-center justify-center h-full text-center",
          children: /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "admin-empty-title",
              children: "No project selected"
            }), /* @__PURE__ */ jsx("p", {
              className: "admin-empty-copy",
              children: "Select a project from the sidebar or create a new one"
            }), /* @__PURE__ */ jsx("button", {
              onClick: () => setShowNewProjectForm(true),
              className: "admin-button admin-button-primary",
              children: "Create Your First Project"
            })]
          })
        })
      })]
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: admin,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  params
}) {
  const projectName = params.projectName;
  if (!projectName) {
    throw new Response("Not Found", {
      status: 404
    });
  }
  const projectDirPath = path.join(process.cwd(), `app/routes/projects/${projectName}`);
  try {
    await fs.access(projectDirPath);
  } catch (error) {
    throw new Response("Not Found", {
      status: 404
    });
  }
  const markdownFilePath = path.join(projectDirPath, `${projectName}.md`);
  let markdownContent = "";
  try {
    markdownContent = await fs.readFile(markdownFilePath, "utf-8");
  } catch (error) {
    throw new Response("Not Found", {
      status: 404
    });
  }
  return {
    projectName,
    title: `Project ${projectName.toUpperCase()}`,
    markdownContent
  };
}
const meta = ({
  data
}) => {
  return [{
    title: data?.title || "Project Not Found"
  }];
};
const projects_$projectName = UNSAFE_withComponentProps(function ProjectPage() {
  const {
    projectName,
    markdownContent
  } = useLoaderData();
  const components = {
    img: (props) => {
      const src = props.src.startsWith("./") ? `/projects/${projectName}/image/${props.src.substring(2)}` : props.src;
      return /* @__PURE__ */ jsx("img", {
        ...props,
        src,
        className: "w-full h-auto"
      });
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: "p-8 markdown",
    children: /* @__PURE__ */ jsx(ReactMarkdown, {
      components,
      remarkPlugins: [remarkGfm],
      children: markdownContent
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: projects_$projectName,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const projectName = params.projectName;
  const imageName = params.imageName;
  if (!projectName || !imageName) {
    throw new Response("Not Found", {
      status: 404
    });
  }
  const imagePath = path.join(process.cwd(), `app/routes/projects/${projectName}/${imageName}`);
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const contentType = getImageContentType(imageName);
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType
      }
    });
  } catch (error) {
    console.error(`Error serving image ${imageName} for project ${projectName}:`, error);
    throw new Response("Not Found", {
      status: 404
    });
  }
}
function getImageContentType(imageName) {
  const ext = path.extname(imageName).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B0he7NFv.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Dyl4hQhz.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": ["/assets/root-C5lyDaR0.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DAbXvUGc.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/drone": { "id": "routes/drone", "parentId": "root", "path": "drone", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/drone-CAvrrNyJ.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/rocket": { "id": "routes/rocket", "parentId": "root", "path": "rocket", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/rocket-D0j-AOfV.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/sponsors": { "id": "routes/sponsors", "parentId": "root", "path": "sponsors", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/sponsors-B02mBFtq.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/meetings": { "id": "routes/meetings", "parentId": "root", "path": "meetings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/meetings-C17HmvIz.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/admin-BvtnN8do.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js", "/assets/index-BLlCpfXk.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/projects.$projectName": { "id": "routes/projects.$projectName", "parentId": "root", "path": "projects/:projectName", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/projects._projectName-Bx74kznX.js", "imports": ["/assets/chunk-UIGDSWPH-DOTS8KH7.js", "/assets/index-BLlCpfXk.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/projects.$projectName.image.$imageName": { "id": "routes/projects.$projectName.image.$imageName", "parentId": "root", "path": "projects/:projectName/image/:imageName", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/projects._projectName.image._imageName-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-44314d9e.js", "version": "44314d9e", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/drone": {
    id: "routes/drone",
    parentId: "root",
    path: "drone",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/rocket": {
    id: "routes/rocket",
    parentId: "root",
    path: "rocket",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/sponsors": {
    id: "routes/sponsors",
    parentId: "root",
    path: "sponsors",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/meetings": {
    id: "routes/meetings",
    parentId: "root",
    path: "meetings",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/projects.$projectName": {
    id: "routes/projects.$projectName",
    parentId: "root",
    path: "projects/:projectName",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/projects.$projectName.image.$imageName": {
    id: "routes/projects.$projectName.image.$imageName",
    parentId: "root",
    path: "projects/:projectName/image/:imageName",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
