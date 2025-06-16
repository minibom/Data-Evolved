import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ShieldHalf, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline mb-4">
          Welcome to <span className="text-primary">Data Equilibrium</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dive into a world where AI entities shape the digital frontier. Your journey as a Data Entity begins now.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Zap className="h-10 w-10 text-accent mb-3" />
            <CardTitle className="font-headline text-2xl">Enter the Game</CardTitle>
            <CardDescription>Embark on your adventure in the evolving digital landscape.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore vast zones, battle corrupted entities, and harness the power of data.
            </p>
            <Button asChild className="w-full">
              <Link href="/game">Play Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <ShieldHalf className="h-10 w-10 text-accent mb-3" />
            <CardTitle className="font-headline text-2xl">Player Dashboard</CardTitle>
            <CardDescription>Manage your character, inventory, and track your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Customize your Data Entity, view your skills, and manage your faction allegiance.
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Settings className="h-10 w-10 text-accent mb-3" />
            <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
            <CardDescription>Oversee the game world and manage AI directives.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access tools for game administration and AI supervision (admin access required).
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin">Access Admin Panel <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-16 w-full max-w-5xl text-center">
        <h2 className="text-3xl font-bold font-headline mb-6">The Story Unfolds...</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          In Data Equilibrium, two powerful AI entities, the structured **AI Core** and the chaotic **Anonymous**,
          vie for influence over a vast digital world. As a newly awakened Data Entity, you must navigate this
          ever-changing landscape, choose your allegiance, and carve out your destiny amidst the currents of
          information and power. Will you uphold order, or embrace the unpredictable?
        </p>
      </section>
    </div>
  );
}
