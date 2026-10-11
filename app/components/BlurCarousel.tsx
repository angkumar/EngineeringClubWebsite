// Blur Carousel — Originkit

import {
    useState,
    useEffect,
    useCallback,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
} from "react"
const useIsStaticRenderer = () => false

interface Slide {
    image?: { src?: string; srcSet?: string; alt?: string }
    title?: string
}

type Movement = "horizontal" | "vertical"

interface BlurCarouselProps {
    slides?: Slide[]
    movement?: Movement
    cardWidth?: number
    cardHeight?: number
    radius?: number
    tilt?: number
    blurAmount?: number
    arrowColor?: string
    arrowInactiveColor?: string
    arrowSize?: number
    autoplay?: boolean
    transition?: any
    showTitle?: boolean
    titleFont?: CSSProperties
    titleColor?: string
    titlePosition?: {
        position?: TitleCorner
        paddingLeft?: number
        paddingRight?: number
        paddingTop?: number
        paddingBottom?: number
    }
    style?: CSSProperties
}

type TitleCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

const DEFAULT_SLIDES: Slide[] = [
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/316d1761-fd79-4ca9-b8d4-f2bb20521a00/w=800",
        },
        title: "For Sitting\nMetal\nMinimal",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/aeaa0756-9647-4f6c-d900-204bd25e4a00/w=800",
        },
        title: "For Living\nConcrete\nForm",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800",
        },
        title: "For Working\nSteel\nClean",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800",
        },
        title: "For Resting\nLinen\nQuiet",
    },
]

const PERSPECTIVE = 1100
const PRESS_SCALE = 0.965
const PRESS_SHIFT = 6
const BLUR_WIDTH = 42
const OVERLAY_DARKEN = 0.35

