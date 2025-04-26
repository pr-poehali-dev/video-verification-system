import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-primary">АвитоКлон</div>
            
            <div className="flex-1 max-w-xl mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск по объявлениям"
                  className="w-full py-2 px-4 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600">
                  Вход
                </Button>
              </Link>
              <Button>Подать объявление</Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        <section className="py-12 bg-gradient-to-r from-primary/30 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Продавайте и покупайте с уверенностью
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                С нашей системой видео-верификации все сделки становятся безопасными и прозрачными
              </p>
              <Button size="lg" className="px-8">
                Начать использовать
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Популярные объявления</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={`https://source.unsplash.com/random/300x200?sig=${item}`} 
                      alt="Товар" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-lg mb-1">Товар #{item}</div>
                    <div className="text-xl font-bold mb-2">{Math.floor(Math.random() * 20000 + 1000)} ₽</div>
                    <div className="text-sm text-gray-500">Москва, 2 часа назад</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">Показать больше</Button>
            </div>
          </div>
        </section>
        
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-10 text-center">Как работает видео-верификация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl font-semibold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Запись видео-селфи</h3>
                <p className="text-gray-600">
                  При первом входе запишите короткое видео, поворачивая голову по инструкции
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl font-semibold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Биометрическая защита</h3>
                <p className="text-gray-600">
                  Система создает уникальный отпечаток вашего лица для безопасного входа
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl font-semibold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Безопасный доступ</h3>
                <p className="text-gray-600">
                  При каждом входе подтверждайте личность с помощью нового видео-селфи
                </p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/login">
                <Button size="lg">Попробовать прямо сейчас</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">АвитоКлон</h3>
              <p className="text-gray-400">
                Безопасная платформа для покупки и продажи с передовой системой видео-верификации
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">О нас</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Безопасность</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Помощь</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Правовая информация</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Правила размещения</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} АвитоКлон. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
