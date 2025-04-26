import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Video, RotateCcw, Camera } from "lucide-react";

type VerificationStep = "ready" | "scanning" | "processing" | "success" | "error";

interface VideoVerificationProps {
  isFirstLogin: boolean;
  onVerificationComplete: (success: boolean, errorMessage?: string) => void;
}

const VideoVerification = ({ isFirstLogin, onVerificationComplete }: VideoVerificationProps) => {
  const [step, setStep] = useState<VerificationStep>("ready");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const faceCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Очистка ресурсов при размонтировании компонента
  useEffect(() => {
    return () => {
      stopAllTimers();
      stopCamera();
    };
  }, []);

  // Эффект для автоматического начала сканирования при обнаружении лица
  useEffect(() => {
    if (step === "scanning" && faceDetected && scanProgress === 0) {
      // Как только лицо обнаружено, начинаем процесс сканирования
      startScanningProcess();
    }
  }, [step, faceDetected]);

  // Функция начала сканирования
  const startScanningProcess = () => {
    setScanProgress(0);
    scanTimerRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          // Сканирование завершено, переходим к обработке
          stopAllTimers();
          setStep("processing");
          processVerification();
          return 100;
        }
        return next;
      });
    }, 100); // Быстрый прогресс для лучшего UX
  };

  // Остановка всех таймеров
  const stopAllTimers = () => {
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (faceCheckTimerRef.current) {
      clearInterval(faceCheckTimerRef.current);
      faceCheckTimerRef.current = null;
    }
  };

  // Функция для запуска камеры и начала процесса сканирования
  const startScanning = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    
    setStep("scanning");
    setFaceDetected(false);
    setScanProgress(0);
    
    // Имитация проверки наличия лица в кадре
    faceCheckTimerRef.current = setInterval(() => {
      // В реальном приложении здесь был бы алгоритм обнаружения лица
      // Имитируем обнаружение лица через случайное время (0.5-2 секунды)
      if (Math.random() > 0.7 && !faceDetected) {
        setFaceDetected(true);
      }
    }, 300);
  };

  // Запрос доступа к камере
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      return true;
    } catch (err) {
      console.error("Ошибка доступа к камере:", err);
      setErrorMessage("Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения.");
      setStep("error");
      return false;
    }
  };

  // Остановка работы камеры
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Обработка результатов сканирования
  const processVerification = () => {
    // Имитация обработки на сервере
    setTimeout(() => {
      // Для демонстрации: 70% вероятность успеха
      const success = Math.random() > 0.3;
      
      if (success) {
        setStep("success");
        onVerificationComplete(true);
      } else {
        setStep("error");
        
        // Симуляция различных ошибок
        const errorTypes = [
          "Не удалось распознать лицо. Пожалуйста, убедитесь в хорошем освещении и повторите попытку.",
          "Этот биометрический отпечаток уже зарегистрирован на другом аккаунте (телефон +7 XXX XXX-XX-XX). Доступ заблокирован.",
          "Не удалось подтвердить, что это живой человек. Повторите попытку."
        ];
        
        const selectedError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        setErrorMessage(selectedError);
        onVerificationComplete(false, selectedError);
      }
      
      // Остановка камеры после завершения
      stopCamera();
    }, 2000);
  };

  // Сброс состояния при повторной попытке
  const resetVerification = () => {
    setStep("ready");
    setErrorMessage("");
    setFaceDetected(false);
    setScanProgress(0);
    stopAllTimers();
    stopCamera();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isFirstLogin ? "Первичная верификация лица" : "Верификация лица"}
      </h2>
      
      {step === "ready" && (
        <div className="text-center">
          <div className="mb-6 text-gray-600">
            <p className="mb-4">
              {isFirstLogin 
                ? "Для защиты вашей учетной записи нам нужно сканировать ваше лицо."
                : "Пожалуйста, пройдите сканирование лица для подтверждения личности."}
            </p>
            <p className="mb-4">
              Посмотрите прямо в камеру и не двигайтесь, пока система сканирует ваше лицо.
            </p>
          </div>
          <Button
            onClick={startScanning}
            className="flex items-center gap-2"
          >
            <Camera size={18} />
            Начать сканирование
          </Button>
        </div>
      )}
      
      {step === "scanning" && (
        <div className="text-center">
          <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100 aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {!faceDetected ? (
                <div className="text-center p-4 bg-black/30 rounded-lg text-white">
                  <div className="mb-2">Поиск лица в кадре...</div>
                  <div className="text-sm">Посмотрите прямо в камеру</div>
                </div>
              ) : (
                <div className="text-center p-4 bg-black/30 rounded-lg text-white w-3/4">
                  <div className="mb-2">Лицо обнаружено! Сканирование...</div>
                  <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm mt-2">Не двигайтесь, пожалуйста</div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            {!faceDetected 
              ? "Пожалуйста, убедитесь, что ваше лицо хорошо видно и освещено"
              : "Система сканирует ваше лицо. Пожалуйста, не двигайтесь"
            }
          </p>
        </div>
      )}
      
      {step === "processing" && (
        <div className="text-center">
          <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100 aspect-video flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-xl">Обработка...</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Пожалуйста, подождите. Мы проверяем ваши биометрические данные...
          </p>
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
