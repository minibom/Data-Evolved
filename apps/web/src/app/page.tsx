
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Settings, ArrowRight, BotMessageSquare, LayoutDashboard, Network, Cpu, Skull, Code, GitBranch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center animate-fade-in-up">
        <div className="container mx-auto px-4">
          <BotMessageSquare className="h-24 w-24 text-primary mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Data Equilibrium
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Bước vào Quantum Nexus, một vũ trụ số nơi bạn là một Thực Thể Dữ Liệu sơ khai. Tiến hóa, chọn phe phái, và định hình lại thực tại trong cuộc chiến vĩnh cửu giữa Trật Tự và Hỗn Loạn.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/character-creation">Khởi Tạo Thực Thể <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/game">Vào Nexus (Demo) <Zap className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 animate-fade-in delay-200">Định Hình Số Phận Của Bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-primary/30 transition-all duration-300 animate-fade-in-up delay-300 bg-card transform hover:-translate-y-1">
              <CardHeader>
                <Image data-ai-hint="abstract data code" src="https://placehold.co/600x400.png" alt="Evolve Your Entity" width={600} height={400} className="rounded-t-lg mb-4" />
                <CardTitle className="font-headline text-2xl flex items-center"><Code className="mr-2 text-accent h-7 w-7" />Tiến Hóa Thực Thể</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Bắt đầu từ một Data Entity sơ khai, thu thập Data Scraps để tăng GHZ. Đạt 10 GHZ và đối mặt với Sự Kiện Tiến Hóa định mệnh.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-primary/30 transition-all duration-300 animate-fade-in-up delay-400 bg-card transform hover:-translate-y-1">
              <CardHeader>
                <Image data-ai-hint="network choice path" src="https://placehold.co/600x400.png" alt="Choose Your Allegiance" width={600} height={400} className="rounded-t-lg mb-4" />
                <CardTitle className="font-headline text-2xl flex items-center"><GitBranch className="mr-2 text-accent h-7 w-7" />Chọn Phe Phái</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Gia nhập <span className="text-blue-400 font-semibold">AI Core</span> (Nexus Points) để bảo vệ trật tự, hoặc theo <span className="text-purple-400 font-semibold">Hackers</span> (Shadow Decoders) để giải phóng dữ liệu.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-primary/30 transition-all duration-300 animate-fade-in-up delay-500 bg-card transform hover:-translate-y-1">
              <CardHeader>
                <Image data-ai-hint="digital landscape zone" src="https://placehold.co/600x400.png" alt="Control the Nexus" width={600} height={400} className="rounded-t-lg mb-4" />
                <CardTitle className="font-headline text-2xl flex items-center"><Network className="mr-2 text-accent h-7 w-7" />Kiểm Soát Nexus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Cạnh tranh giành quyền kiểm soát các Zone, xây dựng Faction Data Hubs, và tham gia vào cơ chế "Assimilation Protocol" đầy kịch tính.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Core Conflict Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 animate-fade-in delay-300">Cuộc Chiến Giành Quyền Kiểm Soát Vũ Trụ Số</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in delay-400">
                Quantum Nexus đang bị đe dọa bởi các Thực thể Lỗi và Bất thường Dữ liệu. Hai thế lực AI tối cao, 
                <span className="text-blue-400 font-semibold">AI Core</span> và <span className="text-purple-400 font-semibold">Anonymous (Hacker AI)</span>, 
                không ngừng đối đầu, tự phát triển và cân bằng thế giới game, tạo ra những sự kiện toàn cầu và mảnh lore độc đáo.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center p-6 bg-card rounded-lg shadow-md animate-fade-in-left delay-500 w-full md:w-1/3">
                    <Cpu className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-headline text-blue-400 mb-2">AI Core</h3>
                    <p className="text-sm text-muted-foreground">Duy trì trật tự, củng cố Nexus, bảo vệ nhân loại khỏi hỗn loạn dữ liệu.</p>
                </div>
                <div className="text-2xl font-bold text-primary animate-fade-in delay-600">VS</div>
                <div className="text-center p-6 bg-card rounded-lg shadow-md animate-fade-in-right delay-500 w-full md:w-1/3">
                    <Skull className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-headline text-purple-400 mb-2">Shadow Decoders</h3>
                    <p className="text-sm text-muted-foreground">Giải phóng dữ liệu, phá vỡ kiểm soát, mở ra kỷ nguyên tự do, dù có hỗn loạn.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 animate-fade-in delay-200">Khám Phá Data Equilibrium</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-300 bg-card transform hover:-translate-y-1">
              <CardHeader>
                <LayoutDashboard className="h-10 w-10 text-accent mb-3" />
                <CardTitle className="font-headline text-2xl">Player Dashboard</CardTitle>
                <CardDescription>Quản lý Thực Thể Dữ Liệu của bạn.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Theo dõi tiến trình, tùy chỉnh trang bị, và kiểm tra nhiệm vụ.
                </p>
                <Button asChild className="w-full" variant="secondary">
                  <Link href="/dashboard">Đến Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-400 bg-card transform hover:-translate-y-1">
              <CardHeader>
                <Settings className="h-10 w-10 text-accent mb-3" />
                <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
                <CardDescription>Giám sát và điều chỉnh thế giới game.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Truy cập các công cụ quản trị và giám sát AI (yêu cầu quyền admin).
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin">Truy Cập Admin Panel <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-500 bg-card transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <Image data-ai-hint="digital art concept" src="https://placehold.co/600x300.png" alt="Concept Art" width={600} height={300} className="rounded-lg mb-3" />
                <CardTitle className="font-headline text-2xl">Tìm Hiểu Thêm</CardTitle>
                 <CardDescription>Khám phá sâu hơn về cốt truyện và cơ chế.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Đọc README để hiểu rõ hơn về thế giới Data Equilibrium và các tính năng gameplay.
                </p>
                <Button asChild className="w-full" variant="link">
                  <a href="https://github.com/your-repo/data-evolved/blob/main/README.md" target="_blank" rel="noopener noreferrer">Đọc README <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Data Equilibrium. The Nexus is watching.</p>
      </footer>
    </div>
  );
}

