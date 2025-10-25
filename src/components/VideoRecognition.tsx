import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Square, Camera } from "lucide-react";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/baXNWmdzx/";

interface Prediction {
  className: string;
  probability: number;
}

export const VideoRecognition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const animationFrameRef = useRef<number>();

  // Carrega o modelo do Teachable Machine
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao carregar modelo:", err);
        setError("Não foi possível carregar o modelo de IA");
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  // Inicia a webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Erro ao acessar webcam:", err);
      setError("Não foi possível acessar a câmera");
    }
  };

  // Para a webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Loop de predição
  const predict = async () => {
    if (!model || !videoRef.current || !isRunning) return;

    try {
      const predictions = await model.predict(videoRef.current);
      
      // Pega a predição com maior confiança
      const topPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      setPrediction({
        className: topPrediction.className,
        probability: topPrediction.probability,
      });

      // Continua o loop
      animationFrameRef.current = requestAnimationFrame(predict);
    } catch (err) {
      console.error("Erro na predição:", err);
    }
  };

  // Inicia o reconhecimento
  const startRecognition = async () => {
    if (!model) {
      setError("Modelo ainda não carregado");
      return;
    }

    setError("");
    await startWebcam();
    setIsRunning(true);
  };

  // Para o reconhecimento
  const stopRecognition = () => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    stopWebcam();
    setPrediction(null);
  };

  // Inicia o loop quando isRunning muda
  useEffect(() => {
    if (isRunning) {
      predict();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, model]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopWebcam();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Determina a cor de fundo baseado na confiança
  const getConfidenceColor = () => {
    if (!prediction) return "bg-card";
    if (prediction.probability > 0.8) return "bg-success/10";
    if (prediction.probability > 0.5) return "bg-warning/10";
    return "bg-danger/10";
  };

  // Mapeia os nomes das classes
  const getClassDisplayName = (className: string) => {
    const classMap: Record<string, string> = {
      "Class 1": "positivo",
      "Class 2": "negativo"
    };
    return classMap[className] || className;
  };

  // Determina a mensagem de feedback
  const getFeedbackMessage = () => {
    if (!prediction) return "Aguardando reconhecimento...";
    if (prediction.probability > 0.8)
      return "✅ Objeto reconhecido com alta confiança.";
    if (prediction.probability > 0.5)
      return "⚠️ Reconhecimento incerto, tente novamente.";
    return "❌ Nenhum padrão reconhecido.";
  };

  return (
    <div className="space-y-6">
      {/* Área de vídeo */}
      <Card className={`overflow-hidden transition-all duration-500 shadow-card ${getConfidenceColor()}`}>
        <div className="relative aspect-video bg-secondary/30 flex items-center justify-center">
          {!isRunning && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-fade-in">
              <Camera className="w-16 h-16" />
              <p className="text-sm">Clique em "Iniciar Reconhecimento" para começar</p>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="animate-pulse">
                <Camera className="w-16 h-16" />
              </div>
              <p className="text-sm">Carregando modelo de IA...</p>
            </div>
          )}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${!isRunning && "hidden"}`}
            autoPlay
            playsInline
            muted
          />
        </div>
      </Card>

      {/* Controles */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={startRecognition}
          disabled={isRunning || isLoading}
          size="lg"
          className="gap-2 shadow-glow"
        >
          <Play className="w-5 h-5" />
          Iniciar Reconhecimento
        </Button>
        <Button
          onClick={stopRecognition}
          disabled={!isRunning}
          variant="secondary"
          size="lg"
          className="gap-2"
        >
          <Square className="w-5 h-5" />
          Parar Reconhecimento
        </Button>
      </div>

      {/* Área de resultado */}
      <Card className={`p-6 transition-all duration-500 shadow-card ${getConfidenceColor()}`}>
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Resultado da Análise</h3>
        
        {error && (
          <div className="bg-danger/10 text-danger p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {prediction ? (
          <div className="space-y-4 animate-scale-in">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Classe Detectada:</p>
              <p className="text-2xl font-bold text-card-foreground">{getClassDisplayName(prediction.className)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Confiança:</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-primary h-full transition-all duration-300"
                    style={{ width: `${prediction.probability * 100}%` }}
                  />
                </div>
                <span className="text-xl font-bold text-card-foreground min-w-[80px]">
                  {(prediction.probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-card-foreground font-medium">{getFeedbackMessage()}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground animate-pulse">
            {isRunning ? "Analisando imagem..." : "Aguardando início do reconhecimento"}
          </div>
        )}
      </Card>
    </div>
  );
};
