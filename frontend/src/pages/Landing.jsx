import { Link } from "react-router-dom";
import { Rocket, Globe, Radio, BarChart3, Shield, Satellite } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Globe,
    title: "3D Orbital Simulation",
    desc: "Interactive WebGL environment with real-time satellite tracking and orbit visualization.",
  },
  {
    icon: Radio,
    title: "Live Telemetry",
    desc: "Real-time data streaming from simulated low earth orbit assets.",
  },
  {
    icon: Rocket,
    title: "Mission Control",
    desc: "Operate command sequences and manage satellite missions.",
  },
  {
    icon: BarChart3,
    title: "Fleet Analytics",
    desc: "Comprehensive dashboards for fleet health, performance, and trends.",
  },
  {
    icon: Satellite,
    title: "Communications",
    desc: "Simulated uplink/downlink communication with satellite assets.",
  },
  {
    icon: Shield,
    title: "Ground Stations",
    desc: "Monitor global ground station network and connectivity status.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-orbital-bg overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `pulse-glow ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-orbital-primary flex items-center justify-center">
            <Satellite className="w-4 h-4 text-orbital-primary" />
          </div>
          <span className="text-xl font-bold text-orbital-primary font-mono tracking-wider">
            ORBITAL-X
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-outline text-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-mono text-orbital-primary mb-4 text-sm tracking-[0.3em]">
            SATELLITE SIMULATION PLATFORM
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orbital-primary via-cyan-300 to-orbital-violet bg-clip-text text-transparent">
            OrbitalX
          </h1>
          <p className="text-xl md:text-2xl text-orbital-text-dim font-light mb-2">
            Explore. Monitor. Command.
          </p>
          <p className="text-orbital-muted max-w-2xl mx-auto mt-4 mb-8 leading-relaxed">
            An interactive 3D satellite orbital simulation and mission-control
            platform. Monitor satellite constellations, track telemetry, and
            operate command sequences in a professional simulation environment.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/login"
            className="btn-primary text-base px-8 py-3 flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Launch Mission Control
          </Link>
          <Link
            to="/login"
            className="btn-outline text-base px-8 py-3 flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            Explore Orbital Viewer
          </Link>
        </motion.div>

        {/* Orbit ring decoration */}
        <div className="relative mt-16 w-72 h-72 md:w-96 md:h-96">
          <div className="absolute inset-0 rounded-full border border-orbital-border opacity-30 animate-spin" style={{ animationDuration: "30s" }} />
          <div className="absolute inset-4 rounded-full border border-orbital-primary/20 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
          <div className="absolute inset-8 rounded-full border border-orbital-violet/20 animate-spin" style={{ animationDuration: "25s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-900 to-blue-950 border border-orbital-primary/30 flex items-center justify-center shadow-lg shadow-orbital-primary/10">
              <Globe className="w-12 h-12 md:w-16 md:h-16 text-orbital-primary/60" />
            </div>
          </div>
          {/* Satellite dot on orbit */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
            <div className="w-3 h-3 rounded-full bg-orbital-primary shadow-lg shadow-orbital-primary/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="label-mono text-orbital-primary mb-2">CAPABILITIES</p>
          <h2 className="text-3xl font-bold">Platform Features</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="card-glow hover:border-orbital-primary/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <feature.icon className="w-8 h-8 text-orbital-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-orbital-muted text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer + Footer */}
      <footer className="relative z-10 border-t border-orbital-border mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-orbital-muted text-sm mb-4">
            Educational satellite simulation — not connected to real spacecraft
            or aerospace infrastructure.
          </p>
          <div className="flex items-center justify-center gap-2 text-orbital-text-dim text-sm">
            <Satellite className="w-4 h-4 text-orbital-primary" />
            <span className="font-mono">ORBITAL-X</span>
            <span className="text-orbital-muted">•</span>
            <span className="text-orbital-muted">
              Final Year College Project
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
