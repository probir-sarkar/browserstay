import { Layers, Heart, Coffee, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GithubIcon } from "@/shared/components/common";
import { SITE_CONFIG } from "@/config/site";
import { ALL_TOOLS } from "@/config/tools";

const projectLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Privacy", to: "/privacy" }
];

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-12 lg:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-5 space-y-5">
                        <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-foreground">
                            <Layers className="w-6 h-6 text-primary" />
                            <span>BrowserStay.</span>
                        </Link>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            No uploads. No accounts. No servers.
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Free, private, open-source utilities that stay in your browser.
                            Your files never leave your PC — no uploads, no servers, anywhere.
                        </p>
                        <div className="flex items-center gap-6 pt-1">
                            <a
                                href={SITE_CONFIG.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Repository"
                                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <GithubIcon className="w-5 h-5" />
                                GitHub
                            </a>
                            <a
                                href={SITE_CONFIG.links.sponsor}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Support the project"
                                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Coffee className="w-5 h-5" />
                                Support
                            </a>
                        </div>
                    </div>

                    {/* Tools */}
                    <div className="lg:col-span-4">
                        <h4 className="font-semibold text-foreground mb-6">Tools</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            {ALL_TOOLS.filter((tool) => !tool.disabled).map((tool) => (
                                <li key={tool.href}>
                                    <Link to={tool.href} className="hover:text-primary transition-colors">
                                        {tool.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Project */}
                    <div className="lg:col-span-3">
                        <h4 className="font-semibold text-foreground mb-6">Project</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {projectLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a
                                    href={SITE_CONFIG.links.issues}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Report an issue
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} BrowserStay. Open source under Apache 2.0.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        Made with <Heart className="w-4 h-4 text-primary fill-primary" /> — private by design, open by default.
                    </p>
                </div>
            </div>
        </footer>
    );
}