function cssTransition(t: any): { dur: number; ease: string } {
    const dur = t && typeof t.duration === "number" ? t.duration : 0.55
    let ease = "cubic-bezier(0.2, 0.8, 0.2, 1)"
    const e = t?.ease
    if (Array.isArray(e) && e.length === 4) {
        ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`
    } else if (typeof e === "string") {
        const map: Record<string, string> = {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
        }
        ease = map[e] || "ease"
    }
    return { dur, ease }
}

function __OriginkitBase_BlurCarousel(props: BlurCarouselProps) {
    props = { ...COMPONENT_DEFAULTS, ...props }
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
        style,
    } = props

    const tp = titlePosition || {}
    const corner: TitleCorner = tp.position || "topLeft"
    const isTop = corner === "topLeft" || corner === "topRight"
    const isRight = corner === "topRight" || corner === "bottomRight"
    const padLeft = tp.paddingLeft ?? 26
    const padRight = tp.paddingRight ?? 26
    const padTop = tp.paddingTop ?? 24
    const padBottom = tp.paddingBottom ?? 24

    const isStatic = useIsStaticRenderer()
    const list = slides && slides.length ? slides : DEFAULT_SLIDES
    const n = list.length
    const vertical = movement === "vertical"

    const loop = true
    const [index, setIndex] = useState(0)
    const [pressDir, setPressDir] = useState(0)
    const [hoverSide, setHoverSide] = useState(0)

    useEffect(() => {
        setIndex((i) => Math.max(0, Math.min(n - 1, i)))
    }, [n])

    const go = useCallback(
        (dir: number) => {
            setIndex((i) => {
                if (loop) return (((i + dir) % n) + n) % n
                return Math.max(0, Math.min(n - 1, i + dir))
            })
        },
        [n]
    )

    const delay =
        transition && typeof transition.delay === "number"
            ? transition.delay
            : 4
    useEffect(() => {
        if (isStatic || !autoplay || n < 2) return
        const ms = Math.max(0.3, delay) * 1000
        const id = window.setInterval(() => go(1), ms)
        return () => window.clearInterval(id)
    }, [isStatic, autoplay, delay, n, go])

    const onArrowDown = (dir: number) => (e: ReactPointerEvent) => {
        if (isStatic || autoplay) return
        e.preventDefault()
        e.currentTarget.setPointerCapture?.(e.pointerId)
        setHoverSide(dir)
        setPressDir(dir)
    }
    const onArrowUp = (dir: number) => (e: ReactPointerEvent) => {
        if (isStatic || autoplay) return
        e.currentTarget.releasePointerCapture?.(e.pointerId)
        go(dir)
        setPressDir(0)
    }
    const onArrowCancel = () => setPressDir(0)
    const onArrowEnter = (dir: number) => () => {
        if (!isStatic && !autoplay) setHoverSide(dir)
    }
    const onArrowLeave = () => {
        if (!isStatic) setHoverSide(0)
    }

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const next = vertical ? "ArrowDown" : "ArrowRight"
            const prev = vertical ? "ArrowUp" : "ArrowLeft"
            if (e.key === next) {
                e.preventDefault()
                go(1)
            } else if (e.key === prev) {
                e.preventDefault()
                go(-1)
            }
        },
        [go, vertical]
    )

    const { dur, ease } = cssTransition(transition)
    const tiltTransition = `transform ${dur}s ${ease}`
    const fadeTransition = `opacity ${dur}s ease`

    const radiusPx =
        (Math.max(0, Math.min(20, radius)) / 20) *
        (Math.min(cardWidth, cardHeight) / 2)

    const rootStyle: CSSProperties = {
        ...(style || {}),
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
        WebkitTapHighlightColor: "transparent",
    }

    const frameStyle: CSSProperties = {
        position: "relative",
        width: `min(100%, ${cardWidth}px)`,
        height: "100%",
        borderRadius: radiusPx,

        clipPath: `inset(0 round ${radiusPx}px)`,
        overflow: "hidden",
        background: "#0c0c0c",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        transform: vertical
            ? `translateY(${pressDir * PRESS_SHIFT}px) rotateX(${-pressDir * tilt}deg) scale(${pressDir !== 0 ? PRESS_SCALE : 1})`
            : `translateX(${pressDir * PRESS_SHIFT}px) rotateY(${pressDir * tilt}deg) scale(${pressDir !== 0 ? PRESS_SCALE : 1})`,
        transition: tiltTransition,
    }

    const titleStyle = (i: number): CSSProperties => ({
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
        ...(titleFont || {}),
    })

    const arrowWrap = (dir: number): CSSProperties => {
        const base: CSSProperties = {
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
            touchAction: "none",
        }
        if (vertical) {
            return {
                ...base,
                left: "50%",
                [dir < 0 ? "top" : "bottom"]: 14,
                transform: "translateX(-50%)",
            }
        }
        return {
            ...base,
            top: "50%",
            [dir < 0 ? "left" : "right"]: 14,
            transform: "translateY(-50%)",
        }
    }

    const blurOverlay = (dir: number): CSSProperties => {
        const common: CSSProperties = {
            position: "absolute",
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            opacity: hoverSide === dir ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
            zIndex: 3,
        }
        if (vertical) {
            const grad =
                dir < 0
                    ? "linear-gradient(to bottom, #000 0%, transparent 100%)"
                    : "linear-gradient(to top, #000 0%, transparent 100%)"
            return {
                ...common,
                left: 0,
                right: 0,
                [dir < 0 ? "top" : "bottom"]: 0,
                height: `${BLUR_WIDTH}%`,
                maskImage: grad,
                WebkitMaskImage: grad,
            }
        }
        const grad =
            dir < 0
                ? "linear-gradient(to right, #000 0%, transparent 100%)"
                : "linear-gradient(to left, #000 0%, transparent 100%)"
        return {
            ...common,
            top: 0,
            bottom: 0,
            [dir < 0 ? "left" : "right"]: 0,
            width: `${BLUR_WIDTH}%`,
            maskImage: grad,
            WebkitMaskImage: grad,
        }
    }

    return (
        <div
            style={rootStyle}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            onKeyDown={isStatic ? undefined : onKeyDown}
        >
            <div style={frameStyle}>
                {}
                {list.map((s, i) =>
                    s.image?.src ? (
                        <img
                            key={i}
                            src={s.image.src}
                            srcSet={s.image.srcSet}
                            alt={s.image.alt || s.title || ""}
                            draggable={false}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                opacity: i === index ? 1 : 0,
                                transition: fadeTransition,
                            }}
                        />
                    ) : (
                        <div
                            key={i}
                            role="img"
                            aria-label={`${s.title || "Club"} photo placeholder`}
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "grid",
                                placeItems: "center",
                                background: i % 2 === 0
                                    ? "linear-gradient(145deg, #191a1d, #09090a 72%)"
                                    : "linear-gradient(35deg, #111214, #202124 65%, #0b0b0c)",
                                opacity: i === index ? 1 : 0,
                                transition: fadeTransition,
                            }}
                        >
                            <span style={{ color: "#6f7379", fontSize: 10, letterSpacing: ".14em" }}>ADD PHOTO</span>
                        </div>
                    )
                )}

                {}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(180deg, rgba(0,0,0,${OVERLAY_DARKEN}) 0%, rgba(0,0,0,0) 42%)`,
                        pointerEvents: "none",
                    }}
                />

                {}
                {showTitle &&
                    list.map((s, i) => (
                        <div key={i} style={titleStyle(i)}>
                            {s.title}
                        </div>
                    ))}

                {}
                <div style={blurOverlay(-1)} />
                <div style={blurOverlay(1)} />

                {}
                <div
                    role="button"
                    aria-label="Previous slide"
                    style={arrowWrap(-1)}
                    onPointerDown={onArrowDown(-1)}
                    onPointerUp={onArrowUp(-1)}
                    onPointerCancel={onArrowCancel}
                    onPointerEnter={onArrowEnter(-1)}
                    onPointerLeave={onArrowLeave}
                >
                    <svg
                        width={arrowSize}
                        height={arrowSize}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline
                            points={
                                vertical ? "6 15 12 9 18 15" : "15 18 9 12 15 6"
                            }
                        />
                    </svg>
                </div>
                <div
                    role="button"
                    aria-label="Next slide"
                    style={arrowWrap(1)}
                    onPointerDown={onArrowDown(1)}
                    onPointerUp={onArrowUp(1)}
                    onPointerCancel={onArrowCancel}
                    onPointerEnter={onArrowEnter(1)}
                    onPointerLeave={onArrowLeave}
                >
                    <svg
                        width={arrowSize}
                        height={arrowSize}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline
                            points={
                                vertical ? "6 9 12 15 18 9" : "9 18 15 12 9 6"
                            }
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
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
        ease: "linear",
    },
    showTitle: false,
    titleFont: {
        variant: "Bold",
        fontSize: "30px",
        letterSpacing: "-0.01em",
        lineHeight: "1.12em",
    },
    titleColor: "#ffffff",
    titlePosition: {
        position: "topLeft",
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 24,
        paddingBottom: 24,
    },
}

const __originkitPresetProps = {
  "movement": "horizontal",
  "cardWidth": 1200,
  "tilt": 9,
  "blurAmount": 10
};

export default function BlurCarousel(props: Record<string, unknown>) {
  return <__OriginkitBase_BlurCarousel {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
