import { useAppStore } from "@/store/appStore";

export function OverviewView() {
  const { selectedSubject } = useAppStore();
  
  // Use store value or fallback to the static design data
  const title = selectedSubject?.name || "Operating Systems";
  const summary = "Mastering kernel concepts, process management, and file systems. This course covers the fundamental interface between hardware and the user, including CPU scheduling, memory management, and security protocols.";

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Overview</h2>
        <p className="text-base text-[#4c669a]">Curriculum tracking for {title}</p>
      </div>

      <section className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
        <div 
          className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpzUWunC6Ky_9CW7Q-Mt9KRHJ1wbU3xvj-_u6GMww1rm0K6jtMdPUiPeYiBes2OHO7iKyA798RS1XIo4Z1rLQqRPG-Aqow-csFfJoAukoKj8nHOMSPn-YYwtNcZjuft9PRBp-M5LdCCyTUEotCvlYjntvQbTSnxnULVr1w0DzXVvm3U8_NS9gJjX_Ece2VU18L5V65yS07r7pcL98KI8bWgSZTp59sKPDWzj7rz6M09CcYd1D_JvfDVGipLQinnXdwZW1pJGTNCu0z")' }}
        ></div>
        <div className="p-6 md:p-8 flex-1">
          <h3 className="text-xl font-bold mb-2">Subject Summary</h3>
          <p className="text-[#4c669a] leading-relaxed">
            {summary}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-red-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">High Priority</p>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-xs mt-2 text-[#07883b] font-medium">+20% from last week</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-blue-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">Upcoming</p>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-xs mt-2 text-[#07883b] font-medium">+5% new material</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">Completed</p>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs mt-2 text-red-500 font-medium">-2% pace vs avg</p>
        </div>
      </div>

      <section className="bg-blue-50/50 border-2 border-[#135bec]/20 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#135bec] text-3xl">task_alt</span>
          <h3 className="text-2xl font-bold text-[#135bec]">Focus Today</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#135bec]/10 shadow-sm flex items-start gap-4">
            <div className="mt-1 flex items-center justify-center size-6 rounded-full bg-[#135bec]/10 text-[#135bec] text-xs font-bold">1</div>
            <div>
              <h4 className="font-bold text-[#0d121b]">Virtual Memory Management</h4>
              <p className="text-sm text-[#4c669a] mt-1">Review demand paging and page replacement algorithms.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#135bec]/10 shadow-sm flex items-start gap-4">
            <div className="mt-1 flex items-center justify-center size-6 rounded-full bg-[#135bec]/10 text-[#135bec] text-xs font-bold">2</div>
            <div>
              <h4 className="font-bold text-[#0d121b]">Deadlock Avoidance</h4>
              <p className="text-sm text-[#4c669a] mt-1">Practice Banker's algorithm and resource-allocation graphs.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="text-[#135bec] font-bold text-sm flex items-center gap-1 hover:underline">
            View full study path <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}
