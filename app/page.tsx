import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Globe, 
  Shield, 
  Leaf, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle,
  Brain,
  Zap,
  Eye,
  Target
} from 'lucide-react';

const features = [
  {
    title: '3D Global Intelligence',
    description: 'Interactive 3D globe showing real-time conflicts and environmental data',
    icon: Globe,
    href: '/globe',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Advanced Features',
    description: 'Time machine, crisis dashboard, AI simulator, and voice chat capabilities',
    icon: Zap,
    href: '/advanced',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Peace & Conflict Intelligence',
    description: 'AI-powered conflict probability analysis and peace treaty generation',
    icon: Shield,
    href: '/peace-conflict',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Environment Monitor',
    description: 'Real-time environmental tracking with AI-driven sustainability recommendations',
    icon: Leaf,
    href: '/environment',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Counter-Terrorism Dashboard',
    description: 'Advanced threat analysis and security intelligence visualization',
    icon: AlertTriangle,
    href: '/counter-terrorism',
    color: 'from-red-500 to-orange-500'
  },
  {
    title: 'Global Economy',
    description: 'Economic indicators, trends, and AI-powered market analysis',
    icon: TrendingUp,
    href: '/economy',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Chat with Earth',
    description: 'Communicate directly with our planet about global affairs, conflicts, and sustainability',
    icon: MessageCircle,
    href: '/chatbot',
    color: 'from-indigo-500 to-blue-500'
  }
];

const stats = [
  { label: 'Countries Monitored', value: '195+', icon: Globe },
  { label: 'Data Points Analyzed', value: '1M+', icon: Eye },
  { label: 'AI Predictions Made', value: '50K+', icon: Brain },
  { label: 'Peace Treaties Generated', value: '1,200+', icon: Target }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <Brain className="relative h-20 w-20 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Oracle Earth
          </h1>
          <p className="text-xl md:text-2xl text-blue-300 mb-4">
            The AI Brain of Our Planet
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            A futuristic digital twin of Earth powered by AI, providing real-time global intelligence 
            for peace, sustainability, and security. Monitor conflicts, environmental changes, and 
            global threats with unprecedented insight.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/peace-conflict">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Zap className="mr-2 h-5 w-5" />
                Explore Global Intelligence
              </Button>
            </Link>
            <Link href="/chatbot">
              <Button variant="outline" size="lg" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3">
                <Globe className="mr-2 h-5 w-5" />
                Chat with Earth
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Global Intelligence Modules
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive AI-powered analysis across multiple domains to understand 
              and predict global events, ensuring peace and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
                        Explore Module →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore Our Planet's Intelligence?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join the future of global monitoring and AI-powered insights. 
            Start exploring real-time data and predictions today.
          </p>
          <Link href="/peace-conflict">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3">
              <Globe className="mr-2 h-5 w-5" />
              Start Monitoring
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}