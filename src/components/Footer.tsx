import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Taiwan Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
