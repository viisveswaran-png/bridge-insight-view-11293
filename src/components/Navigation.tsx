import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flag, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  user: any;
}

const Navigation = ({ user }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "See you at the next race!",
    });
    navigate("/");
  };

  return (
    <header className="w-full bg-black/70 backdrop-blur-md shadow-md sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-primary flex items-center space-x-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          <Flag className="w-8 h-8" />
          <span>Hybrutos Racing</span>
        </Link>

        <ul className="hidden md:flex space-x-8 text-lg font-medium items-center">
          <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
          <li><Link to="/news" className="hover:text-primary transition">News</Link></li>
          <li><Link to="/gallery" className="hover:text-primary transition">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" className="hover:text-primary transition flex items-center gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </Link></li>
              <li>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:text-primary">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </li>
            </>
          ) : (
            <li><Link to="/auth" className="hover:text-primary transition">Login</Link></li>
          )}
        </ul>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md px-6 py-4 space-y-4 text-center text-lg font-medium">
          <Link to="/" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/news" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>News</Link>
          <Link to="/gallery" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <Link to="/contact" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Button onClick={handleSignOut} variant="ghost" className="w-full">Sign Out</Button>
            </>
          ) : (
            <Link to="/auth" className="block hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navigation;