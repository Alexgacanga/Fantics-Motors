const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-gray-800 text-[#FFFFFF] pt-16 pb-8 mt-auto">
      {/* ======================= */}
      {/* MAIN FOOTER GRID        */}
      {/* ======================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col">
            {/* Logo */}
            <div className="text-2xl font-extrabold tracking-wider mb-4 cursor-pointer">
              <span>Fantics</span>
              <span className="text-[#FF5600] ml-1">Cars</span>
            </div>
            {/* Tagline & Description */}
            <h3 className="text-lg font-medium mb-3 text-gray-200">
              Performance, Prestige, and Power.
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier destination for high-quality, meticulously inspected vehicles. 
              We connect passionate drivers with their perfect ride through transparency and unmatched service.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-gray-500 uppercase tracking-wider font-semibold mb-6 text-sm">
              Company
            </h4>
            <nav>
              <ul className="space-y-4">
                {['Home', 'About Us'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-300 inline-block transform hover:translate-x-1 hover:text-[#FF5600] transition-all duration-300 ease-in-out font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Offerings & Support */}
          <div>
            <h4 className="text-gray-500 uppercase tracking-wider font-semibold mb-6 text-sm">
              Explore
            </h4>
            <nav>
              <ul className="space-y-4">
                {['Our Services', 'Contacts'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-300 inline-block transform hover:translate-x-1 hover:text-[#FF5600] transition-all duration-300 ease-in-out font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Connect With Us */}
          <div>
            <h4 className="text-gray-500 uppercase tracking-wider font-semibold mb-6 text-sm">
              Follow Us
            </h4>
            <div className="flex items-center gap-5">
              {/* Facebook */}
              <a href="#facebook" aria-label="Facebook" className="text-gray-400 hover:text-[#FF5600] hover:scale-110 transition-all duration-300 ease-in-out">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#instagram" aria-label="Instagram" className="text-gray-400 hover:text-[#FF5600] hover:scale-110 transition-all duration-300 ease-in-out">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#tiktok" aria-label="TikTok" className="text-gray-400 hover:text-[#FF5600] hover:scale-110 transition-all duration-300 ease-in-out">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.6 3.99-2.02 5.37-1.42 1.38-3.5 2.1-5.5 2.11-2.01.01-4.08-.7-5.5-2.09-1.42-1.39-2.02-3.41-2.02-5.38 0-1.96.6-3.99 2.02-5.37 1.42-1.38 3.5-2.1 5.5-2.1h.52v4.03h-.51c-1.39-.02-2.82.52-3.69 1.59-.87 1.07-1.12 2.65-.63 3.97.49 1.32 1.76 2.3 3.16 2.5 1.4.2 2.89-.25 3.95-1.11 1.06-.86 1.53-2.3 1.53-3.65v-14.8h3.11z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#whatsapp" aria-label="WhatsApp" className="text-gray-400 hover:text-[#FF5600] hover:scale-110 transition-all duration-300 ease-in-out">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.012 2C6.494 2 2.012 6.48 2.012 12c0 1.763.46 3.473 1.332 4.985L2 22l5.176-1.353a9.96 9.96 0 004.836 1.25h.004c5.517 0 9.998-4.48 9.998-10S17.529 2 12.012 2zm0 18.232c-1.492 0-2.955-.401-4.238-1.163l-.304-.18-3.149.826.84-3.072-.198-.314A8.343 8.343 0 013.666 12c0-4.601 3.743-8.343 8.346-8.343 4.602 0 8.344 3.742 8.344 8.343s-3.742 8.344-8.344 8.344zm4.582-6.262c-.251-.126-1.488-.735-1.718-.819-.23-.084-.398-.126-.566.126-.168.251-.649.819-.796.987-.146.168-.293.189-.544.063-.251-.126-1.062-.392-2.023-1.246-.748-.665-1.253-1.488-1.4-1.74-.147-.251-.016-.388.11-.513.113-.113.251-.294.377-.44.126-.147.168-.251.251-.42.084-.168.042-.314-.021-.44-.063-.126-.566-1.363-.775-1.867-.204-.492-.41-.426-.566-.434-.147-.008-.314-.008-.482-.008-.168 0-.44.063-.67.314-.23.251-.88 .86-.88 2.097 0 1.237.9 2.434 1.026 2.602.126.168 1.774 2.71 4.296 3.799.6.258 1.067.412 1.432.528.604.192 1.153.164 1.587.1.487-.072 1.488-.608 1.698-1.196.21-.588.21-1.092.147-1.196-.063-.105-.23-.168-.482-.294z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* BOTTOM COPYRIGHT BAR    */}
        {/* ======================= */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {currentYear} Fantics Motors. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#FF5600] transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#FF5600] transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;