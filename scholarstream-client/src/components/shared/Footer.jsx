import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
           <Link to="/" className="flex items-center gap-2 mb-6">
  <img
    src="/logo.png"                 // public/logo.png ধরে নিচ্ছি
    alt="ScholarStream logo"
    className="w-8 h-8 rounded-lg object-cover"
    width={40}
    height={40}
  />
  <span className="text-xl font-display font-bold text-primary">
    Scholar<span className="text-primary">Stream</span>
  </span>
</Link>

            <p className="text-slate-400 mb-6">
              Connecting students with life-changing scholarship opportunities worldwide. 
            
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiFacebook size={20} />
              </a>
            <a
  href="https://x.com"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
</a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="text-slate-400 hover:text-accent transition-colors">
                  All Scholarships
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-accent transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-accent transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Scholarship Types */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6">Scholarship Types</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-slate-400">Full Fund Scholarships</span>
              </li>
              <li>
                <span className="text-slate-400">Partial Scholarships</span>
              </li>
              <li>
                <span className="text-slate-400">Self-fund Programs</span>
              </li>
              <li>
                <span className="text-slate-400">Research Grants</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-400">
                  123 Education Street, EDU 1212
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary flex-shrink-0" size={20} />
                <span className="text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary flex-shrink-0" size={20} />
                <span className="text-slate-400">info@scholarstream.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © {currentYear} ScholarStream. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-400 text-sm hover:text-accent transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-slate-400 text-sm hover:text-accent transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
