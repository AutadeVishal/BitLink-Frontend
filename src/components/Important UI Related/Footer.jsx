const Footer = () => {
  return (
    <footer className="mt-auto bg-black/30 backdrop-blur-sm">
      <div className="gradient-divider" />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="brand-word text-lg text-red-100/80">BitLink</span>
            <span className="text-xs text-red-300/60">•</span>
            <p className="text-sm text-red-200/80">
              Crafted for meaningful tech connections
            </p>
          </div>
          <p className="text-xs text-red-300/60">
            © {new Date().getFullYear()} BitLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;