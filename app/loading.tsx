
export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-green-600"
        >
          <style>
            {`
              .spinner_aj0A {
                transform-origin: center;
                animation: spinner_OvxK 2s linear infinite;
              }
              .spinner_oXPr {
                stroke-dasharray: 1 97;
                stroke-dashoffset: 0;
                animation: spinner_5w0B 1.5s ease-in-out infinite;
              }
              @keyframes spinner_OvxK {
                100% {
                  transform: rotate(360deg);
                }
              }
              @keyframes spinner_5w0B {
                0% {
                  stroke-dasharray: 1 97;
                  stroke-dashoffset: 0;
                }
                50% {
                  stroke-dasharray: 90 97;
                  stroke-dashoffset: -20;
                }
                100% {
                  stroke-dasharray: 90 97;
                  stroke-dashoffset: -124;
                }
              }
            `}
          </style>
          <circle 
            className="spinner_aj0A spinner_oXPr" 
            cx="12" 
            cy="12" 
            r="9.5" 
            fill="none" 
            strokeWidth="3" 
            stroke="currentColor" 
          />
        </svg>
        <span className="text-sm font-bold tracking-widest uppercase" style={{ color: "var(--green-700)" }}>
          Memuat...
        </span>
      </div>
    </div>
  );
}
