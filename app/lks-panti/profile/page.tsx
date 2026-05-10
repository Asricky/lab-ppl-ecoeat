import { Building2, ShieldCheck, Users, Snowflake, Warehouse } from 'lucide-react';

export default function LksProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Profile</h1>
      </div>

      <section className="bg-white rounded-3xl border border-emerald-100 p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Building2 size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-emerald-950">Yayasan Berbagi Nusantara</h2>
            <p className="text-sm font-semibold text-emerald-700 inline-flex items-center gap-1">
              <ShieldCheck size={16} /> Verified LKS Partner
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Legal Permit</p>
            <p className="font-bold text-emerald-950">LKS-DINSOS/3174/2024</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Capacity</p>
            <p className="font-bold text-emerald-950 inline-flex items-center gap-2"><Users size={16} /> 135 beneficiaries</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Food Storage</p>
            <p className="font-bold text-emerald-950 inline-flex items-center gap-2"><Snowflake size={16} /> Chiller Active</p>
            <p className="text-sm text-slate-600 inline-flex items-center gap-2 mt-1"><Warehouse size={14} /> Dry storage 78% available</p>
          </div>
        </div>
      </section>
    </div>
  );
}
