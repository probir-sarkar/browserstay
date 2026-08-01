import { Link } from "@tanstack/react-router";
import { cn } from "@/shared/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/shared/components/ui/navigation-menu";
import { Layers, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/shared/components/ui/sheet";
import { TOOLS_CONFIG } from "@/config/tools";
import { SITE_CONFIG } from "@/config/site";
import { ModeToggle } from "@/shared/components/layout/theme-toggler";
import { GithubIcon } from "@/shared/components/common";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md upports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-primary mr-8">
          <Layers className="w-6 h-6" />
          <span className="text-foreground">{SITE_CONFIG.name}</span>
          <span className="hidden lg:inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            100% private
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 ml-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-105 p-3 lg:w-125">
                    <div className="grid grid-cols-2 gap-3">
                      {TOOLS_CONFIG.map((category) => (
                        <div key={category.title} className="space-y-2">
                          <div className="flex items-center gap-1.5 pb-1 border-b border-border">
                            <category.icon className="w-4 h-4 text-primary" />
                            <h4 className="font-semibold text-sm text-foreground">{category.title}</h4>
                          </div>
                          <ul className="space-y-0.5">
                            {category.items
                              .filter((item) => !item.disabled)
                              .map((item) => (
                                <li key={item.title}>
                                  <NavigationMenuLink>
                                    <Link
                                      to={item.href}
                                      className="block px-2 py-1 text-xs text-muted-foreground rounded-md hover:bg-muted hover:text-primary transition-colors"
                                    >
                                      {item.title}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border bg-muted/20 -mx-3 -mb-3 p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-sm text-foreground">Need more tools?</h5>
                        </div>
                        <Link
                          to={SITE_CONFIG.links.issues}
                          target="_blank"
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs px-2")}
                        >
                          Request Feature
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Placeholders for future links */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            render={
              <Link to={SITE_CONFIG.links.github} target="_blank" aria-label="GitHub Repository">
                <GithubIcon className="h-5 w-5" />
              </Link>
            }
          />

          <Button
            variant="default"
            render={
              <Link to={SITE_CONFIG.links.sponsor} target="_blank">
                Support Project
              </Link>
            }
          />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 gap-0 flex flex-col h-full">
              <div className="p-6 pb-2 shrink-0">
                <SheetTitle className="text-left flex items-center gap-2 font-bold text-xl">
                  <Layers className="w-5 h-5 text-primary" /> {SITE_CONFIG.name}
                </SheetTitle>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6 min-h-0">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={cn("text-lg font-medium transition-colors hover:text-primary text-muted-foreground")}
                >
                  Home
                </Link>

                <div className="space-y-6">
                  <h4 className="font-medium text-foreground border-b border-border pb-2">Tools</h4>
                  {TOOLS_CONFIG.map((tool) => (
                    <div key={tool.title} className="space-y-3 pl-2">
                      <Link
                        to={tool.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <tool.icon className="w-4 h-4" />
                        {tool.title}
                      </Link>
                      <div className="pl-6 space-y-3 border-l-2 border-border ml-1.5">
                        {tool.items
                          .filter((item) => !item.disabled)
                          .map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="block text-sm text-muted-foreground hover:text-primary px-2 transition-colors"
                            >
                              {item.title}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-border mt-auto flex flex-col gap-4 bg-background shrink-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Theme</span>
                  <ModeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">GitHub</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    render={<Link to={SITE_CONFIG.links.github} target="_blank" aria-label="GitHub Repository"><GithubIcon className="h-5 w-5" /></Link>}
                  />
                </div>

                <Button render={<Link to={SITE_CONFIG.links.sponsor} target="_blank" />}>Support Project</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
