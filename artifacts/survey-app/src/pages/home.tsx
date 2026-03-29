import { Link } from "wouter";
import { Button } from "@/components/ui-custom";
import { ArrowRight, BarChart3, Brain, Moon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/5"
      >
        <Brain className="w-10 h-10" />
      </motion.div>

      <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Stress & Sleep</span> Survey
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
        College life can be overwhelming. We're conducting an anonymous, 2-minute survey to understand how students manage stress and sleep. Your insights help build a clearer picture of student well-being.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href="/survey" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-lg px-8 py-4 group">
            Take the Survey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/results" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4">
            <BarChart3 className="mr-2 w-5 h-5" />
            View Results
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl text-left">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">100% Anonymous</h3>
          <p className="text-muted-foreground text-sm">We don't collect names or emails. Feel free to share your honest experience.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Focus on Sleep</h3>
          <p className="text-muted-foreground text-sm">Explore the relationship between study habits, stress levels, and nightly rest.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Live Insights</h3>
          <p className="text-muted-foreground text-sm">View aggregated data instantly after submission to see how your peers are doing.</p>
        </div>
      </div>
    </div>
  );
}
