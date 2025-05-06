"use client"

import { Button } from "components/ui/button"
import { Download } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(-100)
  const [hasArrived, setHasArrived] = useState(false)
  const animationRef = useRef<number | null>(null)
  const speed = 0.7
  const motorcycleWidth = 880
  const color = "#00A651"

  useEffect(() => {
    const animate = () => {
      setPosition(prevPos => {
        let newPos = prevPos + speed


        if (newPos > window.innerWidth - motorcycleWidth) {
          newPos = window.innerWidth - motorcycleWidth
          setHasArrived(true)
          return newPos
        }

        return newPos
      })

      if (!hasArrived) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [hasArrived])

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden t-10"
      style={{
        height: "100vh",
        background: "radial-gradient(circle at center, white 0%,rgb(224, 245, 235) 40%,rgb(206, 226, 216) 70%,rgb(167, 211, 196) 100%)",
      }}
    >
      <div className="container relative z-20 mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Join <span className="text-[#8C001A]">20,000+</span> Motorists Trusting MOTERGNA Daily!
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          Saving drivers time and money – <span className="text-[#00A651]">200+</span> customers served every day.
        </p>
        <div className="flex justify-center">
          <Button
            className="h-12 bg-[#8C001A] px-8 text-lg hover:bg-[#8C001A]/90"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/app/app-release.apk'; 
              link.download = 'MoteregnaApp.apk'; 
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="mr-2 h-5 w-5" /> Download Now
          </Button>
        </div>
        <div className="relative mt-16 h-20">
          <div
            className="absolute top-0"
            style={{
              left: `${position}px`,
              transition: 'left 0.7s linear',
            }}
          >
            <Motorcycle color={color} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Motorcycle({ color }: { color: string }) {
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70,30 L60,20 L40,20 L30,30 L20,30 C15,30 15,35 20,35 L25,35 C25,42 31,48 38,48 C45,48 51,42 51,35 L65,35 C65,42 71,48 78,48 C85,48 91,42 91,35 L95,35 C95,30 90,30 90,30 L70,30 Z"
        fill={color}
      />
      <circle cx="38" cy="38" r="10" stroke="black" strokeWidth="2" fill="none" />
      <circle cx="78" cy="38" r="10" stroke="black" strokeWidth="2" fill="none" />
      <path d="M30,30 L25,15 L35,15" stroke="black" strokeWidth="2" fill="none" />
      <circle cx="50" cy="15" r="5" fill="black" />
      <path d="M50,20 L45,30 L55,30 Z" fill="black" />
      <path d="M45,30 L40,35" stroke="black" strokeWidth="2" />
      <path d="M55,30 L60,25" stroke="black" strokeWidth="2" />
      <path d="M95,35 L105,35 M105,30 L115,30 M105,40 L115,40" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  )
}