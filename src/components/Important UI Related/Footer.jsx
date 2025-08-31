const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-gray-800 border border-gray-700 text-gray-300 p-6 rounded-t-xl">
      <aside>
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} - All rights reserved by Me Myself!
        </p>
      </aside>
    </footer>
  );
};
export default Footer;