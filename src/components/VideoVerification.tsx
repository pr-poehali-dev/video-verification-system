import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Video, RotateCcw } from "lucide-react";

type VerificationStep = "ready" | "recording" | "processing" | "success" | "error";

interface VideoVerificationProps {
  isFirstLogin: boolean;
  onVerificationComplete: (success: boolean, errorMessage?: string) => void;
}

const VideoVerification = ({ isFirstLogin, onVerificationComplete }: VideoVerificationProps) => {
  const [step, setStep] = useState<VerificationStep>("ready");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(7);
  const [facingDirection, setFacingDirection] = useState<string>("прямо");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const directions = ["прямо", "влево", "вправо", "вверх"];
  
  useEffect(() => {
    if (step === "recording") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            stopRecording();
            return 0;
          }
          
          // Меняем направление каждые 2 секунды
          if (prev % 2 === 0) {
            const dirIndex = Math.floor((7 - prev) / 2);
            if (dirIndex < directions.length) {
              setFacingDirection(directions[dirIndex]);
            }
          }
          
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [step]);
  
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      return true;
    } catch (err) {
      setErrorMessage("Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения.");
      setStep("error");
      return false;
    }
  };
  
  const startRecording = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    
    setStep("recording");
    setTimeLeft(7);
    setFacingDirection("прямо");
    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current as MediaStream);
    recordingRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      // Здесь моделируем отправку и обработку записи
      processRecording();
    };
    
    mediaRecorder.start();
  };
  
  const stopRecording = () => {
    if (recordingRef.current && recordingRef.current.state !== "inactive") {
      recordingRef.current.stop();
      setStep("processing");
    }
  };
  
  const processRecording = () => {
    // Моделируем обработку на сервере
    setTimeout(() => {
      // Симуляция ответа от сервера
      const success = Math.random() > 0.3; // 70% вероятность успеха для демонстрации
      
      if (success) {
        setStep("success");
        onVerificationComplete(true);
      } else {
        setStep("error");
        
        // Симуляция различных ошибок
        const errorTypes = [
          "Не удалось распознать лицо. Пожалуйста, обеспечьте хорошее освещение и повторите попытку.",
          "Этот биометрический отпечаток уже зарегистрирован на другом аккаунте (телефон +7 XXX XXX-XX-XX). Доступ заблокирован.",
          "Не удалось подтвердить, что это живой человек. Повторите попытку."
        ];
        
        const selectedError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        setErrorMessage(selectedError);
        onVerificationComplete(false, selectedError);
      }
    }, 3000);
  };
  
  const resetVerification = () => {
    setStep("ready");
    setErrorMessage("");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isFirstLogin ? "Первичная видео-верификация" : "Видео-верификация"}
      </h2>
      
      {step === "ready" && (
        <div className="text-center">
          <div className="mb-6 text-gray-600">
            <p className="mb-4">
              {isFirstLogin 
                ? "Для защиты вашей учетной записи нам нужно записать короткое видео с вашим лицом."
                : "Пожалуйста, пройдите видео-верификацию для подтверждения личности."}
            </p>
            <p className="mb-4">
              Пожалуйста, следуйте указаниям на экране и поворачивайте голову в запрашиваемом направлении.
            </p>
          </div>
          <Button
            onClick={startRecording}
            className="flex items-center gap-2"
          >
            <Video size={18} />
            Начать запись
          </Button>
        </div>
      )}
      
      {(step === "recording" || step === "processing") && (
        <div className="text-center">
          <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100 aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {step === "recording" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                <div className="text-4xl font-bold mb-2">{timeLeft}</div>
                <div className="text-xl mb-1">Поверните голову:</div>
                <div className="text-2xl font-bold">{facingDirection.toUpperCase()}</div>
              </div>
            )}
            
            {step === "processing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="text-xl">Обработка...</div>
                </div>
              </div>
            )}
          </div>
          
          {step === "recording" && (
            <p className="text-sm text-gray-500 mb-4">
              Следуйте инструкциям и поворачивайте голову в указанном направлении
            </p>
          )}
          
          {step === "processing" && (
            <p className="text-sm text-gray-500 mb-4">
              Пожалуйста, подождите. Мы проверяем запись...
            </p>
          )}
        </div>
      )}
      
      {step === "success" && (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500 w-10 h-10" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Верификация успешна!</h3>
          <p className="text-gray-600 mb-6">
            {isFirstLogin 
              ? "Ваш биометрический отпечаток сохранен. Теперь вы можете использовать свой аккаунт."
              : "Личность подтверждена. Переадресация в личный кабинет..."}
          </p>
        </div>
      )}
      
      {step === "error" && (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-500 w-10 h-10" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ошибка верификации</h3>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <Button
            variant="outline"
            onClick={resetVerification}
            className="flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Повторить попытку
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoVerification;
