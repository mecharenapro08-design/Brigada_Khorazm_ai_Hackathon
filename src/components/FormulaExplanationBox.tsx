import React from "react";
import {
  Lightbulb,
  BookOpen,
  Info,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";

export type LabSimType = "pythagoras" | "atom" | "optics" | "projectile" | "spring";

interface FormulaExplanationBoxProps {
  type: LabSimType;
  dimension: "2d" | "3d";
  params?: {
    pythA?: number;
    pythB?: number;
    element?: "H" | "He" | "Li" | "C" | "O";
    speed?: number;
    prismAngle?: number;
    prismMaterial?: "crown" | "flint" | "diamond";
    velocity?: number;
    angle?: number;
    mass?: number;
    k?: number;
    offset?: number;
  };
}

export const FormulaExplanationBox: React.FC<FormulaExplanationBoxProps> = ({
  type,
  dimension,
  params = {},
}) => {
  // 1. PYTHAGORAS EXPLANATION
  if (type === "pythagoras") {
    const a = params.pythA || 6;
    const b = params.pythB || 8;
    const a2 = a * a;
    const b2 = b * b;
    const c2 = a2 + b2;
    const c = Math.sqrt(c2);

    return (
      <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/30 text-slate-200 text-xs space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Pifagor Teoremasi Formulalari & Tushunchasi ({dimension.toUpperCase()})</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-800">
            c² = a² + b²
          </span>
        </div>

        {/* Formula calculation breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2 text-indigo-300">
          <div>
            <span className="text-slate-400">Joriy hisoblash: </span>
            <span className="font-bold text-white">{a}²</span> + <span className="font-bold text-white">{b}²</span> = {a2} + {b2} = <span className="text-emerald-400 font-bold">{c2}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>c = √({c2}) = {c.toFixed(2)} sm</span>
          </div>
        </div>

        {/* Conceptual explanation */}
        <div className="space-y-1.5 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-amber-400">Teoremaning ilmiy mohiyati:</strong> Toʻgʻri burchakli (90°) uchburchakda gipotenuza tomoniga qurilgan kvadrat yuzasi katetlarga qurilgan kvadratlar yuzalari yigʻindisiga mutlaq tengdir. {dimension === "3d" ? "3D fazoda katetlar ustidagi prizmalar yoki kublarning hajmlari ham shu qonuniyatga mos keladi." : "2D tekislikdagi har bir katakcha kvadrat santimetr (sm²) maydonni ifodalaydi."}
          </p>
        </div>

        {/* Parameters glossary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-indigo-400 font-mono text-[11px]">a = {a} sm</div>
            <div className="text-[11px] text-slate-400">Gorizontal katet (asos) uzunligi. Maydoni: {a2} sm².</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-cyan-400 font-mono text-[11px]">b = {b} sm</div>
            <div className="text-[11px] text-slate-400">Vertikal katet (balandlik) uzunligi. Maydoni: {b2} sm².</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-emerald-400 font-mono text-[11px]">c = {c.toFixed(2)} sm</div>
            <div className="text-[11px] text-slate-400">Gipotenuza (eng uzun tomon). Kvadrat yuzi: {c2} sm².</div>
          </div>
        </div>

        {/* Practical Application */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <span className="text-indigo-400 font-bold">Amaliy tatbiqi:</span>
          <span>GPS geolokatsiya, bino poydevorini toʻgʻri burchakka tekshirish (3:4:5 Misr uchburchagi), fazoviy 3D grafiklar va koordinatalar tizimi.</span>
        </div>
      </div>
    );
  }

  // 2. ATOM BOHR MODEL EXPLANATION
  if (type === "atom") {
    const elem = params.element || "C";
    const elemData: Record<string, { name: string; p: number; n: number; e: number; config: string }> = {
      H: { name: "Vodorod (H)", p: 1, n: 0, e: 1, config: "1s¹ (1-qavat: 1e)" },
      He: { name: "Geliy (He)", p: 2, n: 2, e: 2, config: "1s² (1-qavat: 2e)" },
      Li: { name: "Litiy (Li)", p: 3, n: 4, e: 3, config: "1s² 2s¹ (1-qavat: 2e, 2-qavat: 1e)" },
      C: { name: "Uglerod (C)", p: 6, n: 6, e: 6, config: "1s² 2s² 2p² (1-qavat: 2e, 2-qavat: 4e)" },
      O: { name: "Kislorod (O)", p: 8, n: 8, e: 8, config: "1s² 2s² 2p⁴ (1-qavat: 2e, 2-qavat: 6e)" },
    };
    const cur = elemData[elem] || elemData.C;

    return (
      <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/30 text-slate-200 text-xs space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Bohr Atom Modeli & Kvant Formulalari Tushunchasi ({dimension.toUpperCase()})</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
            r_n = n² · a₀
          </span>
        </div>

        {/* Formula calculation breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2 text-cyan-300">
          <div>
            <span className="text-slate-400">Kvant holat formulasi: </span>
            <span className="font-bold text-white">r_n = n² · 0.0529 nm</span>, <span className="font-bold text-amber-400">E_n = -13.6 eV / n²</span>
          </div>
          <div className="text-xs font-bold text-cyan-400">
            {cur.name} • {cur.e} ta elektron ({cur.config})
          </div>
        </div>

        {/* Conceptual explanation */}
        <div className="space-y-1.5 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-cyan-400">Fizikaviy mohiyati:</strong> Nil Bohr postulatiga koʻra elektronlar yadro atrofida ixtiyoriy emas, balki faqat kvantlangan statsionar orbitalar boʻylab nurlanmasdan aylanadi. Elektron bitta orbitadan ikkinchisiga oʻtgandagina foton yutadi yoki chiqaradi: <span className="font-mono text-amber-400">ΔE = h·ν</span>.
          </p>
        </div>

        {/* Parameters glossary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-rose-400 font-mono text-[11px]">Z = {cur.p} (Yadro zaryadi)</div>
            <div className="text-[11px] text-slate-400">{cur.p} ta musbat proton va {cur.n} ta neytrondan iborat zich yadro.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-cyan-400 font-mono text-[11px]">n (Bosh kvant soni)</div>
            <div className="text-[11px] text-slate-400">Energetik qavat (n = 1, 2...). n oshgan sari orbital radiusi n² ga mutanosib kattalashadi.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-amber-400 font-mono text-[11px]">a₀ ≈ 0.0529 nm</div>
            <div className="text-[11px] text-slate-400">Bohr radiusi — vodorod atomi 1-orbitasining radius oʻlchami.</div>
          </div>
        </div>

        {/* Practical Application */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <span className="text-cyan-400 font-bold">Amaliy tatbiqi:</span>
          <span>Spektral analiz, lazer nurlanishi fizikasi, quyosh panellari va kremniy yarimoʻtkazgichli chiplar texnologiyasi.</span>
        </div>
      </div>
    );
  }

  // 3. OPTICS & SNELL'S LAW EXPLANATION
  if (type === "optics") {
    const angle = params.prismAngle || 45;
    const mat = params.prismMaterial || "flint";
    const refIdxMap = { crown: 1.52, flint: 1.66, diamond: 2.42 };
    const n = refIdxMap[mat] || 1.66;
    const sinAlpha = Math.sin((angle * Math.PI) / 180);
    const sinBeta = sinAlpha / n;
    const betaDeg = (Math.asin(Math.min(1, sinBeta)) * 180) / Math.PI;

    return (
      <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-amber-500/30 text-slate-200 text-xs space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Yorugʻlik Sinishi (Snellius) & Dispersiya Formulalari ({dimension.toUpperCase()})</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono text-[10px] border border-amber-800">
            n₁·sin(α) = n₂·sin(β)
          </span>
        </div>

        {/* Formula calculation breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2 text-amber-300">
          <div>
            <span className="text-slate-400">Sinish hisobi: </span>
            sin(β) = sin({angle}°)/{n} = {sinAlpha.toFixed(3)}/{n} = <span className="font-bold text-white">{sinBeta.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Sinish burchagi β = {betaDeg.toFixed(1)}°</span>
          </div>
        </div>

        {/* Conceptual explanation */}
        <div className="space-y-1.5 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-amber-400">Qonuniyat tushunchasi:</strong> Yorugʻlik kamroq optik zich muhitdan (havo n₁ ≈ 1.0) zichroq muhitga (shisha/olmos n₂ = {n}) oʻtganda tezligi kamayadi va nur normalga tomon sinadi. Koshi formulasi <span className="font-mono text-cyan-300">n(λ) = A + B/λ²</span> boʻyicha qizil rang (uzun toʻlqin) kamroq, binafsha rang (qisqa toʻlqin) koʻproq sinadi va 7 rangli kamalak spektriga ajraladi (dispersiya).
          </p>
        </div>

        {/* Parameters glossary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-amber-400 font-mono text-[11px]">α = {angle}° (Tushish burchagi)</div>
            <div className="text-[11px] text-slate-400">Nur va muhit chegarasi normali oʻrtasidagi burchak.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-cyan-400 font-mono text-[11px]">n = {n} (Sindirish koeffitsiyenti)</div>
            <div className="text-[11px] text-slate-400">{mat === "diamond" ? "Olmos (n = 2.42, oʻta kuchli sinish)" : mat === "flint" ? "Flint shisha (n = 1.66)" : "Krona shisha (n = 1.52)"}.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-emerald-400 font-mono text-[11px]">β = {betaDeg.toFixed(1)}° (Sinish burchagi)</div>
            <div className="text-[11px] text-slate-400">Prizma ichidagi nurning yangi tarqalish burchagi.</div>
          </div>
        </div>

        {/* Practical Application */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <span className="text-amber-400 font-bold">Amaliy tatbiqi:</span>
          <span>Koʻzoynak va mikroskop linzalari, fotoapparat obyektivlari, optik tolali yuqori tezlikdagi internet kabellari.</span>
        </div>
      </div>
    );
  }

  // 4. PROJECTILE / BALLISTICS EXPLANATION
  if (type === "projectile") {
    const v0 = params.velocity || 30;
    const deg = params.angle || 45;
    const rad = (deg * Math.PI) / 180;
    const g = 9.8;
    const maxRange = (v0 * v0 * Math.sin(2 * rad)) / g;
    const maxHeight = (v0 * v0 * Math.pow(Math.sin(rad), 2)) / (2 * g);
    const flightTime = (2 * v0 * Math.sin(rad)) / g;

    return (
      <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-rose-500/30 text-slate-200 text-xs space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Ballistika & Parabola Harakati Formulalari ({dimension.toUpperCase()})</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 font-mono text-[10px] border border-rose-800">
            L = (v₀² · sin(2α)) / g
          </span>
        </div>

        {/* Formula calculation breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2 text-rose-300">
          <div>
            <span className="text-slate-400">Hisoblangan masofa: </span>
            ({v0}² · sin({2 * deg}°)) / 9.8 = <span className="font-bold text-white text-sm">{maxRange.toFixed(1)} m</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span>H_max = {maxHeight.toFixed(1)} m</span> • <span>t_uch = {flightTime.toFixed(1)} s</span>
          </div>
        </div>

        {/* Conceptual explanation */}
        <div className="space-y-1.5 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-rose-400">Harakat mohiyati:</strong> Jism gorizontal oʻq boʻyicha tekis (v_x = v₀·cosα = doimiy), vertikal oʻq boʻyicha esa erkin tushish tezlanishi (g = 9.8 m/s²) ostida tekis oʻzgaruvchan harakatlanib, simmetrik parabola chizadi. <strong className="text-amber-400">45° burchakda</strong> sin(2α) = sin(90°) = 1 boʻlib, parvoz masofasi eng uzoq (maksimal) boʻladi.
          </p>
        </div>

        {/* Parameters glossary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-rose-400 font-mono text-[11px]">v₀ = {v0} m/s</div>
            <div className="text-[11px] text-slate-400">Boshlangʻich otilish tezligi vektori.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-amber-400 font-mono text-[11px]">α = {deg}°</div>
            <div className="text-[11px] text-slate-400">Gorizontga nisbatan burchak.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-cyan-400 font-mono text-[11px]">g = 9.8 m/s²</div>
            <div className="text-[11px] text-slate-400">Yerning tortishish kuchi tezlanishi.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-emerald-400 font-mono text-[11px]">L = {maxRange.toFixed(1)} m</div>
            <div className="text-[11px] text-slate-400">Maksimal uchish uzoqligi (diapazon).</div>
          </div>
        </div>

        {/* Practical Application */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <span className="text-rose-400 font-bold">Amaliy tatbiqi:</span>
          <span>Kosmik raketalar uchirilishi, ballistik traektoriyalar, sport oʻyinlari (futbol, basketbol toʻpi otilishi) va aeronavtika.</span>
        </div>
      </div>
    );
  }

  // 5. SPRING / HOOKE'S LAW EXPLANATION
  if (type === "spring") {
    const m = params.mass || 2;
    const k = params.k || 40;
    const period = 2 * Math.PI * Math.sqrt(m / k);
    const frequency = 1 / period;
    const omega = Math.sqrt(k / m);

    return (
      <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 text-slate-200 text-xs space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Guk Qonuni & Tebranish Mayatnigi Formulalari ({dimension.toUpperCase()})</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
            F = -k·x & T = 2π·√(m/k)
          </span>
        </div>

        {/* Formula calculation breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2 text-emerald-300">
          <div>
            <span className="text-slate-400">Tebranish davri: </span>
            T = 2π · √({m}/{k}) = 2π · √({(m / k).toFixed(3)}) = <span className="font-bold text-white text-sm">{period.toFixed(2)} soniya</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span>ν = {frequency.toFixed(2)} Hz</span> • <span>ω = {omega.toFixed(2)} rad/s</span>
          </div>
        </div>

        {/* Conceptual explanation */}
        <div className="space-y-1.5 text-slate-300 leading-relaxed">
          <p>
            <strong className="text-emerald-400">Qonun mohiyati:</strong> Prujina siqilganda yoki choʻzilganida hosil boʻladigan elastiklik kuchi <span className="font-mono text-amber-300">F = -k·x</span> uning siljishiga toʻgʻri mutanosib boʻlib, muvozanat holatiga qarab qaytarishga intiladi. Tebranish davri (T) faqat yuk massasi (m) va prujina bikrligi (k) ga bogʻliq — <strong className="text-cyan-300">bikrlik (k) ortsa prujina qattiqlashib, tebranish tezlashadi (T kamayadi)</strong>, ogʻir yuk (m) osilsa esa tebranish sekinlashadi (T ortadi).
          </p>
        </div>

        {/* Parameters glossary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-indigo-400 font-mono text-[11px]">m = {m} kg</div>
            <div className="text-[11px] text-slate-400">Prujinaga osilgan yukning inersial massasi.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-emerald-400 font-mono text-[11px]">k = {k} N/m</div>
            <div className="text-[11px] text-slate-400">Bikrlik koeffitsiyenti (prujinaning qattiqligi).</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-cyan-400 font-mono text-[11px]">T = {period.toFixed(2)} s</div>
            <div className="text-[11px] text-slate-400">1 ta toʻliq tebranishni amalga oshirish vaqti.</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="font-bold text-amber-400 font-mono text-[11px]">ν = {frequency.toFixed(2)} Hz</div>
            <div className="text-[11px] text-slate-400">1 soniyadagi tebranishlar soni (chastota).</div>
          </div>
        </div>

        {/* Practical Application */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <span className="text-emerald-400 font-bold">Amaliy tatbiqi:</span>
          <span>Avtomobillar osmasi (amortizatorlar), zilzila seysmograflari, poezd vagonlari prujinalari va mexanik soatlar.</span>
        </div>
      </div>
    );
  }

  return null;
};
