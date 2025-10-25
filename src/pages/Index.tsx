import { VideoRecognition } from "@/components/VideoRecognition";
import { AboutSection } from "@/components/AboutSection";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Reconhecedor Visual com
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Inteligência Artificial
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Demonstração interativa de reconhecimento de imagens em tempo real
          </p>
        </header>

        {/* Componente de reconhecimento */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <VideoRecognition />
        </div>

        {/* Seção Sobre */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <AboutSection />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p>
            Desenvolvido com{" "}
            <span className="text-primary font-semibold">Teachable Machine</span> e{" "}
            <span className="text-primary font-semibold">TensorFlow.js</span>
          </p>
          <p className="mt-2">Projeto educacional • AI-900 - Fundamentos de IA</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
