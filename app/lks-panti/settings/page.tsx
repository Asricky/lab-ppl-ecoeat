export default function LksSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Settings</h1>
      </div>

      <section className="bg-white rounded-3xl border border-emerald-100 p-6">
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-700">Donation assignment alerts</p>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Enabled</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-700">Auto-confirm completed delivery</p>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Manual review</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <p className="font-semibold text-slate-700">Weekly impact report</p>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Email</span>
        </div>
      </section>
    </div>
  );
}
