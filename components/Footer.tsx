"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-16 px-6 border-t border-border/50 bg-background/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">
              Infinite<span className="text-gradient">Expo</span>
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <a
              href="https://infinitelearning.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Infinite Learning
            </a>
            <Link href="/#about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
          </div>
        </div>

        {/* Separator */}
        <div className="my-8 h-px bg-border/50" />

        {/* Info & Admin Portals */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div>
              <p>© {currentYear} InfiniteExpo. Built with 💜 by Infinite Learning Indonesia.</p>
              <p className="mt-1 opacity-70">Showcasing the future of technology and digital innovation.</p>
            </div>
            <a
              href="https://infinitelearning.id"
              target="_blank"
              rel="noopener noreferrer"
              title="Infinite Learning Indonesia"
              className="flex-shrink-0 block hover:opacity-80 transition-opacity duration-200"
            >
              <img src="/image.png" alt="Infinite Learning" className="h-14 w-auto object-contain" />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-foreground transition-colors font-medium">
              Admin Portal
            </Link>
            <Link href="/admin/login" className="hover:text-foreground transition-colors font-medium">
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
