export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-6 mt-10 border-t border-slate-700">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        {/* Left Section */}
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">AlgoforgeStudios.com</span>  
          – AI Exam System. All rights reserved.
        </p>

        {/* Right Section */}
        <div className="flex gap-6 text-sm">
          <a
            href="/privacy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="https://algoforgestudios.com"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            Visit Us
          </a>
        </div>
      </div>
    </footer>
  );
}
