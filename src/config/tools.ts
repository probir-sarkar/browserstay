import { Hammer, Palette, Lock, FileText, Image as ImageIcon, Scissors, Sparkles, QrCode, LucideIcon } from "lucide-react";

interface ToolItem {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  disabled?: boolean;
}

interface ToolCategory {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  items: ToolItem[];
}

export const TOOLS_CONFIG: ToolCategory[] = [
  {
    title: "PDF Tools",
    href: "/pdf-tools",
    icon: Hammer,
    description: "Merge, split, compress, and edit PDF documents.",
    items: [
      {
        title: "PDF to Image",
        href: "/pdf-to-image",
        description: "Convert PDF pages to high-quality images.",
        icon: FileText,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Image", "Popular"]
      },
      {
        title: "Image to PDF",
        href: "/image-to-pdf",
        description: "Convert images to a single PDF document.",
        icon: FileText,
        color: "bg-red-500/10 text-red-600",
        tags: ["Image", "PDF", "Top"]
      },
      {
        title: "Merge PDF",
        href: "/merge-pdf",
        description: "Combine multiple PDFs into one.",
        icon: Hammer,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Utils"]
      },
      {
        title: "Split PDF",
        href: "/split-pdf",
        description: "Extract pages or split into multiple files.",
        icon: Scissors,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Editor"]
      },
      {
        title: "Unlock PDF",
        href: "/unlock-pdf",
        description: "Remove password protection from PDFs.",
        icon: Lock,
        color: "bg-red-500/10 text-red-600",
        tags: ["PDF", "Security", "New"]
      }
    ]
  },
  {
    title: "Image Tools",
    href: "/image-tools",
    icon: Palette,
    description: "Convert, resize, and optimize your images.",
    items: [
      {
        title: "Image Converter",
        href: "/image-converter",
        description: "Batch convert image formats freely.",
        icon: ImageIcon,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["Image", "Optimization", "Popular"]
      },
      {
        title: "Image Resizer",
        href: "/image-resize",
        description: "Resize images to any dimension.",
        icon: ImageIcon,
        color: "bg-purple-500/10 text-purple-600",
        tags: ["Image", "Editor", "New"]
      },
      {
        title: "Image Compressor",
        href: "/image-compressor",
        description: "Compress images while maintaining quality.",
        icon: ImageIcon,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["Image", "Optimization", "New"]
      }
    ]
  },
  {
    title: "Security Tools",
    href: "/password-generator",
    icon: Lock,
    description: "Protect your data and privacy.",
    items: [
      {
        title: "Password Generator",
        href: "/password-generator",
        description: "Create strong, secure passwords.",
        icon: Lock,
        color: "bg-green-500/10 text-green-600",
        tags: ["Security", "Privacy", "Popular"]
      }
    ]
  },
  {
    title: "Developer Tools",
    href: "/qr-generator",
    icon: Sparkles,
    description: "Generate codes and optimize workflows.",
    items: [
      {
        title: "QR Code Generator",
        href: "/qr-generator",
        description: "Create custom QR codes for any purpose.",
        icon: QrCode,
        color: "bg-pink-500/10 text-pink-600",
        tags: ["Generator", "New", "Popular"]
      }
    ]
  }
];

export const ALL_TOOLS = TOOLS_CONFIG.flatMap((category) => category.items);
