const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto py-4">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} BitLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;