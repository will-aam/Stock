"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Package,
  Menu,
  Home,
  Settings,
  Info,
  Mail,
  LogIn,
  Crown,
  Trash2,
} from "lucide-react";

interface NavigationProps {
  showClearButton?: boolean;
  onClearData?: () => void;
}

export function Navigation({
  showClearButton = false,
  onClearData,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      description: "Página inicial do Stock",
    },
    {
      href: "/system",
      label: "Sistema",
      icon: Settings,
      description: "Módulos do sistema",
      badge: "Premium",
    },
    {
      href: "/about",
      label: "Sobre",
      icon: Info,
      description: "Conheça nossa empresa",
    },
    {
      href: "/contact",
      label: "Contato",
      icon: Mail,
      description: "Entre em contato conosco",
    },
    {
      href: "/login",
      label: "Login",
      icon: LogIn,
      description: "Acesse sua conta",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/system" && pathname === "/") return false;
    if (href === "/" && pathname === "/") return true;
    return pathname === href;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Package className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Stock
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }
                  group flex items-center space-x-2
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {showClearButton && onClearData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearData}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {showClearButton && onClearData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearData}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Stock
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                        ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-muted text-muted-foreground"
                        }
                        group
                      `}
                    >
                      <div
                        className={`
                        p-2 rounded-md transition-colors
                        ${
                          active
                            ? "bg-primary/20"
                            : "bg-muted group-hover:bg-muted-foreground/10"
                        }
                      `}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
                            >
                              <Crown className="h-3 w-3 mr-1" />
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm">Stock Premium</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Desbloqueie recursos avançados e tenha acesso completo ao
                    sistema.
                  </p>
                  <Button size="sm" className="w-full">
                    Fazer Upgrade
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Progress bar on scroll */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-20" />
      )}
    </div>
  );
}
