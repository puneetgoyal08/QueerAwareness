import { Link, useLocation } from "wouter";
import { Heart } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Assessment", active: location === "/" },
    { href: "/resources", label: "Resources", active: location === "/resources" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">BiasAware</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  item.active 
                    ? "text-primary font-medium" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