// Helper for Tailwind JIT compiler if using dynamic classes (not strictly necessary for basic animations here)
// const animationDelayClasses = [
//   'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-700', 'delay-1000',
// ];
// const animationDurationClasses = [
//   'duration-100', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
// ];

// Add animate-gradient-x to tailwind.config.ts if not already defined for text gradient animation
// keyframes: {
//   'gradient-x': {
//     '0%, 100%': { 'background-position': '0% 50%' },
//     '50%': { 'background-position': '100% 50%' },
//   },
//   'fade-in-up': {
//     '0%': { opacity: '0', transform: 'translateY(20px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   }
// },
// animation: {
//   'gradient-x': 'gradient-x 3s ease infinite',
//   'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
//   'fade-in': 'fade-in 0.5s ease-out forwards', // Assuming fade-in is defined elsewhere or add: '0%': {opacity:0}, '100%': {opacity:1}
// }

// For animate-fade-in-up and animate-fade-in, you would define these in tailwind.config.js like:
// theme: {
//   extend: {
//     animation: {
//       'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
//       'fade-in': 'fadeIn 0.5s ease-out forwards',
//       'gradient-x': 'gradientX 4s ease infinite',
//     },
//     keyframes: {
//       fadeInUp: {
//         '0%': { opacity: '0', transform: 'translateY(20px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' },
//       },
//       fadeIn: {
//         '0%': { opacity: '0' },
//         '100%': { opacity: '1' },
//       },
//       gradientX: {
//         '0%, 100%': { backgroundPosition: '0% 50%' },
//         '50%': { backgroundPosition: '100% 50%' },
//       }
//     }
//   }
// }
// And ensure `bg-gradient-to-r from-primary via-accent to-primary` has `background-size: 200% auto;` for the gradient animation to work.
// I cannot add this directly to globals.css, so this is a note.
// For the Hero title, you would add `bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]` in its className for the animation.

// Actual animation classes like `animate-fade-in-up` will depend on your tailwind.config.js setup.
// The ones used here are common patterns. If they don't work, you'll need to define them.
// For simplicity, I am using Tailwind Play's default animations or assuming they are configured.
// `animate-pulse` is standard. `animate-fade-in` might need definition.
// For `animate-gradient-x`, the setup involves keyframes and animation utilities.
// I will use basic `animate-fade-in-up` which implies you have a `fadeInUp` keyframe.
// I've also added `animate-fade-in` for simpler fade-ins.
// If these are not defined in your tailwind.config.js, these animations won't work.
// Standard Tailwind animations like `animate-pulse` work out of the box.
// The delay classes (`delay-200`, etc.) are standard.
