import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthHeader from "@/components/AuthHeader";
import VideoVerification from "@/components/VideoVerification";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [step, setStep] = useState<"credentials" | "verification">("credentials");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Простая валидация
    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
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
              <h1 className="text-2xl font-semibold mb-6 text-center">Регистрация</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Пароль <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Введите пароль"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Подтверждение пароля <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Повторите пароль"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Зарегистрироваться
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Уже есть аккаунт? <a href="/login" className="text-primary hover:underline">Войти</a>
              </div>
            </div>
          ) : (
            <VideoVerification 
              isFirstLogin={true}
              onVerificationComplete={handleVerificationComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
