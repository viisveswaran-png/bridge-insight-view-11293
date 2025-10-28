import { Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black/80 text-muted-foreground text-center py-6 mt-20">
      <p>© 2024 Hybrutos Racing. All rights reserved.</p>
      <div className="mt-3 flex justify-center space-x-6 text-primary text-xl">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <Twitter className="w-6 h-6 hover:scale-110 transition-transform" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <Facebook className="w-6 h-6 hover:scale-110 transition-transform" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram className="w-6 h-6 hover:scale-110 transition-transform" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;