import { useState, useEffect } from "react";
import {
  Leaf, Heart, Users, Package, ArrowRight, Star, MapPin, Bell, Settings,
  LogOut, Menu, X, Search, Plus, Eye, ChevronRight, BarChart2,
  Truck, Clock, CheckCircle, AlertCircle, Phone, Mail, Globe, User,
  Building, Shield, Download, Edit2, Trash2, Activity, Award,
  AlertTriangle, RefreshCw, Info, Check, Home, Inbox, Utensils,
  HandHeart, ChevronLeft, CheckCircle2, Camera, Hash, ExternalLink,
  Zap, Target, MessageSquare
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const FOOD_ITEMS = [
  { id: "f1", title: "Biryani & Dal — 40 Portions", category: "Cooked Food", qty: 40, unit: "portions", expiry: "2025-06-14 20:00", pickup: "6 PM – 8 PM", location: "Bandra West, Mumbai", status: "available", donor: "The Grand Spice", donorId: "d1", img: "photo-1504674900247-0877df9cc836", posted: "2 hrs ago", servings: 40, allergens: ["Gluten", "Dairy"] },
  { id: "f2", title: "Mixed Vegetables — 15 kg", category: "Raw Produce", qty: 15, unit: "kg", expiry: "2025-06-15 10:00", pickup: "8 AM – 11 AM", location: "Dadar, Mumbai", status: "requested", donor: "Fresh Farms Ltd.", donorId: "d2", img: "photo-1540420773420-3366772f4999", posted: "5 hrs ago", servings: 30, allergens: [] },
  { id: "f3", title: "Bread Loaves — 60 pcs", category: "Bakery", qty: 60, unit: "pieces", expiry: "2025-06-14 18:00", pickup: "4 PM – 6 PM", location: "Andheri East, Mumbai", status: "accepted", donor: "Golden Crust Bakery", donorId: "d3", img: "photo-1509440159596-0249088772ff", posted: "1 hr ago", servings: 60, allergens: ["Gluten"] },
  { id: "f4", title: "Paneer Butter Masala — 25 kg", category: "Cooked Food", qty: 25, unit: "kg", expiry: "2025-06-14 22:00", pickup: "9 PM – 11 PM", location: "Powai, Mumbai", status: "completed", donor: "Hotel Crown Plaza", donorId: "d1", img: "photo-1585937421612-70a008356fbe", posted: "1 day ago", servings: 50, allergens: ["Dairy"] },
  { id: "f5", title: "Fruit Basket — 20 kg", category: "Fruits & Dry Fruits", qty: 20, unit: "kg", expiry: "2025-06-16 12:00", pickup: "10 AM – 12 PM", location: "Juhu, Mumbai", status: "available", donor: "Nature's Basket", donorId: "d2", img: "photo-1518843875459-f738682238a6", posted: "3 hrs ago", servings: 40, allergens: [] },
  { id: "f6", title: "Rice & Rajma — 35 Portions", category: "Cooked Food", qty: 35, unit: "portions", expiry: "2025-06-14 19:00", pickup: "5 PM – 7 PM", location: "Kurla, Mumbai", status: "available", donor: "Annapurna Restaurant", donorId: "d3", img: "photo-1512621776951-a57141f2eefd", posted: "4 hrs ago", servings: 35, allergens: ["Gluten"] },
  { id: "f7", title: "Milk Packets — 30 L", category: "Dairy", qty: 30, unit: "litres", expiry: "2025-06-15 06:00", pickup: "5 AM – 7 AM", location: "Chembur, Mumbai", status: "expired", donor: "Mother Dairy", donorId: "d2", img: "photo-1550583724-b2692b85b150", posted: "8 hrs ago", servings: 60, allergens: ["Dairy"] },
  { id: "f8", title: "Assembled Sandwiches — 80 pcs", category: "Bakery", qty: 80, unit: "pieces", expiry: "2025-06-14 16:00", pickup: "2 PM – 4 PM", location: "Borivali, Mumbai", status: "collected", donor: "Subway Franchise", donorId: "d1", img: "photo-1619740455993-9d622bd15a5c", posted: "6 hrs ago", servings: 80, allergens: ["Gluten", "Dairy"] },
];

const NGOS = [
  { id: "n1", name: "Roti Bank Mumbai", email: "contact@rotibank.org", phone: "+91 98765 43210", address: "Dharavi, Mumbai", category: "Food Relief", verified: true, status: "approved", meals: 12400, joined: "Jan 2022", logo: "photo-1559027615-cd4628902d4a", desc: "Providing cooked meals to underprivileged communities across Mumbai.", regNo: "MH/NGO/2022/0045" },
  { id: "n2", name: "Hunger Free India", email: "info@hungerfree.in", phone: "+91 87654 32109", address: "Bandra, Mumbai", category: "Community Kitchen", verified: true, status: "approved", meals: 8900, joined: "Mar 2022", logo: "photo-1488521787991-ed7bbaae773c", desc: "Running 12 community kitchens serving 2000+ meals daily.", regNo: "MH/NGO/2022/0123" },
  { id: "n3", name: "AnnaData Foundation", email: "hello@annadata.org", phone: "+91 76543 21098", address: "Thane, Mumbai", category: "Orphanage Support", verified: false, status: "pending", meals: 3200, joined: "Jun 2023", logo: "photo-1521791136064-7986c2920216", desc: "Supporting orphanages and old-age homes with nutritious meals.", regNo: "MH/NGO/2023/0567" },
  { id: "n4", name: "Seva Sadan Trust", email: "trust@sevasadan.org", phone: "+91 65432 10987", address: "Worli, Mumbai", category: "Slum Outreach", verified: true, status: "approved", meals: 19600, joined: "Nov 2021", logo: "photo-1559027615-cd4628902d4a", desc: "Daily outreach to 8 slum pockets with cooked food and dry rations.", regNo: "MH/NGO/2021/0234" },
  { id: "n5", name: "Meal Magic NGO", email: "care@mealmagic.in", phone: "+91 54321 09876", address: "Vashi, Navi Mumbai", category: "School Nutrition", verified: false, status: "pending", meals: 1400, joined: "Jan 2024", logo: "photo-1488521787991-ed7bbaae773c", desc: "Partnering with government schools to provide midday meal supplements.", regNo: "MH/NGO/2024/0089" },
];

const REQUESTS = [
  { id: "r1", foodId: "f2", food: "Mixed Vegetables — 15 kg", ngoId: "n1", ngo: "Roti Bank Mumbai", donorId: "d1", donor: "The Grand Spice", reqAt: "2 hrs ago", status: "pending", pickup: "Tomorrow 8 AM", qty: "15 kg", note: "We serve 200 daily — vegetables essential for dal preparations." },
  { id: "r2", foodId: "f1", food: "Biryani & Dal — 40 Portions", ngoId: "n2", ngo: "Hunger Free India", donorId: "d1", donor: "The Grand Spice", reqAt: "5 hrs ago", status: "accepted", pickup: "Today 6 PM", qty: "40 portions", note: "Will send our refrigerated van for safe transport." },
  { id: "r3", foodId: "f8", food: "Assembled Sandwiches", ngoId: "n4", ngo: "Seva Sadan Trust", donorId: "d2", donor: "Fresh Farms Ltd.", reqAt: "1 day ago", status: "completed", pickup: "Yesterday 3 PM", qty: "80 pieces", note: "Great quality. Thank you for the donation!" },
  { id: "r4", foodId: "f3", food: "Bread Loaves — 60 pcs", ngoId: "n1", ngo: "Roti Bank Mumbai", donorId: "d3", donor: "Golden Crust Bakery", reqAt: "3 hrs ago", status: "accepted", pickup: "Today 4 PM", qty: "60 pieces", note: "Will distribute tonight at Dharavi shelter." },
  { id: "r5", foodId: "f6", food: "Rice & Rajma — 35 Portions", ngoId: "n3", ngo: "AnnaData Foundation", donorId: "d3", donor: "Annapurna Restaurant", reqAt: "1 hr ago", status: "rejected", pickup: "Today 5 PM", qty: "35 portions", note: "Our capacity currently full. Will request next time." },
];

const NOTIFS = [
  { id: "no1", title: "Request Accepted!", msg: "Roti Bank Mumbai accepted your food listing 'Biryani & Dal'. Pickup at 6 PM today.", type: "success", read: false, time: "10 min ago" },
  { id: "no2", title: "New Request Received", msg: "Hunger Free India has requested your 'Mixed Vegetables — 15 kg' listing.", type: "info", read: false, time: "2 hrs ago" },
  { id: "no3", title: "Food Collected Successfully", msg: "Seva Sadan Trust has collected 'Assembled Sandwiches'. Donation marked complete!", type: "success", read: true, time: "1 day ago" },
  { id: "no4", title: "Listing Expiring Soon", msg: "Your 'Bread Loaves — 60 pcs' listing expires in 2 hours. Make sure pickup is arranged.", type: "warning", read: true, time: "3 hrs ago" },
  { id: "no5", title: "NGO Request Rejected", msg: "AnnaData Foundation couldn't fulfill the pickup for Rice & Rajma. Listing is available again.", type: "error", read: true, time: "4 hrs ago" },
  { id: "no6", title: "Welcome to ResQMeal!", msg: "Your donor account is verified. Start rescuing food and feeding lives today!", type: "info", read: true, time: "Jan 10, 2025" },
];

const MONTHLY_DATA = [
  { month: "Jan", donations: 28, meals: 840, requests: 24 },
  { month: "Feb", donations: 34, meals: 1020, requests: 31 },
  { month: "Mar", donations: 41, meals: 1230, requests: 38 },
  { month: "Apr", donations: 38, meals: 1140, requests: 35 },
  { month: "May", donations: 52, meals: 1560, requests: 48 },
  { month: "Jun", donations: 47, meals: 1410, requests: 43 },
  { month: "Jul", donations: 63, meals: 1890, requests: 58 },
  { month: "Aug", donations: 71, meals: 2130, requests: 65 },
  { month: "Sep", donations: 58, meals: 1740, requests: 52 },
  { month: "Oct", donations: 84, meals: 2520, requests: 78 },
  { month: "Nov", donations: 92, meals: 2760, requests: 85 },
  { month: "Dec", donations: 106, meals: 3180, requests: 98 },
];

const CAT_DATA = [
  { name: "Cooked Food", value: 42, color: "#065F46" },
  { name: "Raw Produce", value: 22, color: "#059669" },
  { name: "Bakery", value: 18, color: "#10B981" },
  { name: "Dairy", value: 10, color: "#34D399" },
  { name: "Others", value: 8, color: "#A7F3D0" },
];

const PICKUP_STEPS = ["Requested", "Donor Accepted", "NGO En Route", "Arrived at Location", "Food Collected", "Completed"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  available:  { bg: "bg-emerald-100",  text: "text-emerald-700", dot: "bg-emerald-500" },
  requested:  { bg: "bg-amber-100",    text: "text-amber-700",   dot: "bg-amber-500" },
  accepted:   { bg: "bg-blue-100",     text: "text-blue-700",    dot: "bg-blue-500" },
  collected:  { bg: "bg-purple-100",   text: "text-purple-700",  dot: "bg-purple-500" },
  completed:  { bg: "bg-teal-100",     text: "text-teal-700",    dot: "bg-teal-500" },
  expired:    { bg: "bg-red-100",      text: "text-red-700",     dot: "bg-red-500" },
  rejected:   { bg: "bg-red-100",      text: "text-red-700",     dot: "bg-red-500" },
  pending:    { bg: "bg-amber-100",    text: "text-amber-700",   dot: "bg-amber-500" },
  approved:   { bg: "bg-emerald-100",  text: "text-emerald-700", dot: "bg-emerald-500" },
  "en route": { bg: "bg-blue-100",     text: "text-blue-700",    dot: "bg-blue-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status.toLowerCase()] ?? { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, className = "", type = "button", disabled = false }: any) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes: any = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants: any = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md",
    secondary: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
    outline: "border border-border text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    dark: "bg-emerald-900 text-white hover:bg-emerald-800 shadow-sm",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "emerald" }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50   text-amber-600",
    blue:    "bg-blue-50    text-blue-600",
    purple:  "bg-purple-50  text-purple-600",
    teal:    "bg-teal-50    text-teal-600",
    red:     "bg-red-50     text-red-600",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-sm font-semibold text-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function FoodCard({ item, onView, onRequest, role }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="relative h-44 bg-emerald-50 overflow-hidden">
        <img
          src={`https://images.unsplash.com/${item.img}?w=400&h=220&fit=crop&auto=format`}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={item.status} />
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {item.qty} {item.unit}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-emerald-600 font-semibold mb-1">{item.category}</div>
        <h3 className="font-bold text-foreground text-sm leading-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin size={11} /> {item.location}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Clock size={11} /> Pickup: {item.pickup}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.posted}</span>
          <div className="flex gap-2">
            <Btn size="sm" variant="outline" onClick={() => onView(item)}><Eye size={12} /> View</Btn>
            {role === "ngo" && item.status === "available" && (
              <Btn size="sm" onClick={() => onRequest(item)}><HandHeart size={12} /> Request</Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, icon: Icon, required }: any) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-foreground mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full border border-border rounded-xl py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors bg-input-background ${Icon ? "pl-9 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange, required }: any) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-foreground mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select value={value} onChange={onChange} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors bg-input-background">
        {options.map((o: any) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, rows = 4, required }: any) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-foreground mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors bg-input-background resize-none"
      />
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}

// ─── PUBLIC LAYOUT ────────────────────────────────────────────────────────────

function PublicNav({ view, navigate }: any) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "home"], ["About", "about"], ["How It Works", "how-it-works"],
    ["Impact", "impact"], ["Contact", "contact"],
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-emerald-900 text-lg" style={{ fontFamily: "var(--font-display)" }}>ResQMeal</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {links.map(([l, v]) => (
              <button key={v} onClick={() => navigate(v)} className={`text-sm font-medium transition-colors ${view === v ? "text-emerald-600" : "text-foreground hover:text-emerald-600"}`}>{l}</button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Btn variant="outline" size="sm" onClick={() => navigate("donor-login")}>Donor Login</Btn>
            <Btn size="sm" onClick={() => navigate("ngo-login")}>NGO Login</Btn>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-2">
          {links.map(([l, v]) => (
            <button key={v} onClick={() => { navigate(v); setOpen(false); }} className="w-full text-left py-2 text-sm font-medium text-foreground hover:text-emerald-600">{l}</button>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Btn variant="outline" size="sm" onClick={() => navigate("donor-login")}>Donor Login</Btn>
            <Btn size="sm" onClick={() => navigate("ngo-login")}>NGO Login</Btn>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer({ navigate }: any) {
  return (
    <footer className="bg-emerald-950 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-display)" }}>ResQMeal</span>
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed">Connecting food donors with verified NGOs to rescue surplus food and reduce waste — one meal at a time.</p>
            <div className="flex gap-3 mt-5">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 cursor-pointer transition-colors">
                  <Icon size={14} className="text-emerald-300" />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", items: [["Home", "home"], ["About", "about"], ["How It Works", "how-it-works"], ["Impact", "impact"]] },
            { title: "Join Us", items: [["Become a Donor", "donor-register"], ["Register as NGO", "ngo-register"], ["Partner with Us", "contact"], ["Contact", "contact"]] },
            { title: "Legal", items: [["Privacy Policy", "home"], ["Terms of Service", "home"], ["Cookie Policy", "home"], ["Accessibility", "home"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map(([label, v]) => (
                  <li key={label}><button onClick={() => navigate(v)} className="text-sm text-emerald-300 hover:text-white transition-colors">{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-emerald-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-emerald-400">© 2025 ResQMeal. All rights reserved. Made with ♥ to fight food waste.</p>
          <p className="text-xs text-emerald-400">12,000+ meals rescued • 350+ donors • 120+ NGOs</p>
        </div>
      </div>
    </footer>
  );
}

// ─── DASHBOARD LAYOUT ─────────────────────────────────────────────────────────

function DashboardLayout({ children, role, view, navigate, onLogout }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const donorNav = [
    { id: "donor-dashboard", label: "Dashboard", icon: Home },
    { id: "donor-add-food", label: "Add Food", icon: Plus },
    { id: "donor-my-donations", label: "My Donations", icon: Package },
    { id: "donor-ngo-requests", label: "NGO Requests", icon: Inbox },
    { id: "donor-pickup-tracking", label: "Pickup Tracking", icon: Truck },
    { id: "donor-notifications", label: "Notifications", icon: Bell },
    { id: "donor-impact", label: "My Impact", icon: Award },
    { id: "donor-profile", label: "Profile", icon: User },
  ];

  const ngoNav = [
    { id: "ngo-dashboard", label: "Dashboard", icon: Home },
    { id: "ngo-browse-food", label: "Browse Food", icon: Search },
    { id: "ngo-my-requests", label: "My Requests", icon: Package },
    { id: "ngo-pickup-tracking", label: "Pickup Tracking", icon: Truck },
    { id: "ngo-notifications", label: "Notifications", icon: Bell },
    { id: "ngo-impact", label: "Our Impact", icon: Award },
    { id: "ngo-profile", label: "Profile", icon: Building },
  ];

  const adminNav = [
    { id: "admin-dashboard", label: "Dashboard", icon: Home },
    { id: "admin-users", label: "All Users", icon: Users },
    { id: "admin-donors", label: "Donors", icon: Heart },
    { id: "admin-ngos", label: "NGOs", icon: Building },
    { id: "admin-ngo-verification", label: "NGO Verification", icon: Shield },
    { id: "admin-food-management", label: "Food Management", icon: Package },
    { id: "admin-request-management", label: "Requests", icon: Inbox },
    { id: "admin-pickup-monitoring", label: "Pickup Monitoring", icon: Truck },
    { id: "admin-reports", label: "Reports & Analytics", icon: BarChart2 },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const navItems = role === "donor" ? donorNav : role === "ngo" ? ngoNav : adminNav;
  const roleMeta: any = {
    donor: { label: "Donor Account", color: "bg-emerald-600", name: "Priya Sharma" },
    ngo: { label: "NGO Account", color: "bg-blue-600", name: "Roti Bank Mumbai" },
    admin: { label: "Administrator", color: "bg-purple-600", name: "Admin Panel" },
  };
  const meta = roleMeta[role];

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-white border-r border-border w-64">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-emerald-900 text-base" style={{ fontFamily: "var(--font-display)" }}>ResQMeal</span>
        </div>
        <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
          <div className={`w-8 h-8 ${meta.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
            {meta.name[0]}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-foreground truncate">{meta.name}</div>
            <div className="text-xs text-muted-foreground">{meta.label}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { navigate(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              view === id
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64">
            <Sidebar />
          </div>
        </div>
      )}
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`${role}-notifications`)} className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={() => navigate(`${role}-profile`)} className={`w-8 h-8 ${meta.color} rounded-xl flex items-center justify-center text-white text-xs font-bold`}>
              {meta.name[0]}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function PageHeader({ title, sub, actions }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

// ─── PUBLIC PAGES ─────────────────────────────────────────────────────────────

function HomePage({ navigate }: any) {
  const stats = [
    { n: "12,400+", l: "Meals Rescued" }, { n: "350+", l: "Active Donors" },
    { n: "120+", l: "Verified NGOs" }, { n: "98%", l: "Delivery Rate" },
  ];
  const steps = [
    { icon: Plus, title: "Donor Lists Surplus Food", desc: "Restaurants, hotels, and households post available food with quantity, pickup time, and location." },
    { icon: Search, title: "NGO Discovers & Requests", desc: "Verified NGOs browse available food and send pickup requests matching their capacity." },
    { icon: Check, title: "Donor Accepts Request", desc: "The donor reviews and accepts the NGO's request, confirming the pickup schedule." },
    { icon: Truck, title: "Food Is Collected", desc: "NGO arrives, collects the food, and marks the donation complete — saving meals from waste." },
  ];
  const testimonials = [
    { name: "Chef Rahul Menon", role: "Executive Chef, The Grand Spice", text: "ResQMeal transformed how we handle surplus food. Every week we rescue 200+ meals that would've gone to waste. The platform is incredibly easy to use.", img: "photo-1507003211169-0a1dd7228f2d" },
    { name: "Sister Maria D'Souza", role: "Director, Roti Bank Mumbai", text: "We serve 500 meals daily. ResQMeal has been a game-changer — reliable donors, timely pickups, and zero bureaucracy. Lives are literally being saved.", img: "photo-1438761681033-6461ffad8d80" },
    { name: "Aditi Nair", role: "Operations Head, Hunger Free India", text: "The verification process builds trust on both sides. Our teams feel safe collecting from donors, and donors know their food reaches real people in need.", img: "photo-1494790108755-2616b612b786" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PublicNav view="home" navigate={navigate} />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-emerald-950 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1593113630400-ea4288922559?w=1600&h=900&fit=crop&auto=format" alt="Food rescue" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Leaf size={14} /> India's #1 Food Rescue Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Rescue Food.<br /><span className="text-emerald-400">Feed Lives.</span><br />Reduce Waste.
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 max-w-2xl leading-relaxed mb-10">
              ResQMeal connects food donors with verified NGOs to rescue surplus meals before they're wasted — building a zero-hunger community, one rescue at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Btn size="lg" onClick={() => navigate("donor-register")} className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/40">
                I'm a Donor <ArrowRight size={18} />
              </Btn>
              <Btn size="lg" variant="outline" onClick={() => navigate("ngo-register")} className="border-white/30 text-white hover:bg-white/10">
                I'm an NGO <ArrowRight size={18} />
              </Btn>
            </div>
          </div>
        </div>
      </section>
      {/* Stats */}
      <div className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>{s.n}</div>
                <div className="text-emerald-200 text-sm font-medium mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* How It Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <div className="text-emerald-600 font-semibold text-sm mb-3 tracking-wider uppercase">Simple & Efficient</div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>How ResQMeal Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Four simple steps from surplus food to grateful families.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="text-xs font-bold text-emerald-500 mb-2">STEP {i + 1}</div>
                <h3 className="font-bold text-foreground mb-3 text-base" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {i < 3 && <ChevronRight size={20} className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-emerald-300" />}
            </div>
          ))}
        </div>
      </section>
      {/* Impact Banner */}
      <section className="bg-muted py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-emerald-600 font-semibold text-sm mb-3 tracking-wider uppercase">Real Impact</div>
              <h2 className="text-4xl font-extrabold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Every Meal Counts</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">India wastes 68 million tonnes of food annually while 200 million go hungry. ResQMeal bridges this gap with technology, trust, and community.</p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { v: "40%", l: "of food produced globally is wasted" },
                  { v: "3.3B", l: "tonnes of CO₂ from food waste yearly" },
                  { v: "₹92K Cr", l: "worth of food wasted in India annually" },
                  { v: "1 in 4", l: "Indians faces food insecurity" },
                ].map((s) => (
                  <div key={s.l} className="bg-white rounded-xl p-4 border border-border">
                    <div className="text-2xl font-extrabold text-emerald-700 mb-1" style={{ fontFamily: "var(--font-display)" }}>{s.v}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=500&fit=crop&auto=format" alt="Community food rescue" className="rounded-2xl shadow-2xl w-full object-cover h-96" />
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 text-white rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>12,400+</div>
                <div className="text-sm text-emerald-200">Meals Rescued This Year</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <div className="text-emerald-600 font-semibold text-sm mb-3 tracking-wider uppercase">Voices of Change</div>
          <h2 className="text-4xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>What Our Community Says</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array(5).fill(0).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={`https://images.unsplash.com/${t.img}?w=48&h=48&fit=crop&auto=format`} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-muted" />
                <div>
                  <div className="font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="bg-emerald-900 py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-display)" }}>Ready to Rescue Food?</h2>
          <p className="text-emerald-200 text-lg mb-10">Join 350+ donors and 120+ NGOs already making a difference. It takes less than 2 minutes to sign up.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Btn size="lg" onClick={() => navigate("donor-register")} className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950">Register as Donor <ArrowRight size={18} /></Btn>
            <Btn size="lg" variant="outline" onClick={() => navigate("ngo-register")} className="border-emerald-400/40 text-white hover:bg-white/10">Register as NGO <ArrowRight size={18} /></Btn>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

function AboutPage({ navigate }: any) {
  const team = [
    { name: "Arjun Mehta", role: "Founder & CEO", bio: "Ex-Swiggy product lead. Passionate about food systems and social impact.", img: "photo-1507003211169-0a1dd7228f2d" },
    { name: "Sneha Reddy", role: "Co-Founder & CTO", bio: "Full-stack engineer with 8 years building scalable platforms.", img: "photo-1494790108755-2616b612b786" },
    { name: "Vikram Iyer", role: "Head of NGO Relations", bio: "10 years working with food security NGOs across Maharashtra.", img: "photo-1472099645785-5658abf4ff4e" },
    { name: "Priya Kapoor", role: "Product Design Lead", bio: "UX designer who believes good design can solve social problems.", img: "photo-1438761681033-6461ffad8d80" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PublicNav view="about" navigate={navigate} />
      <div className="pt-16">
        <div className="bg-emerald-900 py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>Our Mission to End Food Waste</h1>
            <p className="text-xl text-emerald-200 leading-relaxed">ResQMeal was born from a simple question: why does food get thrown away when millions sleep hungry? We built technology to bridge that gap.</p>
          </div>
        </div>
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="text-emerald-600 font-semibold text-sm mb-3 uppercase tracking-wider">Our Story</div>
              <h2 className="text-3xl font-extrabold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Started in a Hotel Kitchen in 2022</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Arjun Mehta watched a five-star hotel in Mumbai throw away 200 portions of perfectly good food after a cancelled banquet. That night, he called Sneha — and ResQMeal was born.</p>
              <p className="text-muted-foreground leading-relaxed mb-6">Within 6 months, we built a platform that connected the hotel's surplus food to three local NGOs. Today, we're scaling across India with a mission to rescue 1 crore meals by 2027.</p>
              <div className="flex flex-wrap gap-4">
                {[["2022", "Founded"], ["₹2.5 Cr", "Funding Raised"], ["6", "Cities Active"], ["35+", "Team Members"]].map(([v, l]) => (
                  <div key={l} className="bg-muted rounded-xl p-4 text-center min-w-[80px]">
                    <div className="font-extrabold text-emerald-700 text-lg">{v}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=450&fit=crop&auto=format" alt="Our team" className="rounded-2xl shadow-xl w-full" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {[
              { icon: Target, title: "Our Mission", text: "To eliminate food waste by creating a trusted, technology-driven network that connects food donors with NGOs — ensuring every surplus meal feeds a human being, not a landfill." },
              { icon: Zap, title: "Our Vision", text: "A world where no edible food is wasted. We envision a zero-hunger India where communities, technology, and compassion work together to ensure food security for all." },
            ].map((c) => (
              <div key={c.title} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <c.icon size={22} className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-display)" }}>{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                <img src={`https://images.unsplash.com/${m.img}?w=80&h=80&fit=crop&auto=format`} alt={m.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover bg-muted" />
                <h4 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{m.name}</h4>
                <div className="text-xs text-emerald-600 font-semibold mb-2">{m.role}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

function HowItWorksPage({ navigate }: any) {
  const donorFlow = [
    { icon: User, step: 1, title: "Create Donor Account", desc: "Sign up with your restaurant, hotel, or individual account. Verification takes under 24 hours." },
    { icon: Plus, step: 2, title: "Add Surplus Food", desc: "List food with category, quantity, expiry time, pickup window, and location. Takes 2 minutes." },
    { icon: Bell, step: 3, title: "Receive NGO Requests", desc: "Verified NGOs in your area will discover your listing and send pickup requests." },
    { icon: Check, step: 4, title: "Accept & Confirm", desc: "Review the NGO profile, accept their request, and confirm the pickup schedule." },
    { icon: Truck, step: 5, title: "Food Gets Collected", desc: "NGO arrives at your location during the pickup window. Mark the donation complete." },
    { icon: Award, step: 6, title: "See Your Impact", desc: "Track meals rescued, NGOs helped, and CO₂ saved. Share your impact story!" },
  ];
  const ngoFlow = [
    { icon: Building, step: 1, title: "Register Your NGO", desc: "Submit your NGO details and registration documents. Our team verifies within 48 hours." },
    { icon: Search, step: 2, title: "Browse Available Food", desc: "Explore food listings nearby. Filter by category, quantity, pickup time, and location." },
    { icon: HandHeart, step: 3, title: "Request Pickup", desc: "Found suitable food? Send a pickup request with your capacity and preferred time." },
    { icon: CheckCircle, step: 4, title: "Await Donor Approval", desc: "The donor reviews your request and accepts based on availability and your NGO profile." },
    { icon: Truck, step: 5, title: "Collect the Food", desc: "Arrive at the donor location in the confirmed time window. Sign the collection receipt." },
    { icon: Heart, step: 6, title: "Feed Communities", desc: "Distribute food to your beneficiaries. Log the impact — families fed, meals served." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PublicNav view="how-it-works" navigate={navigate} />
      <div className="pt-16">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>How ResQMeal Works</h1>
            <p className="text-xl text-emerald-100 leading-relaxed">A simple, trusted workflow for donors and NGOs — designed to get food where it's needed, fast.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            {[{ title: "For Donors", pillCls: "bg-emerald-50 text-emerald-700 border-emerald-100", flow: donorFlow }, { title: "For NGOs", pillCls: "bg-blue-50 text-blue-700 border-blue-100", flow: ngoFlow }].map(({ title, pillCls, flow }) => (
              <div key={title}>
                <div className={`inline-flex items-center gap-2 ${pillCls} px-4 py-2 rounded-full text-sm font-bold mb-8 border`}>{title}</div>
                <div className="space-y-6">
                  {flow.map((s) => (
                    <div key={s.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                        <s.icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1 pb-6 border-b border-border last:border-0">
                        <div className="text-xs font-bold text-emerald-500 mb-1">Step {s.step}</div>
                        <h3 className="font-bold text-foreground mb-1.5" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Ready to Get Started?</h2>
            <p className="text-emerald-700 mb-8">Join our growing community of food rescuers. Zero fees, full impact.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Btn size="lg" onClick={() => navigate("donor-register")}>Register as Donor</Btn>
              <Btn size="lg" variant="secondary" onClick={() => navigate("ngo-register")}>Register as NGO</Btn>
            </div>
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

function ImpactPage({ navigate }: any) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav view="impact" navigate={navigate} />
      <div className="pt-16">
        <div className="bg-emerald-900 py-24 px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Collective Impact</h1>
          <p className="text-emerald-200 text-xl max-w-2xl mx-auto">Real numbers. Real people. Real change. Here's what our community has achieved together.</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { v: "12,400+", l: "Meals Rescued", icon: Utensils, color: "emerald" },
              { v: "350+",    l: "Active Donors", icon: Heart, color: "amber" },
              { v: "120+",    l: "Verified NGOs", icon: Building, color: "blue" },
              { v: "62 T",    l: "CO₂ Saved", icon: Leaf, color: "teal" },
            ].map((s) => (
              <StatCard key={s.l} icon={s.icon} value={s.v} label={s.l} color={s.color} />
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-12">
            <h3 className="font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Monthly Meals Rescued (2024)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="mealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="meals" stroke="#059669" strokeWidth={2.5} fill="url(#mealGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Food Categories Rescued</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={CAT_DATA} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {CAT_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Top Contributing NGOs</h3>
              <div className="space-y-4">
                {NGOS.filter(n => n.verified).map((n, i) => (
                  <div key={n.id} className="flex items-center gap-4">
                    <div className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">{n.name}</span>
                        <span className="text-xs font-mono text-emerald-600">{n.meals.toLocaleString()} meals</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(n.meals / 20000) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

function ContactPage({ navigate }: any) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <PublicNav view="contact" navigate={navigate} />
      <div className="pt-16">
        <div className="bg-emerald-900 py-24 px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Get In Touch</h1>
          <p className="text-emerald-200 text-xl max-w-xl mx-auto">Questions, partnerships, or press inquiries — we'd love to hear from you.</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-5">
              {[
                { icon: Mail, title: "Email Us", val: "hello@resqmeal.in", sub: "We reply within 24 hours" },
                { icon: Phone, title: "Call Us", val: "+91 98765 00000", sub: "Mon–Sat, 9 AM – 7 PM IST" },
                { icon: MapPin, title: "Visit Us", val: "WeWork Bandra, Mumbai 400050", sub: "Book an appointment first" },
              ].map((c) => (
                <div key={c.title} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <c.icon size={18} className="text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{c.title}</div>
                    <div className="text-sm text-emerald-700 font-medium">{c.val}</div>
                    <div className="text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-sm">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                  <Btn onClick={() => setSent(false)}>Send Another Message</Btn>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>Send us a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Input label="Full Name" placeholder="Arjun Mehta" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-5">
                    <Input label="Subject" placeholder="Partnership inquiry" value={form.subject} onChange={(e: any) => setForm({ ...form, subject: e.target.value })} required />
                  </div>
                  <div className="mb-6">
                    <Textarea label="Message" placeholder="Tell us how we can help..." value={form.msg} onChange={(e: any) => setForm({ ...form, msg: e.target.value })} rows={5} required />
                  </div>
                  <Btn size="lg" onClick={() => setSent(true)} disabled={!form.name || !form.email || !form.msg}>
                    Send Message <ArrowRight size={18} />
                  </Btn>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────

function AuthLayout({ title, sub, imgUrl, children, navigate, switchLink, switchText, switchAction }: any) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
        <img src={`https://images.unsplash.com/${imgUrl}?w=800&h=900&fit=crop&auto=format`} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <button onClick={() => navigate("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Leaf size={16} className="text-white" /></div>
            <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-display)" }}>ResQMeal</span>
          </button>
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Rescue food. Feed lives. Build community.</h2>
            <p className="text-emerald-200 text-lg mb-8">Join 12,000+ meals rescued across India's largest food rescue network.</p>
            <div className="flex gap-6">
              {[["12K+", "Meals"], ["350+", "Donors"], ["120+", "NGOs"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-white">{v}</div>
                  <div className="text-emerald-300 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center"><Leaf size={14} className="text-white" /></div>
            <span className="font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>ResQMeal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
          <p className="text-muted-foreground text-sm mb-8">{sub}</p>
          {children}
          {switchLink && (
            <p className="text-sm text-center text-muted-foreground mt-6">
              {switchText}{" "}
              <button onClick={() => navigate(switchLink)} className="text-emerald-600 font-semibold hover:underline">{switchAction}</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DonorLoginPage({ navigate, onLogin }: any) {
  const [form, setForm] = useState({ email: "priya@grandspice.com", pass: "••••••••" });

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.pass,
          role: "DONOR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Donor login failed");
      }

      onLogin(data.user);
    } catch (error) {
      console.error("Donor login failed:", error);
      alert(error instanceof Error ? error.message : "Donor login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back, Donor" sub="Sign in to manage your food donations." imgUrl="photo-1504674900247-0877df9cc836" navigate={navigate} switchLink="donor-register" switchText="New to ResQMeal?" switchAction="Create Donor Account">
      <div className="space-y-4">
        <Input label="Email Address" type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} icon={Mail} placeholder="you@restaurant.com" />
        <Input label="Password" type="password" value={form.pass} onChange={(e: any) => setForm({ ...form, pass: e.target.value })} icon={Shield} placeholder="Your password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer"><input type="checkbox" className="rounded" /> Remember me</label>
          <button className="text-emerald-600 font-medium hover:underline">Forgot password?</button>
        </div>
        <Btn size="lg" className="w-full" onClick={handleSubmit}>Sign In <ArrowRight size={16} /></Btn>
        <div className="text-center text-xs text-muted-foreground py-2">— or continue as Admin —</div>
        <Btn variant="outline" size="sm" className="w-full" onClick={() => navigate("admin-login")}>Admin Login</Btn>
      </div>
    </AuthLayout>
  );
}

function DonorRegisterPage({ navigate }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "restaurant", org: "", address: "", pass: "", confirm: "" });
  const f = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  return (
    <AuthLayout title="Create Donor Account" sub="Start rescuing food in under 2 minutes." imgUrl="photo-1512621776951-a57141f2eefd" navigate={navigate} switchLink="donor-login" switchText="Already have an account?" switchAction="Sign In">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 3 && <div className={`flex-1 h-0.5 w-12 transition-all ${step > s ? "bg-emerald-600" : "bg-border"}`} />}
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-2">{["Account Info", "Organization", "Secure Access"][step - 1]}</span>
      </div>
      {step === 1 && (
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Priya Sharma" value={form.name} onChange={f("name")} icon={User} required />
          <Input label="Email Address" type="email" placeholder="priya@hotel.com" value={form.email} onChange={f("email")} icon={Mail} required />
          <Input label="Phone Number" placeholder="+91 98765 43210" value={form.phone} onChange={f("phone")} icon={Phone} required />
          <Btn size="lg" className="w-full" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></Btn>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <Select label="Donor Type" value={form.type} onChange={f("type")} required options={[{ value: "restaurant", label: "Restaurant / Eatery" }, { value: "hotel", label: "Hotel / Resort" }, { value: "catering", label: "Catering Service" }, { value: "grocery", label: "Grocery / Supermarket" }, { value: "individual", label: "Individual / Household" }]} />
          <Input label="Organization Name" placeholder="The Grand Spice Restaurant" value={form.org} onChange={f("org")} icon={Building} />
          <Textarea label="Address" placeholder="Full address with landmark" value={form.address} onChange={f("address")} rows={3} required />
          <div className="flex gap-3">
            <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Btn>
            <Btn size="lg" className="flex-1" onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></Btn>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.pass} onChange={f("pass")} icon={Shield} required />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={f("confirm")} icon={Shield} required />
          <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" className="mt-0.5 rounded" />
            I agree to the Terms of Service and Privacy Policy
          </label>
          <div className="flex gap-3">
            <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>Back</Btn>
            <Btn size="lg" className="flex-1" onClick={() => navigate("donor-login")}>Create Account</Btn>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

function NGOLoginPage({ navigate, onLogin }: any) {
  return (
    <AuthLayout title="NGO Portal Sign In" sub="Access the food discovery and request management portal." imgUrl="photo-1559027615-cd4628902d4a" navigate={navigate} switchLink="ngo-register" switchText="New NGO?" switchAction="Register Your NGO">
      <div className="space-y-4">
        <Input label="Email Address" type="email" value="contact@rotibank.org" onChange={() => {}} icon={Mail} />
        <Input label="Password" type="password" value="••••••••" onChange={() => {}} icon={Shield} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer"><input type="checkbox" className="rounded" defaultChecked /> Remember me</label>
          <button className="text-emerald-600 font-medium hover:underline">Forgot password?</button>
        </div>
        <Btn size="lg" className="w-full" onClick={onLogin}>Sign In <ArrowRight size={16} /></Btn>
      </div>
    </AuthLayout>
  );
}

function NGORegisterPage({ navigate }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cat: "food-relief", reg: "", address: "", capacity: "", pass: "" });
  const f = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  return (
    <AuthLayout title="Register Your NGO" sub="Join 120+ verified NGOs rescuing food daily." imgUrl="photo-1488521787991-ed7bbaae773c" navigate={navigate} switchLink="ngo-login" switchText="Already registered?" switchAction="Sign In">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 3 && <div className={`flex-1 h-0.5 w-12 transition-all ${step > s ? "bg-emerald-600" : "bg-border"}`} />}
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-2">{["NGO Info", "Details", "Security"][step - 1]}</span>
      </div>
      {step === 1 && (
        <div className="space-y-4">
          <Input label="NGO Name" placeholder="Roti Bank Mumbai" value={form.name} onChange={f("name")} icon={Building} required />
          <Input label="Contact Email" type="email" placeholder="contact@ngo.org" value={form.email} onChange={f("email")} icon={Mail} required />
          <Input label="Phone Number" placeholder="+91 98765 43210" value={form.phone} onChange={f("phone")} icon={Phone} required />
          <Select label="NGO Category" value={form.cat} onChange={f("cat")} options={[{ value: "food-relief", label: "Food Relief" }, { value: "community-kitchen", label: "Community Kitchen" }, { value: "orphanage", label: "Orphanage / Children Home" }, { value: "old-age", label: "Old Age Home" }, { value: "school", label: "School Nutrition" }, { value: "slum-outreach", label: "Slum Outreach" }]} />
          <Btn size="lg" className="w-full" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></Btn>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <Input label="Registration Number" placeholder="MH/NGO/2024/XXXX" value={form.reg} onChange={f("reg")} icon={Hash} required />
          <Textarea label="Address" placeholder="Full address of your NGO" value={form.address} onChange={f("address")} rows={3} required />
          <Input label="Daily Meal Capacity" type="number" placeholder="200" value={form.capacity} onChange={f("capacity")} icon={Utensils} />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <AlertTriangle size={12} className="inline mr-1" /> Upload NGO registration documents after signup. Verification takes 24–48 hours.
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Btn>
            <Btn size="lg" className="flex-1" onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></Btn>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.pass} onChange={f("pass")} icon={Shield} required />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" value="" onChange={() => {}} icon={Shield} required />
          <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" className="mt-0.5 rounded" />
            I confirm all information submitted is accurate and I agree to ResQMeal's Terms of Service.
          </label>
          <div className="flex gap-3">
            <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>Back</Btn>
            <Btn size="lg" className="flex-1" onClick={() => navigate("ngo-login")}>Submit for Review</Btn>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

function AdminLoginPage({ navigate, onLogin }: any) {
  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
            <Shield size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>Admin Access</h1>
          <p className="text-emerald-300 text-sm">ResQMeal Platform Administration</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-emerald-200 mb-1.5">Admin Email</label>
              <input type="email" defaultValue="admin@resqmeal.in" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-200 mb-1.5">Password</label>
              <input type="password" defaultValue="••••••••••" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <button onClick={onLogin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              Access Admin Panel <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate("home")} className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ─── DONOR PAGES ──────────────────────────────────────────────────────────────

function DonorDashboard({ navigate }: any) {
  const chartData = MONTHLY_DATA.slice(-6);
  return (
    <div>
      <PageHeader title="Good morning, Priya! 👋" sub="Here's what's happening with your donations today." actions={<Btn onClick={() => navigate("donor-add-food")}><Plus size={16} /> Add Food</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Total Donations" value="48" sub="+3 this week" color="emerald" />
        <StatCard icon={Utensils} label="Meals Rescued" value="2,840" sub="↑ 12% vs last month" color="amber" />
        <StatCard icon={Activity} label="Active Listings" value="3" sub="2 have requests" color="blue" />
        <StatCard icon={CheckCircle} label="Completed" value="41" sub="6 in progress" color="teal" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Monthly Donations (2024)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="donations" stroke="#059669" strokeWidth={2} fill="url(#donGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Pending NGO Requests</h3>
          <div className="space-y-3">
            {REQUESTS.filter(r => r.status === "pending").map(r => (
              <div key={r.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="text-xs font-bold text-foreground truncate mb-1">{r.food}</div>
                <div className="text-xs text-muted-foreground mb-2">{r.ngo}</div>
                <div className="flex gap-2">
                  <Btn size="sm" className="flex-1 text-xs py-1">Accept</Btn>
                  <Btn size="sm" variant="outline" className="text-xs py-1 px-2">Reject</Btn>
                </div>
              </div>
            ))}
            {REQUESTS.filter(r => r.status === "pending").length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending requests</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Recent Donations</h3>
          <Btn size="sm" variant="ghost" onClick={() => navigate("donor-my-donations")}>View All <ChevronRight size={14} /></Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Food Item", "Category", "Qty", "Status", "Date", ""].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FOOD_ITEMS.slice(0, 5).map(f => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{f.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.category}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.qty} {f.unit}</td>
                  <td className="px-5 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{f.posted}</td>
                  <td className="px-5 py-3"><button onClick={() => navigate("donor-donation-details")} className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DonorAddFood({ navigate }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", cat: "cooked", qty: "", unit: "portions", expiry: "", pickup: "", address: "", desc: "", allergens: "" });
  const f = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  return (
    <div>
      <PageHeader title="Add Food Listing" sub="List your surplus food for NGO pickup." actions={<Btn variant="outline" onClick={() => navigate("donor-my-donations")}><ChevronLeft size={16} /> Back</Btn>} />
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          {["Food Details", "Pickup Info", "Review & Submit"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= i + 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < 2 && <ChevronRight size={14} className="text-border" />}
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-5">
              <Input label="Food Item Name" placeholder="Biryani & Dal — 40 Portions" value={form.title} onChange={f("title")} required />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" value={form.cat} onChange={f("cat")} options={[{ value: "cooked", label: "Cooked Food" }, { value: "raw", label: "Raw Produce" }, { value: "bakery", label: "Bakery" }, { value: "dairy", label: "Dairy" }, { value: "fruits", label: "Fruits & Dry Fruits" }, { value: "packaged", label: "Packaged Food" }, { value: "beverages", label: "Beverages" }]} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Quantity" type="number" placeholder="40" value={form.qty} onChange={f("qty")} required />
                  <Select label="Unit" value={form.unit} onChange={f("unit")} options={["portions", "kg", "litres", "pieces", "packets", "boxes"]} />
                </div>
              </div>
              <Textarea label="Description" placeholder="Freshly cooked, contains no artificial preservatives..." value={form.desc} onChange={f("desc")} rows={3} />
              <Input label="Allergens (comma separated)" placeholder="Gluten, Dairy, Nuts" value={form.allergens} onChange={f("allergens")} />
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer group">
                <Camera size={24} className="text-muted-foreground mx-auto mb-2 group-hover:text-emerald-600 transition-colors" />
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Upload Food Photo</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
              <Btn size="lg" className="w-full" onClick={() => setStep(2)}>Continue to Pickup Info <ArrowRight size={16} /></Btn>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date & Time" type="datetime-local" value={form.expiry} onChange={f("expiry")} required />
                <Input label="Pickup Window" placeholder="6 PM – 8 PM" value={form.pickup} onChange={f("pickup")} icon={Clock} required />
              </div>
              <Textarea label="Pickup Address" placeholder="Full address with landmark" value={form.address} onChange={f("address")} rows={3} required />
              <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
                <Info size={14} className="inline mr-1 text-emerald-600" />
                Your listing will be visible to all verified NGOs in your area. You can edit or remove it anytime before a pickup is confirmed.
              </div>
              <div className="flex gap-3">
                <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Btn>
                <Btn size="lg" className="flex-1" onClick={() => setStep(3)}>Review Listing <ArrowRight size={16} /></Btn>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-muted rounded-xl p-5 space-y-3">
                <h4 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Listing Summary</h4>
                {[["Food Item", form.title || "Biryani & Dal"], ["Category", "Cooked Food"], ["Quantity", `${form.qty || 40} ${form.unit}`], ["Pickup", form.pickup || "6 PM – 8 PM"], ["Expires", form.expiry || "Today 8 PM"], ["Address", form.address || "The Grand Spice, Bandra West"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground text-right max-w-xs">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Btn variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>Edit</Btn>
                <Btn size="lg" className="flex-1" onClick={() => navigate("donor-my-donations")}>
                  <Check size={16} /> Publish Listing
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DonorMyDonations({ navigate, authUser }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const statuses = ["all", "available", "requested", "accepted", "completed", "expired"];
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");

        if (!authUser?.id) {
          setErrorMsg("Donor information not found.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/food?user_id=${authUser.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch your donations");
        }

        setDonations((data.foods || []).map((food: any) => ({
          id: food.id,
          title: food.food_item,
          category: food.category,
          qty: food.quantity,
          unit: food.unit,
          status: String(food.status || "").toLowerCase(),
          img: food.img || "photo-1504674900247-0877df9cc836",
          location: food.location,
          pickup: [food.pickup_start, food.pickup_end]
            .filter(Boolean)
            .map((time: string) => new Date(time).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }))
            .join(" – ") || "Not specified",
          posted: food.posted_at
            ? new Date(food.posted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "",
        })));
      } catch (error) {
        console.error("Failed to fetch my donations:", error);
        setErrorMsg(error instanceof Error ? error.message : "Failed to fetch your donations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [authUser]);

  const filtered = donations.filter(f =>
    (filter === "all" || f.status === filter) &&
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Donations" sub="Loading your donations..." actions={<Btn onClick={() => navigate("donor-add-food")}><Plus size={16} /> Add Food</Btn>} />
        <div className="flex items-center justify-center py-20"><RefreshCw size={28} className="animate-spin text-emerald-600" /></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div>
        <PageHeader title="My Donations" sub="Unable to load your donations." actions={<Btn onClick={() => navigate("donor-add-food")}><Plus size={16} /> Add Food</Btn>} />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle size={30} className="mx-auto text-red-500 mb-3" />
          <h3 className="font-bold text-red-700 mb-1">Failed to load donations</h3>
          <p className="text-sm text-red-600">{errorMsg}</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <PageHeader title="My Donations" sub={`${donations.length} total donations`} actions={<Btn onClick={() => navigate("donor-add-food")}><Plus size={16} /> Add Food</Btn>} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food listings..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === s ? "bg-emerald-600 text-white border-emerald-600" : "border-border text-muted-foreground hover:bg-muted"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No donations found" desc="Try adjusting your search or filters." action={<Btn onClick={() => navigate("donor-add-food")}><Plus size={16} /> Add Your First Donation</Btn>} />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(item => (
            <FoodCard key={item.id} item={item} onView={() => navigate("donor-donation-details")} onRequest={() => {}} role="donor" />
          ))}
        </div>
      )}
    </div>
  );
}

function DonorDonationDetails({ navigate }: any) {
  const item = FOOD_ITEMS[0];
  const request = REQUESTS.find(r => r.foodId === item.id);
  const [modal, setModal] = useState<string | null>(null);
  return (
    <div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "accept" ? "Accept NGO Request" : "Reject Request"}>
        <p className="text-sm text-muted-foreground mb-6">
          {modal === "accept" ? `Accepting Roti Bank Mumbai's request for "${item.title}". They'll arrive during your pickup window.` : "Are you sure you want to reject this request? The listing will become available again."}
        </p>
        <div className="flex gap-3">
          <Btn variant="outline" className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn variant={modal === "accept" ? "primary" : "danger"} className="flex-1" onClick={() => setModal(null)}>
            {modal === "accept" ? "Yes, Accept" : "Yes, Reject"}
          </Btn>
        </div>
      </Modal>
      <PageHeader title="Donation Details" actions={
        <div className="flex gap-2">
          <Btn size="sm" variant="outline" onClick={() => navigate("donor-my-donations")}><ChevronLeft size={14} /> Back</Btn>
          <Btn size="sm" variant="danger"><Trash2 size={14} /> Remove</Btn>
        </div>
      } />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <img src={`https://images.unsplash.com/${item.img}?w=800&h=300&fit=crop&auto=format`} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 mb-1">{item.category}</div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h2>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-5">
                {[["Quantity", `${item.qty} ${item.unit}`], ["Servings", `~${item.servings} people`], ["Pickup Window", item.pickup], ["Location", item.location], ["Expires", item.expiry], ["Posted", item.posted]].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-muted-foreground text-xs mb-0.5">{k}</div>
                    <div className="font-semibold text-foreground text-sm">{v}</div>
                  </div>
                ))}
              </div>
              {item.allergens.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">ALLERGENS</div>
                  <div className="flex gap-2 flex-wrap">
                    {item.allergens.map(a => <span key={a} className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-lg border border-amber-200">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>Status Timeline</h3>
            <div className="space-y-4">
              {[["Food Listed", "You posted this listing", "2 hrs ago", true], ["NGO Request Received", "Roti Bank Mumbai sent a request", "1 hr ago", true], ["Awaiting Your Decision", "Accept or reject the request", "Now", false]].map(([t, d, time, done]) => (
                <div key={t as string} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-600" : "bg-amber-100 border-2 border-amber-300"}`}>
                    {done ? <Check size={14} className="text-white" /> : <Clock size={14} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 pb-4 border-b border-border last:border-0">
                    <div className="font-semibold text-sm text-foreground">{t}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {request && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-display)" }}>NGO Request</h3>
                <StatusBadge status={request.status} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{request.ngo}</div>
                  <div className="text-xs text-muted-foreground">Verified NGO</div>
                </div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-xs text-muted-foreground mb-4 italic">"{request.note}"</div>
              <div className="text-xs text-muted-foreground mb-4">Requested: {request.reqAt} · Pickup: {request.pickup}</div>
              {request.status === "pending" && (
                <div className="flex gap-2">
                  <Btn className="flex-1" onClick={() => setModal("accept")}><Check size={14} /> Accept</Btn>
                  <Btn variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setModal("reject")}><X size={14} /> Reject</Btn>
                </div>
              )}
            </div>
          )}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm mb-4" style={{ fontFamily: "var(--font-display)" }}>Quick Actions</h3>
            <div className="space-y-2">
              {[["Edit Listing", Edit2, "outline"], ["Share Listing", ExternalLink, "outline"], ["Remove Listing", Trash2, "danger"]].map(([l, Icon, v]: any) => (
                <Btn key={l} variant={v} size="sm" className="w-full justify-start gap-3"><Icon size={14} />{l}</Btn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonorNGORequests({ navigate }: any) {
  const [modal, setModal] = useState<any>(null);
  return (
    <div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.action === "accept" ? "Accept Request" : "Reject Request"}>
        {modal && (
          <>
            <p className="text-sm text-muted-foreground mb-2">Food: <strong>{modal.req.food}</strong></p>
            <p className="text-sm text-muted-foreground mb-2">NGO: <strong>{modal.req.ngo}</strong></p>
            <p className="text-sm text-muted-foreground mb-6">Pickup: <strong>{modal.req.pickup}</strong></p>
            <div className="flex gap-3">
              <Btn variant="outline" className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant={modal.action === "accept" ? "primary" : "danger"} className="flex-1" onClick={() => setModal(null)}>
                {modal.action === "accept" ? "Accept" : "Reject"}
              </Btn>
            </div>
          </>
        )}
      </Modal>
      <PageHeader title="NGO Requests" sub="Manage incoming pickup requests from NGOs." />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {([["Pending", REQUESTS.filter(r => r.status === "pending").length, "bg-amber-50 border-amber-100 text-amber-700 text-amber-600"], ["Accepted", REQUESTS.filter(r => r.status === "accepted").length, "bg-emerald-50 border-emerald-100 text-emerald-700 text-emerald-600"], ["Completed", REQUESTS.filter(r => r.status === "completed").length, "bg-teal-50 border-teal-100 text-teal-700 text-teal-600"]] as [string, number, string][]).map(([l, v, cls]) => {
          const [bg, border, textDark] = cls.split(" ");
          return (
          <div key={l} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${textDark}`}>{v}</div>
            <div className={`text-xs font-medium ${textDark} mt-0.5 opacity-80`}>{l}</div>
          </div>
          );
        })}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>All Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Food Item", "NGO", "Requested", "Pickup Time", "Status", "Actions"].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REQUESTS.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{r.food}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.ngo}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.reqAt}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.pickup}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3">
                    {r.status === "pending" && (
                      <div className="flex gap-2">
                        <Btn size="sm" onClick={() => setModal({ req: r, action: "accept" })}>Accept</Btn>
                        <Btn size="sm" variant="outline" onClick={() => setModal({ req: r, action: "reject" })}>Reject</Btn>
                      </div>
                    )}
                    {r.status !== "pending" && <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DonorPickupTracking({ navigate }: any) {
  const active = REQUESTS.filter(r => r.status === "accepted");
  return (
    <div>
      <PageHeader title="Pickup Tracking" sub="Monitor live status of active food pickups." />
      {active.length === 0 ? (
        <EmptyState icon={Truck} title="No active pickups" desc="Accept NGO requests to see pickup tracking here." action={<Btn onClick={() => navigate("donor-ngo-requests")}>View Requests</Btn>} />
      ) : (
        <div className="space-y-5">
          {active.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{r.food}</h3>
                  <div className="text-sm text-muted-foreground mt-0.5">NGO: {r.ngo} · Pickup: {r.pickup}</div>
                </div>
                <StatusBadge status="en route" />
              </div>
              <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-2">
                {PICKUP_STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i <= 3 ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-border text-muted-foreground"}`}>
                        {i <= 3 ? <Check size={14} /> : i + 1}
                      </div>
                      <div className={`text-xs mt-1.5 text-center max-w-[70px] leading-tight ${i <= 3 ? "text-emerald-700 font-medium" : "text-muted-foreground"}`}>{s}</div>
                    </div>
                    {i < PICKUP_STEPS.length - 1 && <div className={`h-0.5 w-8 mx-1 flex-shrink-0 ${i < 3 ? "bg-emerald-500" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Btn size="sm" variant="secondary"><Phone size={12} /> Contact NGO</Btn>
                <Btn size="sm" variant="outline"><MessageSquare size={12} /> Message</Btn>
                <Btn size="sm" variant="outline"><CheckCircle size={12} /> Mark Collected</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsPage({ navigate, role }: any) {
  const [notifs, setNotifs] = useState(NOTIFS);
  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const unread = notifs.filter(n => !n.read).length;
  const iconMap: any = { success: CheckCircle2, info: Info, warning: AlertTriangle, error: AlertCircle };
  const colorMap: any = { success: "text-emerald-600 bg-emerald-50", info: "text-blue-600 bg-blue-50", warning: "text-amber-600 bg-amber-50", error: "text-red-600 bg-red-50" };
  return (
    <div>
      <PageHeader title={`Notifications ${unread > 0 ? `(${unread})` : ""}`} sub="Stay updated on your donations and requests." actions={<Btn size="sm" variant="outline" onClick={markAllRead}><CheckCircle size={14} /> Mark All Read</Btn>} />
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {notifs.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <div key={n.id} className={`flex gap-4 px-5 py-4 border-b border-border last:border-0 transition-colors cursor-pointer hover:bg-muted/30 ${!n.read ? "bg-emerald-50/50" : ""}`} onClick={() => setNotifs(notifs.map((x, j) => j === i ? { ...x, read: true } : x))}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[n.type]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</span>
                  {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.msg}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImpactDashboard({ role }: any) {
  const badges = [
    { icon: "🌱", title: "First Rescue", desc: "Listed your first food item", earned: true },
    { icon: "🍛", title: "100 Meals", desc: "Rescued 100+ meals total", earned: true },
    { icon: "⭐", title: "Top Donor", desc: "Donated 3 weeks in a row", earned: true },
    { icon: "🌍", title: "Eco Champion", desc: "Saved 50kg+ CO₂", earned: false },
    { icon: "🤝", title: "NGO Favourite", desc: "5 NGOs requested your food", earned: false },
  ];
  return (
    <div>
      <PageHeader title={role === "ngo" ? "Our Impact" : "My Impact"} sub="Your contribution to reducing food waste." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Utensils} label="Meals Rescued" value={role === "ngo" ? "12,400" : "2,840"} color="emerald" />
        <StatCard icon={Users} label={role === "ngo" ? "Families Fed" : "NGOs Helped"} value={role === "ngo" ? "4,200" : "8"} color="amber" />
        <StatCard icon={Leaf} label="CO₂ Saved" value={role === "ngo" ? "62 T" : "14 T"} color="teal" />
        <StatCard icon={Award} label="Badges Earned" value="3/5" color="purple" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Monthly Impact Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="meals" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Achievement Badges</h3>
          <div className="space-y-3">
            {badges.map(b => (
              <div key={b.title} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${b.earned ? "bg-emerald-50 border-emerald-100" : "bg-muted border-border opacity-60"}`}>
                <div className="text-2xl">{b.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${b.earned ? "text-emerald-800" : "text-muted-foreground"}`}>{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
                {b.earned && <Check size={16} className="text-emerald-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 text-white text-center shadow-lg">
        <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)" }}>Keep Going!</h3>
        <p className="text-emerald-100 mb-4">{role === "ngo" ? "Your NGO has rescued 12,400 meals. 87,600 more to reach 1 lakh!" : "You've rescued 2,840 meals. 2,160 more to earn the 5K Meals badge!"}</p>
        <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: role === "ngo" ? "12%" : "57%" }} />
        </div>
        <p className="text-xs text-emerald-200">{role === "ngo" ? "12,400 / 1,00,000 meals" : "2,840 / 5,000 meals"}</p>
      </div>
    </div>
  );
}

function ProfilePage({ role }: any) {
  const [editing, setEditing] = useState(false);
  const isDonor = role === "donor";
  const isNGO = role === "ngo";
  return (
    <div>
      <PageHeader title="Profile" sub="Manage your account and preferences." actions={<Btn size="sm" variant={editing ? "primary" : "outline"} onClick={() => setEditing(!editing)}>{editing ? <><Check size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}</Btn>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white ${isDonor ? "bg-emerald-600" : isNGO ? "bg-blue-600" : "bg-purple-600"}`}>
                {isDonor ? "P" : isNGO ? "R" : "A"}
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center shadow">
                  <Camera size={12} className="text-foreground" />
                </button>
              )}
            </div>
            <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{isDonor ? "Priya Sharma" : isNGO ? "Roti Bank Mumbai" : "Admin"}</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">{isDonor ? "Restaurant Donor" : isNGO ? "Verified NGO" : "Platform Admin"}</div>
            {isNGO && <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mt-2"><Shield size={10} /> Verified</div>}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-foreground text-sm mb-4" style={{ fontFamily: "var(--font-display)" }}>Quick Stats</h4>
            <div className="space-y-3">
              {(isDonor ? [["Donations", "48"], ["Meals Rescued", "2,840"], ["Avg Rating", "4.9/5"]] : [["Food Collected", "312"], ["Meals Served", "12,400"], ["Families Helped", "4,200"]]).map(([l, v]) => (
                <div key={l} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-bold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>Profile Information</h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input label="Full Name / Org Name" value={isDonor ? "Priya Sharma" : "Roti Bank Mumbai"} onChange={() => {}} disabled={!editing} />
              <Input label="Email Address" value={isDonor ? "priya@grandspice.com" : "contact@rotibank.org"} onChange={() => {}} disabled={!editing} />
              <Input label="Phone Number" value="+91 98765 43210" onChange={() => {}} disabled={!editing} />
              {isDonor && <Input label="Donor Type" value="Restaurant" onChange={() => {}} disabled={!editing} />}
              {isNGO && <Input label="NGO Category" value="Food Relief" onChange={() => {}} disabled={!editing} />}
              {isNGO && <Input label="Registration Number" value="MH/NGO/2022/0045" onChange={() => {}} disabled={!editing} />}
            </div>
            <div className="mt-5">
              <Textarea label="Address" value={isDonor ? "The Grand Spice, Waterfield Rd, Bandra West, Mumbai 400050" : "Dharavi Main Rd, Dharavi, Mumbai 400017"} onChange={() => {}} disabled={!editing} rows={2} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>Change Password</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Current Password" type="password" value="" onChange={() => {}} placeholder="••••••••" disabled={!editing} />
              <Input label="New Password" type="password" value="" onChange={() => {}} placeholder="••••••••" disabled={!editing} />
              <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="••••••••" disabled={!editing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NGO PAGES ────────────────────────────────────────────────────────────────

function NGODashboard({ navigate }: any) {
  return (
    <div>
      <PageHeader title="NGO Dashboard" sub="Welcome back, Roti Bank Mumbai!" actions={<Btn onClick={() => navigate("ngo-browse-food")}><Search size={16} /> Browse Food</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Food Collected" value="312" sub="+8 this week" color="emerald" />
        <StatCard icon={Utensils} label="Meals Served" value="12,400" sub="This year" color="amber" />
        <StatCard icon={Activity} label="Active Requests" value="2" sub="1 pending" color="blue" />
        <StatCard icon={Users} label="Families Helped" value="4,200" sub="Across 6 areas" color="purple" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Monthly Collections (2024)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_DATA.slice(-6)}>
              <defs>
                <linearGradient id="ngoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F9FF" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="meals" stroke="#3B82F6" strokeWidth={2} fill="url(#ngoGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Today's Schedule</h3>
          <div className="space-y-3">
            {REQUESTS.filter(r => r.status === "accepted").map(r => (
              <div key={r.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="text-xs font-bold text-foreground truncate mb-1">{r.food}</div>
                <div className="text-xs text-muted-foreground">{r.donor}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1"><Clock size={10} />{r.pickup}</div>
              </div>
            ))}
            <Btn size="sm" variant="secondary" className="w-full" onClick={() => navigate("ngo-pickup-tracking")}>
              <Truck size={12} /> View All Pickups
            </Btn>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Recent Requests</h3>
          <Btn size="sm" variant="ghost" onClick={() => navigate("ngo-my-requests")}>View All <ChevronRight size={14} /></Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Food Item", "Donor", "Requested", "Status", ""].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REQUESTS.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{r.food}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.donor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.reqAt}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3"><button className="text-emerald-600 text-xs font-semibold hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NGOBrowseFood({ navigate }: any) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState<any>(null);
  const cats = ["all", "Cooked Food", "Raw Produce", "Bakery", "Dairy", "Fruits & Dry Fruits"];
  const available = FOOD_ITEMS.filter(f => f.status === "available" && (cat === "all" || f.category === cat) && f.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <Modal open={!!modal} onClose={() => setModal(null)} title="Request Food Pickup">
        {modal && (
          <>
            <div className="bg-muted rounded-xl p-4 mb-5">
              <h4 className="font-bold text-foreground mb-1">{modal.title}</h4>
              <div className="text-sm text-muted-foreground">{modal.qty} {modal.unit} · {modal.location}</div>
              <div className="text-sm text-muted-foreground mt-0.5">Pickup: {modal.pickup}</div>
            </div>
            <Textarea label="Message to Donor" placeholder="We serve 300 meals daily and would use this food for tomorrow morning's distribution..." rows={4} value="" onChange={() => {}} />
            <div className="mt-4">
              <Input label="Preferred Pickup Time" placeholder="6 PM – 7 PM" value="" onChange={() => {}} icon={Clock} />
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="outline" className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn className="flex-1" onClick={() => setModal(null)}><HandHeart size={14} /> Send Request</Btn>
            </div>
          </>
        )}
      </Modal>
      <PageHeader title="Browse Available Food" sub={`${available.length} food listings near you`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search available food..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${cat === c ? "bg-emerald-600 text-white border-emerald-600" : "border-border text-muted-foreground hover:bg-muted"}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {available.length === 0 ? (
        <EmptyState icon={Search} title="No food listings found" desc="Check back soon — new listings appear every hour." action={<Btn variant="secondary" onClick={() => { setCat("all"); setSearch(""); }}>Clear Filters</Btn>} />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {available.map(item => (
            <FoodCard key={item.id} item={item} onView={() => navigate("ngo-food-details")} onRequest={() => setModal(item)} role="ngo" />
          ))}
        </div>
      )}
    </div>
  );
}

function NGOFoodDetails({ navigate }: any) {
  const item = FOOD_ITEMS[0];
  const [modal, setModal] = useState(false);
  return (
    <div>
      <Modal open={modal} onClose={() => setModal(false)} title="Request Food Pickup">
        <div className="bg-muted rounded-xl p-4 mb-5">
          <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
          <div className="text-sm text-muted-foreground">{item.qty} {item.unit} · {item.location}</div>
        </div>
        <Textarea label="Message to Donor" placeholder="Tell the donor about your NGO and how you'll use the food..." rows={4} value="" onChange={() => {}} />
        <div className="mt-4"><Input label="Preferred Pickup Time" value="" onChange={() => {}} icon={Clock} /></div>
        <div className="flex gap-3 mt-6">
          <Btn variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn className="flex-1" onClick={() => setModal(false)}><HandHeart size={14} /> Send Request</Btn>
        </div>
      </Modal>
      <PageHeader title="Food Details" actions={<Btn variant="outline" size="sm" onClick={() => navigate("ngo-browse-food")}><ChevronLeft size={14} /> Back</Btn>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <img src={`https://images.unsplash.com/${item.img}?w=800&h=300&fit=crop&auto=format`} alt={item.title} className="w-full h-52 object-cover" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 mb-1">{item.category}</div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h2>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                {[["Quantity", `${item.qty} ${item.unit}`], ["Estimated Servings", `~${item.servings} people`], ["Pickup Window", item.pickup], ["Expires At", item.expiry], ["Location", item.location], ["Donor", item.donor]].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-muted-foreground mb-0.5">{k}</div>
                    <div className="font-semibold text-foreground">{v}</div>
                  </div>
                ))}
              </div>
              {item.allergens.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">ALLERGEN INFORMATION</div>
                  <div className="flex gap-2">
                    {item.allergens.map(a => <span key={a} className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-lg border border-amber-200">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>About the Donor</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Utensils size={22} className="text-emerald-700" />
              </div>
              <div>
                <div className="font-bold text-foreground">{item.donor}</div>
                <div className="text-xs text-muted-foreground">Verified Donor · {item.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-5">
              {Array(5).fill(0).map((_, i) => <Star key={i} size={12} className={i < 5 ? "text-amber-400 fill-amber-400" : "text-border"} />)}
              <span className="text-xs text-muted-foreground ml-1">5.0 (32 donations)</span>
            </div>
            <Btn size="lg" className="w-full" onClick={() => setModal(true)}>
              <HandHeart size={16} /> Request Pickup
            </Btn>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                <strong>Act fast!</strong> This listing expires soon. Once another NGO requests it, it may not be available.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NGOMyRequests({ navigate }: any) {
  return (
    <div>
      <PageHeader title="My Requests" sub="Track all food pickup requests you've made." actions={<Btn onClick={() => navigate("ngo-browse-food")}><Search size={16} /> Browse More Food</Btn>} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {([["Total", REQUESTS.length, "bg-emerald-50 border-emerald-100 text-emerald-700"], ["Pending", REQUESTS.filter(r => r.status === "pending").length, "bg-amber-50 border-amber-100 text-amber-700"], ["Accepted", REQUESTS.filter(r => r.status === "accepted").length, "bg-blue-50 border-blue-100 text-blue-700"], ["Completed", REQUESTS.filter(r => r.status === "completed").length, "bg-teal-50 border-teal-100 text-teal-700"]] as [string, number, string][]).map(([l, v, cls]) => {
          const [bg, border, txt] = cls.split(" ");
          return (
          <div key={l} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${txt}`}>{v}</div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">{l}</div>
          </div>
          );
        })}
      </div>
      <div className="space-y-4">
        {REQUESTS.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{r.food}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-sm text-muted-foreground">Donor: {r.donor}</div>
                <div className="text-sm text-muted-foreground mt-0.5">Requested {r.reqAt} · Pickup: {r.pickup}</div>
                <div className="mt-2 bg-muted rounded-lg p-2 text-xs text-muted-foreground italic">"{r.note}"</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {r.status === "accepted" && <Btn size="sm" onClick={() => navigate("ngo-pickup-tracking")}><Truck size={12} /> Track</Btn>}
                <Btn size="sm" variant="outline"><Eye size={12} /> Details</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PAGES ──────────────────────────────────────────────────────────────

function AdminDashboard({ navigate }: any) {
  return (
    <div>
      <PageHeader title="Platform Overview" sub="ResQMeal Admin Dashboard — All systems operational." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value="1,284" sub="+24 this week" color="emerald" />
        <StatCard icon={Heart} label="Active Donors" value="350" sub="Across 6 cities" color="amber" />
        <StatCard icon={Building} label="Verified NGOs" value="120" sub="8 pending review" color="blue" />
        <StatCard icon={Package} label="Active Listings" value="47" sub="12 expiring today" color="teal" />
        <StatCard icon={Utensils} label="Total Meals Rescued" value="12,400" sub="This calendar year" color="purple" />
        <StatCard icon={AlertTriangle} label="Pending Actions" value="11" sub="3 urgent" color="red" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Platform Activity (2024)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="donations" stroke="#059669" strokeWidth={2} dot={false} name="Donations" />
              <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} dot={false} name="Requests" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Food by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {CAT_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CAT_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-muted-foreground">{d.name}</span></div>
                <span className="font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-display)" }}>Pending NGO Verifications</h3>
            <Btn size="sm" variant="ghost" onClick={() => navigate("admin-ngo-verification")}>View All <ChevronRight size={14} /></Btn>
          </div>
          <div className="divide-y divide-border">
            {NGOS.filter(n => !n.verified).map(n => (
              <div key={n.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="font-semibold text-sm text-foreground">{n.name}</div>
                  <div className="text-xs text-muted-foreground">{n.category} · {n.address}</div>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" className="text-xs"><Check size={11} /> Approve</Btn>
                  <Btn size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50"><X size={11} /></Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-display)" }}>System Alerts</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { t: "12 listings expiring in 2 hours", type: "warning" },
              { t: "NGO 'Meal Magic' verification overdue (5 days)", type: "error" },
              { t: "Server response time optimal (<200ms)", type: "success" },
              { t: "New donor registration: FreshMart Superstore", type: "info" },
            ].map((a, i) => {
              const Icon = a.type === "warning" ? AlertTriangle : a.type === "error" ? AlertCircle : a.type === "success" ? CheckCircle : Info;
              const cls: any = { warning: "text-amber-600 bg-amber-50", error: "text-red-600 bg-red-50", success: "text-emerald-600 bg-emerald-50", info: "text-blue-600 bg-blue-50" };
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${cls[a.type]}`}>
                  <Icon size={14} className="flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium">{a.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUserTable({ title, data, cols, navigate }: any) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((d: any) => Object.values(d).some((v: any) => String(v).toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <PageHeader title={title} sub={`${data.length} records found`} actions={<Btn size="sm"><Download size={14} /> Export CSV</Btn>} />
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{[...cols.map((c: any) => c.header), "Actions"].map((h: string) => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {cols.map((c: any) => (
                    <td key={c.key} className="px-5 py-3">
                      {c.badge ? <StatusBadge status={row[c.key]} /> : <span className={c.bold ? "font-medium text-foreground" : "text-muted-foreground"}>{row[c.key]}</span>}
                    </td>
                  ))}
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button className="text-emerald-600 text-xs font-semibold hover:underline">View</button>
                      <button className="text-red-500 text-xs font-semibold hover:underline">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ navigate }: any) {
  const users = [
    { name: "Priya Sharma", email: "priya@grandspice.com", role: "Donor", joined: "Jan 10, 2025", status: "approved" },
    { name: "Roti Bank Mumbai", email: "contact@rotibank.org", role: "NGO", joined: "Mar 5, 2022", status: "approved" },
    { name: "Chef Rahul Menon", email: "rahul@grandspice.com", role: "Donor", joined: "Feb 1, 2025", status: "approved" },
    { name: "AnnaData Foundation", email: "hello@annadata.org", role: "NGO", joined: "Jun 20, 2023", status: "pending" },
    { name: "Meal Magic NGO", email: "care@mealmagic.in", role: "NGO", joined: "Jan 3, 2024", status: "pending" },
    ...Array(4).fill(null).map((_, i) => ({ name: `User ${i + 5}`, email: `user${i + 5}@example.com`, role: i % 2 === 0 ? "Donor" : "NGO", joined: "Dec 2024", status: "approved" })),
  ];
  return <AdminUserTable title="All Users" data={users} navigate={navigate} cols={[{ key: "name", header: "Name", bold: true }, { key: "email", header: "Email" }, { key: "role", header: "Role" }, { key: "joined", header: "Joined" }, { key: "status", header: "Status", badge: true }]} />;
}

function AdminDonors({ navigate }: any) {
  const donors = [
    { name: "The Grand Spice", type: "Restaurant", donations: 48, meals: 2840, status: "approved" },
    { name: "Fresh Farms Ltd.", type: "Grocery", donations: 31, meals: 1540, status: "approved" },
    { name: "Golden Crust Bakery", type: "Bakery", donations: 24, meals: 960, status: "approved" },
    { name: "Hotel Crown Plaza", type: "Hotel", donations: 67, meals: 5200, status: "approved" },
    { name: "Nature's Basket", type: "Grocery", donations: 19, meals: 760, status: "pending" },
    { name: "Annapurna Restaurant", type: "Restaurant", donations: 38, meals: 1900, status: "approved" },
  ];
  return <AdminUserTable title="Donors" data={donors} navigate={navigate} cols={[{ key: "name", header: "Donor Name", bold: true }, { key: "type", header: "Type" }, { key: "donations", header: "Donations" }, { key: "meals", header: "Meals Rescued" }, { key: "status", header: "Status", badge: true }]} />;
}

function AdminNGOs({ navigate }: any) {
  const ngoData = NGOS.map(n => ({ name: n.name, cat: n.category, meals: n.meals.toLocaleString(), joined: n.joined, status: n.status }));
  return <AdminUserTable title="NGOs" data={ngoData} navigate={navigate} cols={[{ key: "name", header: "NGO Name", bold: true }, { key: "cat", header: "Category" }, { key: "meals", header: "Meals Collected" }, { key: "joined", header: "Joined" }, { key: "status", header: "Status", badge: true }]} />;
}

function AdminNGOVerification({ navigate }: any) {
  const [selected, setSelected] = useState<any>(null);
  const pending = NGOS.filter(n => n.status === "pending");
  return (
    <div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Review NGO Application">
        {selected && (
          <>
            <div className="space-y-3 mb-6">
              {[["NGO Name", selected.name], ["Category", selected.category], ["Registration No", selected.regNo], ["Address", selected.address], ["Contact", selected.email], ["Daily Capacity", selected.meals + " meals"], ["Applied", selected.joined]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 mb-5">
              <AlertTriangle size={12} className="inline mr-1" /> Verify the registration document before approving. Documents uploaded in the NGO portal.
            </div>
            <div className="flex gap-3">
              <Btn variant="danger" className="flex-1" onClick={() => setSelected(null)}><X size={14} /> Reject</Btn>
              <Btn className="flex-1" onClick={() => setSelected(null)}><Check size={14} /> Approve NGO</Btn>
            </div>
          </>
        )}
      </Modal>
      <PageHeader title="NGO Verification" sub={`${pending.length} applications awaiting review`} />
      {pending.length === 0 ? (
        <EmptyState icon={Shield} title="All caught up!" desc="No NGO applications are pending review." />
      ) : (
        <div className="space-y-4">
          {pending.map(n => (
            <div key={n.id} className="bg-card border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><Building size={22} className="text-amber-700" /></div>
                  <div>
                    <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{n.name}</h3>
                    <div className="text-sm text-muted-foreground">{n.category} · {n.address}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Applied: {n.joined} · Reg: {n.regNo}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Btn size="sm" variant="outline" onClick={() => setSelected(n)}><Eye size={12} /> Review</Btn>
                  <Btn size="sm" onClick={() => {}}><Check size={12} /> Approve</Btn>
                  <Btn size="sm" variant="danger" onClick={() => {}}><X size={12} /> Reject</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminFoodManagement({ navigate }: any) {
  return (
    <div>
      <PageHeader title="Food Management" sub={`${FOOD_ITEMS.length} total listings`} actions={<Btn size="sm"><Download size={14} /> Export</Btn>} />
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Object.entries(FOOD_ITEMS.reduce((acc, f) => ({ ...acc, [f.status]: (acc[f.status as keyof typeof acc] ?? 0) + 1 }), {} as Record<string, number>)).map(([s, v]) => (
          <div key={s} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-foreground">{v}</div>
            <StatusBadge status={s} />
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Food Item", "Donor", "Category", "Qty", "Status", "Posted", "Actions"].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FOOD_ITEMS.map(f => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground max-w-[160px] truncate">{f.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.donor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.category}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.qty} {f.unit}</td>
                  <td className="px-5 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{f.posted}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button className="text-emerald-600 text-xs font-semibold hover:underline">View</button>
                      <button className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminRequestManagement({ navigate }: any) {
  return (
    <div>
      <PageHeader title="Request Management" sub={`${REQUESTS.length} total requests`} />
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Food Item", "Donor", "NGO", "Requested", "Status", "Pickup Time", "Actions"].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REQUESTS.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground max-w-[140px] truncate">{r.food}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.donor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.ngo}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.reqAt}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{r.pickup}</td>
                  <td className="px-5 py-3">
                    <button className="text-emerald-600 text-xs font-semibold hover:underline">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminPickupMonitoring({ navigate }: any) {
  const active = REQUESTS.filter(r => r.status === "accepted");
  return (
    <div>
      <PageHeader title="Pickup Monitoring" sub={`${active.length} active pickups being tracked`} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={Truck} label="Active Pickups" value={active.length} color="emerald" />
        <StatCard icon={CheckCircle} label="Completed Today" value="7" color="teal" />
        <StatCard icon={AlertCircle} label="Overdue" value="1" color="red" />
      </div>
      <div className="space-y-4">
        {active.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{r.food}</h3>
                <div className="text-sm text-muted-foreground">Donor: {r.donor} → NGO: {r.ngo}</div>
              </div>
              <div className="flex gap-2 items-center">
                <StatusBadge status="en route" />
                <Btn size="sm" variant="outline"><Phone size={12} /> Contact</Btn>
              </div>
            </div>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {PICKUP_STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= 3 ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-border text-muted-foreground"}`}>
                      {i <= 3 ? <Check size={12} /> : i + 1}
                    </div>
                    <div className={`text-xs mt-1 text-center max-w-[65px] leading-tight ${i <= 3 ? "text-emerald-700 font-medium" : "text-muted-foreground"}`}>{s}</div>
                  </div>
                  {i < PICKUP_STEPS.length - 1 && <div className={`h-0.5 w-6 mx-0.5 flex-shrink-0 ${i < 3 ? "bg-emerald-500" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReports({ navigate }: any) {
  return (
    <div>
      <PageHeader title="Reports & Analytics" sub="Platform performance metrics and insights." actions={
        <div className="flex gap-2">
          <select className="border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option>Last 12 months</option><option>Last 6 months</option><option>Last 30 days</option>
          </select>
          <Btn size="sm"><Download size={14} /> Export PDF</Btn>
        </div>
      } />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([ ["Total Donations", "718", "+18%"], ["Total Requests", "652", "+14%"], ["Success Rate", "91.2%", "+2.1%"], ["Avg Pickup Time", "47 min", "-5 min"]] as [string,string,string][]).map(([l, v, t]) => (
          <div key={l} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{v}</div>
            <div className="text-sm text-foreground mt-0.5">{l}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">↑ {t} vs last period</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Donations vs Requests</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="donations" fill="#059669" radius={[3, 3, 0, 0]} name="Donations" />
              <Bar dataKey="requests" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>Meals Rescued Monthly</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="meals" stroke="#059669" strokeWidth={2} fill="url(#repGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-display)" }}>Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{["Month", "Donations", "Requests", "Meals", "Success Rate"].map(h => <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MONTHLY_DATA.map(d => (
                <tr key={d.month} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium text-foreground">{d.month} 2024</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.donations}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.requests}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.meals.toLocaleString()}</td>
                  <td className="px-5 py-3 text-emerald-600 font-semibold">{Math.round((d.requests / d.donations) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ navigate }: any) {
  const [settings, setSettings] = useState({ maxListingHours: "48", maxQty: "500", autoExpire: true, emailNotifs: true, smsNotifs: false, verifyNGO: true, allowRadius: "25" });
  const s = (k: string) => (e: any) => setSettings({ ...settings, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <div>
      <PageHeader title="Platform Settings" sub="Configure ResQMeal platform parameters." actions={<Btn><Check size={14} /> Save All Changes</Btn>} />
      <div className="max-w-2xl space-y-6">
        {[
          {
            title: "Listing Configuration",
            fields: [
              { label: "Max Listing Duration (hours)", key: "maxListingHours", type: "number" },
              { label: "Max Food Quantity per Listing (kg)", key: "maxQty", type: "number" },
              { label: "NGO Search Radius (km)", key: "allowRadius", type: "number" },
            ],
          },
        ].map(section => (
          <div key={section.title} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map(f => (
                <div key={f.key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{f.label}</label>
                  <input type={f.type} value={(settings as any)[f.key]} onChange={s(f.key)} className="w-24 border border-border rounded-xl px-3 py-1.5 text-sm text-right bg-input-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>Notifications & Features</h3>
          <div className="space-y-4">
            {[["Auto-expire listings after duration", "autoExpire"], ["Email notifications to users", "emailNotifs"], ["SMS notifications (paid service)", "smsNotifs"], ["Require NGO verification before approval", "verifyNGO"]].map(([l, k]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{l}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={(settings as any)[k]} onChange={s(k)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="font-bold text-red-800 mb-4">Danger Zone</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Btn variant="danger" size="sm"><RefreshCw size={14} /> Reset Platform Data</Btn>
            <Btn variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50"><Download size={14} /> Export All Data</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROUTER ───────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("home");
  const [role, setRole] = useState("public");
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);

  const navigate = (v: string) => setView(v);

  const handleLogin = (r: string, user?: any) => {
    setAuthUser(user || null);
    setRole(r);
    setView(`${r}-dashboard`);
  };

  const handleLogout = () => {
    setRole("public");
    setView("home");
  };

  // Public routes
  if (view === "home")         return <HomePage navigate={navigate} />;
  if (view === "about")        return <AboutPage navigate={navigate} />;
  if (view === "how-it-works") return <HowItWorksPage navigate={navigate} />;
  if (view === "impact")       return <ImpactPage navigate={navigate} />;
  if (view === "contact")      return <ContactPage navigate={navigate} />;

  // Auth routes
  if (view === "donor-login")    return <DonorLoginPage navigate={navigate} onLogin={(user: any) => handleLogin("donor", user)} />;
  if (view === "donor-register") return <DonorRegisterPage navigate={navigate} />;
  if (view === "ngo-login")      return <NGOLoginPage navigate={navigate} onLogin={(user: any) => handleLogin("ngo", user)} />;
  if (view === "ngo-register")   return <NGORegisterPage navigate={navigate} />;
  if (view === "admin-login")    return <AdminLoginPage navigate={navigate} onLogin={() => handleLogin("admin")} />;

  // Dashboard routes — all wrapped in DashboardLayout
  const currentRole = role === "public" ? "donor" : role;

  return (
    <DashboardLayout role={currentRole} view={view} navigate={navigate} onLogout={handleLogout}>
      {/* DONOR */}
      {view === "donor-dashboard"        && <DonorDashboard navigate={navigate} />}
      {view === "donor-add-food"         && <DonorAddFood navigate={navigate} />}
      {view === "donor-my-donations"     && <DonorMyDonations navigate={navigate} authUser={authUser} />}
      {view === "donor-donation-details" && <DonorDonationDetails navigate={navigate} />}
      {view === "donor-ngo-requests"     && <DonorNGORequests navigate={navigate} />}
      {view === "donor-pickup-tracking"  && <DonorPickupTracking navigate={navigate} />}
      {view === "donor-notifications"    && <NotificationsPage navigate={navigate} role="donor" />}
      {view === "donor-impact"           && <ImpactDashboard role="donor" />}
      {view === "donor-profile"          && <ProfilePage role="donor" />}

      {/* NGO */}
      {view === "ngo-dashboard"         && <NGODashboard navigate={navigate} />}
      {view === "ngo-browse-food"       && <NGOBrowseFood navigate={navigate} />}
      {view === "ngo-food-details"      && <NGOFoodDetails navigate={navigate} />}
      {view === "ngo-my-requests"       && <NGOMyRequests navigate={navigate} />}
      {view === "ngo-pickup-tracking"   && <DonorPickupTracking navigate={navigate} />}
      {view === "ngo-notifications"     && <NotificationsPage navigate={navigate} role="ngo" />}
      {view === "ngo-impact"            && <ImpactDashboard role="ngo" />}
      {view === "ngo-profile"           && <ProfilePage role="ngo" />}

      {/* ADMIN */}
      {view === "admin-dashboard"          && <AdminDashboard navigate={navigate} />}
      {view === "admin-users"              && <AdminUsers navigate={navigate} />}
      {view === "admin-donors"             && <AdminDonors navigate={navigate} />}
      {view === "admin-ngos"               && <AdminNGOs navigate={navigate} />}
      {view === "admin-ngo-verification"   && <AdminNGOVerification navigate={navigate} />}
      {view === "admin-food-management"    && <AdminFoodManagement navigate={navigate} />}
      {view === "admin-request-management" && <AdminRequestManagement navigate={navigate} />}
      {view === "admin-pickup-monitoring"  && <AdminPickupMonitoring navigate={navigate} />}
      {view === "admin-reports"            && <AdminReports navigate={navigate} />}
      {view === "admin-settings"           && <AdminSettings navigate={navigate} />}
    </DashboardLayout>
  );
}