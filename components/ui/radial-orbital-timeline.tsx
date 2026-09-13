"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/theme-context";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 190;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  return (
    <div
      className="w-full min-h-[460px] h-[58vh] max-h-[580px] flex flex-col items-center justify-center bg-transparent overflow-hidden relative select-none"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Circle - Strictly Pure White in dark mode, Pure Black in light mode */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center z-10 pointer-events-none transition-colors duration-300 shadow-xl shadow-black/10 dark:shadow-white/10">
            {/* Pulsing ring matching theme (white/black) */}
            <div className="absolute w-20 h-20 rounded-full border border-black/30 dark:border-white/40 animate-ping opacity-60"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-black/15 dark:border-white/20 animate-ping opacity-40"
              style={{ animationDelay: "0.5s" }}
            ></div>
            {/* Center core dot */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-black transition-colors duration-300"></div>
          </div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node Icon Circle: No Background, Theme-Adaptive, Crisp Minimalist */}
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center bg-transparent
                  ${
                    isExpanded
                      ? isDark
                        ? "text-white border-white shadow-lg shadow-white/20"
                        : "text-black border-black shadow-lg shadow-black/20"
                      : isRelated
                      ? isDark
                        ? "text-white border-white/90 animate-pulse"
                        : "text-black border-black/90 animate-pulse"
                      : isDark
                      ? "text-zinc-200 border-white/40 hover:border-white hover:text-white"
                      : "text-zinc-800 border-black/40 hover:border-black hover:text-black"
                  }
                  border-2 transition-all duration-300 transform
                  ${isExpanded ? "scale-125 sm:scale-150" : ""}
                `}
                >
                  <Icon size={16} />
                </div>

                {/* Node Title Label */}
                <div
                  className={`
                  absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[11px] sm:text-xs font-medium tracking-wide text-center
                  transition-all duration-300
                  ${
                    isExpanded
                      ? isDark
                        ? "text-white scale-110 sm:scale-125 font-semibold"
                        : "text-black scale-110 sm:scale-125 font-semibold"
                      : isDark
                      ? "text-zinc-300"
                      : "text-zinc-700"
                  }
                `}
                >
                  {item.title}
                </div>

                {/* Popover Card */}
                {isExpanded && (
                  <Card
                    className={`absolute top-20 left-1/2 -translate-x-1/2 w-72 sm:w-80 overflow-visible z-[250] shadow-2xl transition-colors ${
                      isDark
                        ? "bg-black border-zinc-800 text-white shadow-black/80"
                        : "bg-white border-zinc-200 text-black shadow-zinc-400/40"
                    }`}
                  >
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 ${
                        isDark ? "bg-white/40" : "bg-black/40"
                      }`}
                    ></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs font-mono uppercase tracking-wider ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span
                          className={`text-xs font-mono ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {item.date}
                        </span>
                      </div>
                      <CardTitle
                        className={`text-sm mt-1 font-semibold ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={`text-xs ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      <p className="leading-relaxed">{item.content}</p>

                      {item.relatedIds.length > 0 && (
                        <div
                          className={`mt-4 pt-3 border-t ${
                            isDark ? "border-zinc-800" : "border-zinc-200"
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <Link
                              size={10}
                              className={`mr-1 ${
                                isDark ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            />
                            <h4
                              className={`text-[10px] uppercase tracking-wider font-mono font-medium ${
                                isDark ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              Connected Phases
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <button
                                  key={relatedId}
                                  type="button"
                                  className={`flex items-center text-[11px] font-mono transition-colors cursor-pointer hover:underline ${
                                    isDark
                                      ? "text-zinc-300 hover:text-white"
                                      : "text-zinc-700 hover:text-black"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  <span>{relatedItem?.title}</span>
                                  <ArrowRight
                                    size={10}
                                    className={`ml-1 ${
                                      isDark
                                        ? "text-zinc-400"
                                        : "text-zinc-500"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
