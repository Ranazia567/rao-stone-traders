import { MapPin, Phone, Truck, Mountain } from 'lucide-react';

const Footer = () => {
  const contacts = [
    { name: 'Rao Afzal', phone: '0301-7367553' },
    { name: 'Rao Afzal', phone: '0346-8090443' },
    { name: 'Rao Mehtab', phone: '0345-3413730' },
    { name: 'Rao Saifullah', phone: null },
    { name: 'Rao Abdul Rehman', phone: null },
  ];

  const cities = [
    'Sargodha', 'Lahore', 'Faisalabad', 'Gujranwala',
    'Rawalpindi', 'Multan', 'Sahiwal', 'Sheikhupura',
  ];

  return (
    <footer className="bg-slate-950 border-t border-stone-600/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mountain className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-amber-500">Rao Stone Traders</h3>
            </div>
            <p className="text-stone-400 text-sm mb-3">راؤ اسٹون ٹریڈرز</p>
            <div className="flex items-start gap-2 text-stone-300 text-sm">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Pul 111, Faisalabad Road, Sargodha, Punjab, Pakistan</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-emerald-500" />
              <h4 className="text-lg font-semibold text-stone-100">Contact</h4>
            </div>
            <ul className="space-y-2">
              {contacts.map((c) => (
                <li key={c.name + (c.phone || '')} className="text-sm text-stone-300 flex items-center gap-2">
                  <span className="font-medium text-stone-200">{c.name}</span>
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/-/g, '')}`} className="text-emerald-500 hover:text-emerald-400">
                      {c.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-amber-500" />
              <h4 className="text-lg font-semibold text-stone-100">Punjab Delivery</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <span
                  key={city}
                  className="badge bg-stone-600/40 text-stone-300 border border-stone-600/60"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-3">
              Dumper: 1000 Cu.Ft | Trolley: 150 Cu.Ft
            </p>
          </div>
        </div>

        <div className="border-t border-stone-600/60 mt-8 pt-6 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Rao Stone Traders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
