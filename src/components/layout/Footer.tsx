const Footer = () => (
  <footer className="bg-card border-t border-border py-16">
    <div className="carter-container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <span className="font-serif text-lg tracking-[-0.02em] text-foreground">
          Carter
        </span>
        <p className="text-xs font-sans font-light text-muted-foreground">
          © {new Date().getFullYear()} Carter. Réseau confidentiel pour avocats d'affaires.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
