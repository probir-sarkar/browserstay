import { Layers, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GithubIcon } from "@/shared/components/common";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-foreground">
                            <Layers className="w-6 h-6 text-primary" />
                            <span>BrowserStay.</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            Free, private, open-source utilities that stay in your browser.
                            Your files never leave your PC — no uploads, no servers, anywhere.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <a
                                href="https://github.com/probir-sarkar/toolbox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                                aria-label="GitHub Repository"
                            >
                                <GithubIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-6">Tools</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link to="/pdf-to-image" className="hover:text-primary transition-colors">PDF to Image</Link>
                            </li>
                            <li>
                                <Link to="/image-converter" className="hover:text-primary transition-colors">Image Converter</Link>
                            </li>
                            <li>
                                <Link to="/pdf-tools" className="hover:text-primary transition-colors">Merge PDF</Link>
                            </li>
                            <li>
                                <Link to="/image-tools" className="hover:text-primary transition-colors">Resize Image</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-6">Project</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">About</Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">Open Source</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} BrowserStay. Open source.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        Made with <Heart className="w-4 h-4 text-primary fill-primary" /> — private by design, open by default.
                    </p>
                </div>
            </div>
        </footer>
    );
}
