'use client';

import Link from 'next/link';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Zap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const { isSignedIn } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl hidden sm:block">
              TipBTC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hover:bg-primary/5">Dashboard</Button>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-full hover:scale-110 transition-transform duration-200"
                    }
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="shadow-md hover:shadow-lg transition-shadow">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </SignInButton>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-primary/5 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden fixed inset-x-0 bg-background/80 backdrop-blur-md border-b transition-all duration-300 ease-in-out",
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0"
        )}>
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {isSignedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-primary/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="p-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 rounded-full"
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full shadow-md hover:shadow-lg transition-shadow">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 