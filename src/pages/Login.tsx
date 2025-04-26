import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthHeader from "@/components/AuthHeader";
import VideoVerification from "@/components/VideoVerification";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"credentials" | "verification">("credentials");
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Простая валидация
    if (!phone || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    
    // Симуляция проверки на сервере
    if (phone === "+79001234567" && password === "password") {
      // Симуляция: пользователь уже зарегистрирован
      setIsFirstLogin(false);
    } else if (phone === "+79001234568" && password === "password") {
      // Симуляция: новый пользователь
      setIsFirstLogin(true);
    } else {
      setError("Неверный телефон или пароль");
      return;
    }
    
    // Переход к видео-верификации
    setError("");
    setStep("verification");
  };

  const handleVerificationComplete = (success: boolean, errorMessage?: string) => {
    if (success) {
      // Успешная верификация - перенаправляем на главную
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else if (errorMessage) {
      // Если в сообщении об ошибке есть фраза о блокировке
      if (errorMessage.includes("Доступ заблокирован")) {
        // Можно добавить дополнительную логику при блокировке аккаунта
      }
      // Ошибка отображается в компоненте видео-верификации
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          {step === "credentials" ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold mb-6 text-center">Вход в аккаунт</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон или email
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Для тестирования используйте:
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Существующий: +79001234567 / password
                </p>
                <p className="text-xs text-gray-500">
                  Новый: +79001234568 / password
                </p>
              </div>
            </div>
          ) : (
            <VideoVerification 
              isFirstLogin={isFirstLogin}
              onVerificationComplete={handleVerificationComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
