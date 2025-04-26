import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <header className="w-full bg-white shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-primary">АвитоКлон</div>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/register" className="text-sm text-gray-600 hover:text-primary">
            Регистрация
          </Link>
          <Link to="/login" className="text-sm text-gray-600 hover:text-primary">
            Вход
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
