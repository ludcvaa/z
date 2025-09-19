"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  BookOpen,
  HelpCircle,
  Shield,
  FileText,
  Timer,
  Target,
  Brain,
  BarChart3
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const appVersion = "1.0.0"

  const footerLinks = {
    produto: [
      {
        title: "Timer de Foco",
        href: "/timer",
        icon: Timer,
        description: "Sessões de produtividade"
      },
      {
        title: "Estatísticas",
        href: "/analytics",
        icon: BarChart3,
        description: "Análise de desempenho"
      },
      {
        title: "Metas",
        href: "/goals",
        icon: Target,
        description: "Acompanhe objetivos"
      },
      {
        title: "Treino Mental",
        href: "/training",
        icon: Brain,
        description: "Exercícios de concentração"
      }
    ],
    recursos: [
      {
        title: "Documentação",
        href: "/docs",
        icon: BookOpen,
        description: "Guias e tutoriais"
      },
      {
        title: "Central de Ajuda",
        href: "/help",
        icon: HelpCircle,
        description: "Suporte e FAQ"
      },
      {
        title: "API",
        href: "/api",
        icon: FileText,
        description: "Documentação da API"
      },
      {
        title: "Status",
        href: "/status",
        icon: Shield,
        description: "Status do sistema"
      }
    ],
    legal: [
      {
        title: "Termos de Serviço",
        href: "/terms",
        icon: FileText,
        description: "Condições de uso"
      },
      {
        title: "Política de Privacidade",
        href: "/privacy",
        icon: Shield,
        description: "Como protegemos seus dados"
      },
      {
        title: "Política de Cookies",
        href: "/cookies",
        icon: Shield,
        description: "Uso de cookies"
      },
      {
        title: "LGPD",
        href: "/lgpd",
        icon: Shield,
        description: "Direitos de privacidade"
      }
    ]
  }

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/stayfocus",
      icon: Github
    },
    {
      name: "Twitter",
      href: "https://twitter.com/stayfocus",
      icon: Twitter
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/stayfocus",
      icon: Linkedin
    },
    {
      name: "Email",
      href: "mailto:contato@stayfocus.com",
      icon: Mail
    }
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-6 w-6" />
              <span className="font-bold text-lg">StayFocus</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Aumente sua produtividade com nosso sistema completo de timer, estatísticas e ferramentas de foco mental.
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Newsletter</h4>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1"
                />
                <Button size="sm" variant="focus">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Produto</h4>
            <div className="space-y-3">
              {footerLinks.produto.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <div>
                    <div>{link.title}</div>
                    <div className="text-xs text-muted-foreground/70">{link.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Recursos</h4>
            <div className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <div>
                    <div>{link.title}</div>
                    <div className="text-xs text-muted-foreground/70">{link.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <div className="space-y-3">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <div>
                    <div>{link.title}</div>
                    <div className="text-xs text-muted-foreground/70">{link.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          {/* Copyright and Version */}
          <div className="flex flex-col items-center space-y-2 md:items-start">
            <p className="text-xs text-muted-foreground">
              © {currentYear} StayFocus. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Versão {appVersion} • Construído com Next.js e shadcn/ui
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            StayFocus é uma ferramenta de produtividade projetada para ajudar você a alcançar seus objetivos
            através de técnicas comprovadas de gerenciamento de tempo e foco.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Simplified footer for minimal layouts
export function MinimalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} StayFocus. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Termos
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacidade
          </Link>
          <Link
            href="/help"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ajuda
          </Link>
        </div>
      </div>
    </footer>
  )
}