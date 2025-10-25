import { Card } from "@/components/ui/card";
import { Brain, Eye, Zap } from "lucide-react";

export const AboutSection = () => {
  return (
    <Card className="p-8 shadow-card">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-3">Sobre o Projeto</h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <p className="text-card-foreground leading-relaxed text-center max-w-2xl mx-auto">
          Este site demonstra o uso de <span className="font-semibold text-primary">Visão Computacional</span> com{" "}
          <span className="font-semibold text-primary">Inteligência Artificial</span>. O modelo foi treinado no{" "}
          <span className="font-semibold">Teachable Machine</span> para reconhecer padrões visuais em tempo real,
          aplicando conceitos fundamentais do curso <span className="font-semibold">AI-900 – Fundamentos de Inteligência Artificial</span>.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="text-center space-y-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">Machine Learning</h3>
            <p className="text-sm text-muted-foreground">
              Modelo treinado para reconhecer objetos e padrões visuais
            </p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">Visão Computacional</h3>
            <p className="text-sm text-muted-foreground">
              Análise de imagens em tempo real através da webcam
            </p>
          </div>

          <div className="text-center space-y-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">TensorFlow.js</h3>
            <p className="text-sm text-muted-foreground">
              Execução do modelo de IA diretamente no navegador
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
