import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Target, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md support-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Talanta Career Guide
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/5">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-950 dark:via-background dark:to-background" />
        <div className="container flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50 backdrop-blur-sm text-secondary-foreground mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            AI-Powered 2.0 is here
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">Dream Career</span>
          </h1>
          <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl sm:leading-8">
            Unlock your potential with personalized AI recommendations and data-driven insights.
            Find a path that aligns with your true self.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-primary to-blue-600 hover:scale-105 transition-transform shadow-xl">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats or social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground grayscale opacity-70">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Trusted by 10,000+ Students
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Comprehensive Career Roadmap
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 bg-gradient-to-b from-white to-slate-50 dark:from-background dark:to-slate-950/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4">
            Why Choose Talanta?
          </h2>
          <p className="text-lg text-muted-foreground">
            We combine advanced AI technology with Holland Code (RIASEC) theory to provide the most accurate career guidance available.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/50 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <Brain className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our advanced algorithms analyze your personality, skills, and interests to generate highly accurate career recommendations tailored just for you.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/50 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Holland Code (RIASEC)</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Go beyond surface-level interests. Our assessment uses the scientifically-backed RIASEC model to find careers that truly match your personality.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/50 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Growth Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get a clear, actionable roadmap for your career. Track your progress, identify skill gaps, and achieve your professional goals step by step.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4">
            Your Journey Starts Here
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to discover and land your dream job.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-4 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10" />

          {[
            { step: 1, title: "Assessment", desc: "Take our 15-min personality and skills quiz." },
            { step: 2, title: "Analysis", desc: "Our AI processes your profile to find matches." },
            { step: 3, title: "Explore", desc: "Review detailed career paths and salary data." },
            { step: 4, title: "Achieve", desc: "Get actionable learning paths to land your dream role." }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-full bg-background border-4 border-blue-100 text-blue-600 font-bold text-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-blue-200 transition-all z-10">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-20 text-center shadow-2xl md:px-12 lg:px-20 mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[shimmer_3s_linear_infinite]" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-5xl">
            Ready to shape your future?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Join thousands of users who have found clarity and direction. Start your free assessment today.
          </p>
          <div className="relative mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full text-primary hover:bg-white shadow-lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50/50">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg">Talanta Career Guide</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2026 Talanta Career Guide. All rights reserved. Made with ❤️ for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
