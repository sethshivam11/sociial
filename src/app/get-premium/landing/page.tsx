"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Camera,
  Users,
  Video,
  MessageCircle,
  Phone,
  Shield,
  UserPlus,
  Share2,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
  Globe2,
  Zap,
  ImageIcon,
  CircleUser,
  VideoIcon,
  MessagesSquare,
  PhoneCall,
} from "lucide-react";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen col-span-10">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-gradient-to-r from-[#FF3366]/10 to-[#4CAF50]/10">
        <Link className="flex items-center justify-center" href="#">
          <Image
            src="https://sociial.vercel.app/logo.svg"
            alt="Sociial Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="ml-2 text-2xl font-extrabold tracking-tighter">
            Sociial
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium hover:text-[#FF3366] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Sign up
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white via-[#2196F3]/5 to-[#FF9800]/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  🎉 Now in Beta
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  The Next Generation of
                  <span className="block bg-gradient-to-r from-[#FF3366] via-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
                    Social Connection
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of early users already experiencing the future
                  of social networking. Connect, share, and engage like never
                  before.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row">
                <Button size="lg">Create Account</Button>
                <Button
                  variant="outline"
                  className="transition-all hover:scale-105"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#FF3366]/5 via-white to-[#4CAF50]/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  ✨ Beta Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Experience The Difference
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl">
                  Discover why users are switching to Sociial for their social
                  networking needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3366] to-[#FF6B6B] opacity-10" />
                <CardContent className="p-6">
                  <Star className="h-12 w-12 mb-4 text-[#FF3366]" />
                  <h3 className="text-xl font-bold">Rich Media Sharing</h3>
                  <p className="text-gray-500">
                    Share photos, videos, and stories with stunning quality.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] opacity-10" />
                <CardContent className="p-6">
                  <Users className="h-12 w-12 mb-4 text-[#4CAF50]" />
                  <h3 className="text-xl font-bold">Group Features</h3>
                  <p className="text-gray-500">
                    Create and join communities that matter to you.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3] to-[#03A9F4] opacity-10" />
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 mb-4 text-[#2196F3]" />
                  <h3 className="text-xl font-bold">Privacy First</h3>
                  <p className="text-gray-500">
                    Advanced privacy controls for your peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    🌟 Available Now
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Connect Your Way
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Experience social networking reimagined with cutting-edge
                    features designed for the modern world.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-gray-50">
                    <Camera className="h-6 w-6 text-[#FF3366]" />
                    <div>
                      <h3 className="font-bold">HD Media</h3>
                      <p className="text-sm text-gray-500">
                        Crystal clear sharing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-gray-50">
                    <Phone className="h-6 w-6 text-[#4CAF50]" />
                    <div>
                      <h3 className="font-bold">Video Calls</h3>
                      <p className="text-sm text-gray-500">
                        Face-to-face chats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-gray-50">
                    <MessageCircle className="h-6 w-6 text-[#2196F3]" />
                    <div>
                      <h3 className="font-bold">Group Chats</h3>
                      <p className="text-sm text-gray-500">
                        Team collaboration
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-gray-50">
                    <Shield className="h-6 w-6 text-[#FF9800]" />
                    <div>
                      <h3 className="font-bold">Security</h3>
                      <p className="text-sm text-gray-500">
                        End-to-end encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[400px] aspect-square relative lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9800] to-[#FF3366] rounded-full blur-3xl opacity-20" />
                <Image
                  src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1724913067/sociial/posts/linf3pvjmyxoteaea9r2.png"
                  alt=""
                  className="mx-auto aspect-square object-contain rounded-xl shadow-2xl transition-all hover:scale-105"
                  height="400"
                  width="400"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  🎯 Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl">
                  Discover all the powerful features that make Sociial the
                  perfect platform for connecting and sharing.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-4 lg:grid-cols-6">
              {/* Large feature card */}
              <Card className="md:col-span-2 md:row-span-2 lg:col-span-4 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3366] to-[#FF6B6B] opacity-10" />
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <Camera className="h-12 w-12 mb-4 text-[#FF3366]" />
                    <h3 className="text-2xl font-bold mb-2">
                      Stories & Moments
                    </h3>
                    <p className="text-gray-500">
                      Share your daily moments with beautiful stories that
                      disappear in 24 hours. Add filters, music, and creative
                      effects.
                    </p>
                  </div>
                  <div className="flex items-center mt-4 text-[#FF3366]">
                    <span className="text-sm font-medium">Create Story</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Posts Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] opacity-10" />
                <CardContent className="p-6">
                  <ImageIcon className="h-8 w-8 mb-4 text-[#4CAF50]" />
                  <h3 className="text-xl font-bold mb-2">Rich Posts</h3>
                  <p className="text-gray-500">
                    Share photos, thoughts, and more with your followers.
                  </p>
                </CardContent>
              </Card>

              {/* Videos Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3] to-[#03A9F4] opacity-10" />
                <CardContent className="p-6">
                  <VideoIcon className="h-8 w-8 mb-4 text-[#2196F3]" />
                  <h3 className="text-xl font-bold mb-2">Video Content</h3>
                  <p className="text-gray-500">
                    Create and share engaging videos with your audience.
                  </p>
                </CardContent>
              </Card>

              {/* Follow/Unfollow Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800] to-[#FFC107] opacity-10" />
                <CardContent className="p-6">
                  <CircleUser className="h-8 w-8 mb-4 text-[#FF9800]" />
                  <h3 className="text-xl font-bold mb-2">Follow Friends</h3>
                  <p className="text-gray-500">
                    Connect with friends and interesting people.
                  </p>
                </CardContent>
              </Card>

              {/* Chats Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9C27B0] to-[#E040FB] opacity-10" />
                <CardContent className="p-6">
                  <MessagesSquare className="h-8 w-8 mb-4 text-[#9C27B0]" />
                  <h3 className="text-xl font-bold mb-2">Group Chats</h3>
                  <p className="text-gray-500">
                    Create groups and chat with multiple friends at once.
                  </p>
                </CardContent>
              </Card>

              {/* Notifications Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F44336] to-[#FF5252] opacity-10" />
                <CardContent className="p-6">
                  <Bell className="h-8 w-8 mb-4 text-[#F44336]" />
                  <h3 className="text-xl font-bold mb-2">Notifications</h3>
                  <p className="text-gray-500">
                    Stay updated with real-time notifications.
                  </p>
                </CardContent>
              </Card>

              {/* Calls Card */}
              <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#673AB7] to-[#7E57C2] opacity-10" />
                <CardContent className="p-6">
                  <PhoneCall className="h-8 w-8 mb-4 text-[#673AB7]" />
                  <h3 className="text-xl font-bold mb-2">
                    Video & Audio Calls
                  </h3>
                  <p className="text-gray-500">
                    Connect face-to-face with crystal clear calls.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2196F3]/5 via-white to-[#FF3366]/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  💫 Why Choose Sociial
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Built Different
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl">
                  Experience what sets us apart from traditional social networks
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-[#4CAF50]/10 to-transparent">
                  <div className="rounded-full bg-[#4CAF50]/20 p-2">
                    <Sparkles className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <h3 className="font-bold">Ad-Free</h3>
                  <p className="text-sm text-gray-500">
                    Pure social experience
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-[#2196F3]/10 to-transparent">
                  <div className="rounded-full bg-[#2196F3]/20 p-2">
                    <Globe2 className="h-6 w-6 text-[#2196F3]" />
                  </div>
                  <h3 className="font-bold">Global</h3>
                  <p className="text-sm text-gray-500">Worldwide community</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-[#FF3366]/10 to-transparent">
                  <div className="rounded-full bg-[#FF3366]/20 p-2">
                    <Zap className="h-6 w-6 text-[#FF3366]" />
                  </div>
                  <h3 className="font-bold">Fast</h3>
                  <p className="text-sm text-gray-500">Lightning quick</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-br from-[#FF9800]/10 to-transparent">
                  <div className="rounded-full bg-[#FF9800]/20 p-2">
                    <Heart className="h-6 w-6 text-[#FF9800]" />
                  </div>
                  <h3 className="font-bold">Community</h3>
                  <p className="text-sm text-gray-500">Built together</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#FF3366]/10 via-white to-[#4CAF50]/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Join Sociial Today
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Be part of the next evolution in social networking. Create
                  your account now.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">Sign Up Now</Button>
                <Button
                  variant="outline"
                  className="transition-all hover:scale-105"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Join thousands of users already on Sociial
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 Sociial. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
