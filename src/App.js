import { useState, useEffect } from "react";
import { getData, saveData as fbSave, getPengurus, kirimFeedback, subscribeFeedback, hapusFeedback, uploadFoto } from "./firebase";

const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASSWORD;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const initData = {
  profil: {
    nama: "Karang Taruna RW 02 Kalisari",
    tagline: "Hati, Aksi, Mandiri",
    deskripsi: "Karang Taruna RW 02 Kalisari adalah organisasi kepemudaan yang berdiri sejak 2019 dan telah aktif bergerak selama 5 tahun dalam bidang sosial, seni budaya, olahraga, dan pemberdayaan masyarakat. Kami berkomitmen untuk menjadi wadah kreativitas dan kepedulian pemuda demi lingkungan RW 02 yang lebih maju dan harmonis.",
    berdiri: "2019", anggota: "85+", kegiatan: "50+", penghargaan: "3",
    visi: "Menjadi organisasi kepemudaan yang mandiri, kreatif, dan berdaya guna dalam membangun masyarakat RW 02 Kalisari yang sejahtera dan harmonis.",
    misi: ["Menghimpun dan mengembangkan potensi pemuda RW 02 Kalisari", "Menggerakkan partisipasi aktif pemuda dalam pembangunan sosial kemasyarakatan", "Menyelenggarakan kegiatan yang bermanfaat di bidang sosial, seni, olahraga dan pendidikan", "Membangun kerja sama antar warga dan lembaga untuk kemajuan bersama"],
    nilai: "Gotong royong, inovatif, inklusif, dan berorientasi dampak",
    lokasi: "RW 02 Kalisari, Kecamatan Pasar Rebo, Jakarta Timur",
    filosofiLogo: [
      { elemen: "Segi Tujuh", makna: "Melambangkan Tri Darma Karang Taruna yang terdiri dari tujuh unsur pembangunan." },
      { elemen: "Lima Sosok Pemuda", makna: "Mewakili semangat kebersamaan dan persatuan pemuda dari berbagai latar belakang dalam satu gerakan." },
      { elemen: "Bunga Teratai", makna: "Melambangkan kesucian, keteguhan, dan tekad pemuda untuk tumbuh di tengah tantangan." },
      { elemen: "Warna Hijau", makna: "Melambangkan kesuburan, harapan, dan semangat muda yang terus tumbuh." },
      { elemen: "Warna Emas / Gold", makna: "Melambangkan kemuliaan, kejayaan, dan cita-cita luhur yang ingin diraih." },
      { elemen: "Tulisan Adhitya Karya Mahatva Yodha", makna: "Semboyan Karang Taruna yang berarti Kader Muda Pejuang Karya Agung — mencerminkan tekad menjadi generasi penerus yang berprestasi." },
    ],
  },
  pengurus: [
    { id: 1, nama: "Ahmad Fauzi", jabatan: "Ketua", periode: "2023–2025", foto: "" },
    { id: 2, nama: "Siti Rahayu", jabatan: "Wakil Ketua", periode: "2023–2025", foto: "" },
    { id: 3, nama: "Budi Santoso", jabatan: "Sekretaris", periode: "2023–2025", foto: "" },
    { id: 4, nama: "Dewi Lestari", jabatan: "Bendahara", periode: "2023–2025", foto: "" },
    { id: 5, nama: "Rizky Pratama", jabatan: "Koordinator Sosial", periode: "2023–2025", foto: "" },
    { id: 6, nama: "Nisa Amalia", jabatan: "Koordinator Seni & Budaya", periode: "2023–2025", foto: "" },
  ],
  kegiatan: [
    { id: 1, judul: "HUT RI ke-79 RW 02", kategori: "Kemasyarakatan", tanggal: "2024-08-17", deskripsi: "Peringatan HUT RI dengan berbagai lomba dan pentas seni warga.", foto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80", link: "https://www.instagram.com/kartarr_02/" },
    { id: 2, judul: "Turnamen Futsal Antar RW", kategori: "Olahraga", tanggal: "2024-06-10", deskripsi: "Turnamen futsal antar pemuda RW se-kelurahan Kalisari.", foto: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", link: "https://www.instagram.com/kartarr_02/" },
    { id: 3, judul: "Bakti Sosial Ramadan", kategori: "Sosial", tanggal: "2024-03-25", deskripsi: "Pembagian 200 paket sembako untuk warga kurang mampu di lingkungan RW 02.", foto: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?w=400&q=80", link: "https://www.instagram.com/kartarr_02/" },
    { id: 4, judul: "Pelatihan Digital Marketing", kategori: "Pendidikan", tanggal: "2024-01-15", deskripsi: "Workshop digital marketing untuk pemuda guna meningkatkan wirausaha berbasis digital.", foto: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80", link: "https://www.instagram.com/kartarr_02/" },
    { id: 5, judul: "Pentas Seni Akhir Tahun", kategori: "Seni & Budaya", tanggal: "2023-12-31", deskripsi: "Pentas seni malam pergantian tahun menampilkan tarian daerah dan musik.", foto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", link: "https://www.youtube.com/@karangtarunarw02kalisari70" },
    { id: 6, judul: "Kerja Bakti Lingkungan", kategori: "Sosial", tanggal: "2023-11-05", deskripsi: "Gotong royong bersih-bersih lingkungan RW 02 dan penanaman pohon.", foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", link: "https://www.instagram.com/kartarr_02/" },
  ],
  galeri: [
    { id: 1, url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80", caption: "HUT RI ke-79", tahun: "2024" },
    { id: 2, url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", caption: "Turnamen Futsal", tahun: "2024" },
    { id: 3, url: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?w=400&q=80", caption: "Bakti Sosial Ramadan", tahun: "2024" },
    { id: 4, url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80", caption: "Pelatihan Digital", tahun: "2024" },
    { id: 5, url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", caption: "Pentas Seni", tahun: "2023" },
    { id: 6, url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", caption: "Kerja Bakti", tahun: "2023" },
  ],
  penghargaan: [
    { id: 1, judul: "Karang Taruna Terbaik Kelurahan Kalisari", penyelenggara: "Kelurahan Kalisari", tahun: "2023", deskripsi: "Penghargaan atas konsistensi dan inovasi program sosial kemasyarakatan.", tingkat: "Kelurahan" },
    { id: 2, judul: "Juara 1 Lomba Kebersihan Lingkungan", penyelenggara: "Kecamatan Pasar Rebo", tahun: "2022", deskripsi: "Penghargaan atas program kerja bakti dan penghijauan lingkungan RW 02.", tingkat: "Kecamatan" },
    { id: 3, judul: "Penghargaan Program Kepemudaan Inovatif", penyelenggara: "Suku Dinas Pemuda & Olahraga Jakarta Timur", tahun: "2022", deskripsi: "Diraih atas program pelatihan digital marketing untuk pemuda yang berdampak luas.", tingkat: "Kota" },
  ],
  usahaEkonomi: [
    { id: 1, nama: "HT (Handy Talkie)", kategori: "sewa", harga: "50000", satuan: "hari", deskripsi: "Sewa HT untuk kegiatan, tersedia beberapa unit.", foto: "", stok: "5 unit", tersedia: true },
    { id: 2, nama: "Kaos Karang Taruna", kategori: "jual", harga: "75000", satuan: "pcs", deskripsi: "Kaos resmi Karang Taruna RW 02 Kalisari.", foto: "", stok: "", tersedia: true },
  ],
  kolaborasi: [
    { id: 1, nama: "Kelurahan Kalisari", logo: "", status: "aktif" },
    { id: 2, nama: "Kecamatan Pasar Rebo", logo: "", status: "aktif" },
    { id: 3, nama: "Karang Taruna Jakarta Timur", logo: "", status: "aktif" },
  ],
  funfacts: [
    { id: 1, emoji: "🎉", angka: "50+", label: "Kegiatan digelar sejak berdiri" },
    { id: 2, emoji: "👥", angka: "85+", label: "Anggota aktif saat ini" },
    { id: 3, emoji: "🏆", angka: "3", label: "Penghargaan diraih" },
    { id: 4, emoji: "🌱", angka: "7", label: "Divisi yang aktif bergerak" },
  ]
};

const CATS = ["Semua","Kemasyarakatan","Olahraga","Sosial","Pendidikan","Seni & Budaya"];
const katColor = { Kemasyarakatan:"#C8922A", Olahraga:"#185FA5", Sosial:"#993C1D", Pendidikan:"#533AB7", "Seni & Budaya":"#993556", default:"#5F5E5A" };
const katBg = { Kemasyarakatan:"#FBF3E2", Olahraga:"#E6F1FB", Sosial:"#FAECE7", Pendidikan:"#EEEDFE", "Seni & Budaya":"#FBEAF0", default:"#F1EFE8" };
const tingkatColor = { Kelurahan:"#185FA5", Kecamatan:"#C8922A", Kota:"#854F0B", Nasional:"#993C1D" };
const tingkatBg = { Kelurahan:"#E6F1FB", Kecamatan:"#FBF3E2", Kota:"#FAEEDA", Nasional:"#FAECE7" };

function Avatar({ nama, size=44 }) {
  const initials = nama.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const colors = ["#185FA5","#C8922A","#533AB7","#993C1D","#993556","#0D4A8A"];
  const bg = colors[nama.charCodeAt(0) % colors.length];
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:size*0.3,flexShrink:0}}>{initials}</div>;
}
function Badge({ kat }) {
  return <span style={{background:katBg[kat]||katBg.default,color:katColor[kat]||katColor.default,fontSize:11,fontWeight:500,padding:"3px 8px",borderRadius:6}}>{kat}</span>;
}
function TingkatBadge({ t }) {
  return <span style={{background:tingkatBg[t]||"#F1EFE8",color:tingkatColor[t]||"#5F5E5A",fontSize:11,fontWeight:500,padding:"3px 10px",borderRadius:12}}>{t}</span>;
}

// ── NAVBAR ────────────────────────────────────────────────────────────
function Navbar({ page, setPage, isAdmin, setMode }) {
  const nav = ["Beranda","Profil","Kegiatan","Galeri","Pengurus","Penghargaan","Kontak"];
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const go = (n) => { setPage(n); setOpen(false); };
  return (
    <nav style={{background:"#fff",borderBottom:"2px solid #C8922A",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <img src="/logo-kartar.png" alt="Logo Kartar RW 02" style={{width:36,height:36,objectFit:"contain"}} />
          <span style={{fontWeight:500,fontSize:isMobile?11:13,color:"#1a1a18"}}>{isMobile?"Kartar RW 02":"Karang Taruna Unit RW 02 Kalisari"}</span>
        </div>
        {isMobile ? (
          <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",flexDirection:"column",gap:5}}>
            <span style={{display:"block",width:22,height:2,background:"#1a1a18",borderRadius:2,transition:"all 0.2s"}} />
            <span style={{display:"block",width:22,height:2,background:"#1a1a18",borderRadius:2,transition:"all 0.2s"}} />
            <span style={{display:"block",width:22,height:2,background:"#1a1a18",borderRadius:2,transition:"all 0.2s"}} />
          </button>
        ) : (
          <div style={{display:"flex",gap:2,alignItems:"center"}}>
            {nav.map(n=>(
              <button key={n} onClick={()=>setPage(n)} style={{background:page===n?"#E8F0FB":"transparent",color:page===n?"#0D4A8A":"#5F5E5A",border:"none",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:page===n?500:400}}>{n}</button>
            ))}
            {isAdmin
              ? <button onClick={()=>setMode("admin")} style={{marginLeft:6,background:"#C8922A",color:"#fff",border:"none",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Panel Admin</button>
              : <button onClick={()=>setMode("login")} style={{marginLeft:6,background:"transparent",color:"#5F5E5A",border:"0.5px solid #ccc",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Admin</button>
            }
          </div>
        )}
      </div>
      {isMobile && open && (
        <div style={{background:"#fff",borderTop:"0.5px solid #e8e8e5",padding:"12px 16px",display:"flex",flexDirection:"column",gap:2}}>
          {nav.map(n=>(
            <button key={n} onClick={()=>go(n)} style={{background:page===n?"#E8F0FB":"transparent",color:page===n?"#0D4A8A":"#5F5E5A",border:"none",padding:"10px 12px",borderRadius:6,cursor:"pointer",fontSize:14,fontWeight:page===n?500:400,textAlign:"left"}}>{n}</button>
          ))}
          <div style={{borderTop:"0.5px solid #e8e8e5",marginTop:6,paddingTop:6}}>
            {isAdmin
              ? <button onClick={()=>{setMode("admin");setOpen(false);}} style={{width:"100%",background:"#C8922A",color:"#fff",border:"none",padding:"10px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:500}}>Panel Admin</button>
              : <button onClick={()=>{setMode("login");setOpen(false);}} style={{width:"100%",background:"transparent",color:"#5F5E5A",border:"0.5px solid #ccc",padding:"10px",borderRadius:6,cursor:"pointer",fontSize:13}}>Admin</button>
            }
          </div>
        </div>
      )}
    </nav>
  );
}

// ── BERANDA (REDESIGNED) ──────────────────────────────────────────────
function Beranda({ data, setPage }) {
  const isMobile = useIsMobile();
  const recent = [...data.kegiatan].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,3);
  const bidang = [
    { icon:"🤝", label:"Sosial & Kemasyarakatan", desc:"Bakti sosial, santunan, dan program kemanusiaan untuk warga RW 02", color:"#FAECE7", tc:"#993C1D" },
    { icon:"🎭", label:"Seni & Budaya", desc:"Pentas seni, festival budaya, dan pelestarian tradisi lokal", color:"#FBEAF0", tc:"#993556" },
    { icon:"⚽", label:"Olahraga", desc:"Turnamen, senam pagi, dan kegiatan olahraga rutin bagi pemuda", color:"#E6F1FB", tc:"#185FA5" },
    { icon:"📚", label:"Pendidikan", desc:"Workshop, pelatihan skill, dan program literasi digital pemuda", color:"#EEEDFE", tc:"#533AB7" },
    { icon:"🌿", label:"Lingkungan Hidup", desc:"Kerja bakti, penghijauan, dan pengelolaan kebersihan lingkungan", color:"#E8F0FB", tc:"#0D4A8A" },
    { icon:"💼", label:"Kewirausahaan", desc:"Pemberdayaan ekonomi pemuda melalui program wirausaha mandiri", color:"#FAEEDA", tc:"#854F0B" },
  ];
  const timeline = [
    { tahun:"2021", label:"Terbentuk", desc:"Karang Taruna RW 02 resmi dibentuk dari keresahan Pemuda dan Keadaan" },
    { tahun:"2022", label:"Terus Bergerak", desc:"Bermunculan program-program inovatif untuk masyarakat" },
    { tahun:"2023", label:"Berprestasi", desc:"Berprestasi dalam aksi sosial dan kemanusiaan" },
    { tahun:"2024", label:"Regenerasi", desc:"Pergantian kepengurusan baru, semangat baru untuk RW 02 Kalisari" },
    { tahun:"2025", label:"Melangkah Maju", desc:"Memperluas program dan kolaborasi demi kemajuan pemuda RW 02" },
    { tahun:"2026", label:"Berinovasi", desc:"Peluncuran program baru yang berfokus pada inovasi dan teknologi" },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{backgroundImage:"url('/hero.jpg')",backgroundSize:"cover",backgroundPosition:"center",padding:"60px 20px 0",textAlign:"center",color:"#fff",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(24,95,165,0.78)"}} />
        <div style={{maxWidth:720,margin:"0 auto",position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(200,146,42,0.25)",border:"1px solid rgba(200,146,42,0.5)",borderRadius:20,padding:"5px 14px",fontSize:12,marginBottom:18}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#C8922A",display:"inline-block"}} />
            Aktif sejak {data.profil.berdiri} · {new Date().getFullYear() - (parseInt((data.profil.berdiri||"").match(/\d{4}/)?.[0]) || new Date().getFullYear())} tahun bergerak bersama warga
          </div>
          <h1 style={{fontSize:isMobile?22:34,fontWeight:500,margin:"0 0 10px",lineHeight:1.25}}>{data.profil.nama}</h1>
          <p style={{fontSize:16,opacity:0.85,margin:"0 0 10px",fontWeight:400}}><em>{data.profil.tagline}</em></p>
          <p style={{fontSize:14,opacity:0.75,margin:"0 0 30px",lineHeight:1.7,maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>Organisasi dari masyarakat yang bergerak karena hati menciptakan sebuah aksi untuk masyarakat dan menciptakan kemandirian.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
            <button onClick={()=>setPage("Kegiatan")} style={{background:"#fff",color:"#185FA5",border:"none",padding:"10px 22px",borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:14}}>Lihat Kegiatan</button>
            <button onClick={()=>setPage("Profil")} style={{background:"transparent",color:"#fff",border:"1.5px solid rgba(255,255,255,0.5)",padding:"10px 22px",borderRadius:8,cursor:"pointer",fontSize:14}}>Tentang Kami</button>
          </div>
          {/* Stats bar */}
          <div style={{background:"rgba(255,255,255,0.1)",borderTop:"2px solid rgba(200,146,42,0.6)",borderRadius:"12px 12px 0 0",padding:"16px 20px",display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8,textAlign:"center"}}>
            {[{v:data.profil.berdiri,l:"Tahun Berdiri"},{v:data.profil.anggota,l:"Anggota Aktif"},{v:data.profil.kegiatan,l:"Total Kegiatan"},{v:data.profil.penghargaan,l:"Penghargaan"}].map(s=>(
              <div key={s.l}>
                <div style={{fontSize:22,fontWeight:500}}>{s.v}</div>
                <div style={{fontSize:11,opacity:0.7,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TENTANG SINGKAT ── */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 20px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?20:32,alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Siapa kami</div>
            <h2 style={{fontSize:isMobile?18:22,fontWeight:500,margin:"0 0 14px",color:"#1a1a18",lineHeight:1.35}}>Organisasi kepemudaan yang tumbuh bersama warga</h2>
            <p style={{fontSize:14,color:"#5F5E5A",lineHeight:1.8,margin:"0 0 16px"}}>{data.profil.deskripsi}</p>
            <button onClick={()=>setPage("Profil")} style={{background:"transparent",border:"none",color:"#185FA5",cursor:"pointer",fontSize:13,padding:0,fontWeight:500}}>Baca selengkapnya →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Visi", text: data.profil.visi, bg:"#E8F0FB", tc:"#0A3670"},
              {label:"Misi", text: null, misi: Array.isArray(data.profil.misi) ? data.profil.misi : [data.profil.misi], bg:"#E1F5EE", tc:"#085041"},
              {label:"Nilai", text: data.profil.nilai || "Gotong royong, inovatif, inklusif, dan berorientasi dampak", bg:"#EEEDFE", tc:"#3C3489"},
              {label:"Lokasi", text: data.profil.lokasi || "RW 02 Kalisari, Kecamatan Pasar Rebo, Jakarta Timur", bg:"#FAEEDA", tc:"#633806"},
            ].map(c=>(
              <div key={c.label} style={{background:c.bg,borderRadius:10,padding:16}}>
                <div style={{fontSize:11,fontWeight:500,color:c.tc,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>{c.label}</div>
                {c.misi
                  ? <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {c.misi.map((m,i)=>(
                        <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                          <span style={{fontSize:9,color:c.tc,marginTop:3,flexShrink:0}}>▸</span>
                          <span style={{fontSize:10,color:c.tc,lineHeight:1.5,opacity:0.9}}>{m}</span>
                        </div>
                      ))}
                    </div>
                  : <div style={{fontSize:12,color:c.tc,lineHeight:1.6,opacity:0.9}}>{c.text}</div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BIDANG KEGIATAN ── */}
      <div style={{background:"#F7F6F1",padding:"40px 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Bidang kerja</div>
            <h2 style={{fontSize:20,fontWeight:500,margin:0,color:"#1a1a18"}}>Apa yang kami lakukan</h2>
            <p style={{fontSize:13,color:"#888780",marginTop:6}}>Enam bidang utama yang menjadi fokus gerakan Karang Taruna RW 02</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
            {bidang.map(b=>(
              <div key={b.label} style={{background:"#fff",borderRadius:12,padding:18,border:"0.5px solid #e8e8e5"}}>
                <div style={{width:38,height:38,borderRadius:10,background:b.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:12}}>{b.icon}</div>
                <div style={{fontWeight:500,fontSize:13,color:"#1a1a18",marginBottom:5}}>{b.label}</div>
                <div style={{fontSize:12,color:"#888780",lineHeight:1.6}}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERJALANAN 5 TAHUN ── */}
      <div style={{padding:"48px 0 48px"}}>
        <div style={{textAlign:"center",marginBottom:32,padding:"0 20px"}}>
          <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Perjalanan kami</div>
          <h2 style={{fontSize:20,fontWeight:500,margin:0,color:"#1a1a18"}}>5 tahun penuh dedikasi</h2>
        </div>
        {/* Horizontal scrollable timeline */}
        <div style={{overflowX:"auto",paddingBottom:8,display:"flex",justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"flex-end",padding:"0 40px",position:"relative"}}>
            {/* Single horizontal line behind all dots */}
            <div style={{position:"absolute",bottom:20,left:40,right:40,height:1.5,background:"#d4d4d0",zIndex:0}} />
            {timeline.map((t)=>(
              <div key={t.tahun} style={{display:"flex",flexDirection:"column",alignItems:"center",width:190,flexShrink:0,zIndex:1}}>
                {/* Card */}
                <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"12px 14px",width:"100%",boxSizing:"border-box",minHeight:90}}>
                  <div style={{fontWeight:600,fontSize:13,color:"#1a1a18",marginBottom:4}}>{t.label}</div>
                  <div style={{fontSize:11,color:"#5F5E5A",lineHeight:1.6}}>{t.desc}</div>
                </div>
                {/* Vertical line */}
                <div style={{width:1.5,height:24,background:"#d4d4d0"}} />
                {/* Dot */}
                <div style={{width:40,height:40,borderRadius:"50%",background:"#185FA5",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>
                  {t.tahun.slice(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KEGIATAN TERBARU ── */}
      <div style={{background:"#F7F6F1",padding:"40px 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Program terkini</div>
              <h2 style={{margin:0,fontSize:20,fontWeight:500,color:"#1a1a18"}}>Kegiatan terbaru</h2>
            </div>
            <button onClick={()=>setPage("Kegiatan")} style={{background:"transparent",border:"none",color:"#185FA5",cursor:"pointer",fontSize:13,fontWeight:500}}>Lihat semua →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {recent.map((k,i)=>(
              <div key={k.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,overflow:"hidden",display:"flex",flexDirection:i===0?"column":"column"}}>
                <img src={k.foto} alt={k.judul} style={{width:"100%",height:160,objectFit:"cover",display:"block"}} />
                <div style={{padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <Badge kat={k.kategori} />
                    <span style={{fontSize:11,color:"#888780"}}>{k.tanggal}</span>
                  </div>
                  <div style={{fontWeight:500,fontSize:14,marginBottom:5,color:"#1a1a18"}}>{k.judul}</div>
                  <p style={{fontSize:12,color:"#5F5E5A",margin:"0 0 10px",lineHeight:1.5}}>{k.deskripsi}</p>
                  {k.link && <a href={k.link} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#185FA5",textDecoration:"none"}}>Lihat dokumentasi →</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PENGHARGAAN HIGHLIGHT ── */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Prestasi</div>
            <h2 style={{margin:0,fontSize:isMobile?16:20,fontWeight:500,color:"#1a1a18"}}>Penghargaan yang kami raih</h2>
          </div>
          <button onClick={()=>setPage("Penghargaan")} style={{background:"transparent",border:"none",color:"#185FA5",cursor:"pointer",fontSize:13,fontWeight:500}}>Lihat semua →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
          {data.penghargaan.map(p=>(
            <div key={p.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:10,background:"#FAEEDA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏆</div>
              <div>
                <div style={{fontWeight:500,fontSize:13,color:"#1a1a18",marginBottom:4,lineHeight:1.4}}>{p.judul}</div>
                <div style={{fontSize:12,color:"#888780",marginBottom:6}}>{p.penyelenggara} · {p.tahun}</div>
                <TingkatBadge t={p.tingkat} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── KOLABORASI ── */}
      {data.kolaborasi?.length > 0 && (
        <div style={{padding:"48px 20px",background:"#fff"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Bersama lebih kuat</div>
              <h2 style={{fontSize:20,fontWeight:500,margin:"0 0 6px",color:"#1a1a18"}}>Kolaborasi Kami</h2>
              <p style={{fontSize:13,color:"#888780",margin:0}}>Mitra dan lembaga yang berjalan bersama Karang Taruna RW 02</p>
            </div>
            {/* Aktif */}
            {data.kolaborasi.some(k=>k.status==="aktif") && (
              <div style={{marginBottom:32}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <span style={{background:"#E1F5EE",color:"#0F6E56",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,letterSpacing:0.5}}>● Kolaborasi Aktif</span>
                  <div style={{flex:1,height:1,background:"#e2e2e0"}} />
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                  {data.kolaborasi.filter(k=>k.status==="aktif").map(k=>(
                    <div key={k.id} style={{background:"#fff",border:"1.5px solid #0F6E56",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,minWidth:180}}>
                      {k.logo
                        ? <img src={k.logo} alt={k.nama} style={{width:40,height:40,objectFit:"contain",borderRadius:6,flexShrink:0}} />
                        : <div style={{width:40,height:40,borderRadius:6,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤝</div>
                      }
                      <div style={{fontSize:13,fontWeight:500,color:"#1a1a18",lineHeight:1.4}}>{k.nama}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Selesai */}
            {data.kolaborasi.some(k=>k.status==="selesai") && (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <span style={{background:"#F1EFE8",color:"#888780",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,letterSpacing:0.5}}>● Kolaborasi Selesai</span>
                  <div style={{flex:1,height:1,background:"#e2e2e0"}} />
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                  {data.kolaborasi.filter(k=>k.status==="selesai").map(k=>(
                    <div key={k.id} style={{background:"#F7F6F1",border:"0.5px solid #e2e2e0",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,minWidth:180,opacity:0.75}}>
                      {k.logo
                        ? <img src={k.logo} alt={k.nama} style={{width:40,height:40,objectFit:"contain",borderRadius:6,flexShrink:0,filter:"grayscale(1)"}} />
                        : <div style={{width:40,height:40,borderRadius:6,background:"#e2e2e0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤝</div>
                      }
                      <div style={{fontSize:13,fontWeight:500,color:"#888780",lineHeight:1.4}}>{k.nama}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── USAHA EKONOMI PRODUKTIF ── */}
      {data.usahaEkonomi?.length > 0 && (
        <div style={{padding:"48px 20px",background:"#F7F6F1"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:11,color:"#C8922A",fontWeight:600,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>Mandiri & Produktif</div>
              <h2 style={{fontSize:20,fontWeight:500,margin:"0 0 6px",color:"#1a1a18"}}>Usaha Ekonomi Produktif</h2>
              <p style={{fontSize:13,color:"#888780",margin:0}}>Produk dan layanan dari Karang Taruna RW 02 untuk mendukung kemandirian organisasi</p>
            </div>
            {/* Sewa */}
            {data.usahaEkonomi.some(u=>u.kategori==="sewa") && (
              <div style={{marginBottom:28}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{background:"#E8F0FB",color:"#185FA5",fontSize:11,fontWeight:600,padding:"3px 12px",borderRadius:20}}>🔑 Penyewaan</span>
                  <div style={{flex:1,height:1,background:"#e2e2e0"}} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                  {data.usahaEkonomi.filter(u=>u.kategori==="sewa").map(u=>(
                    <div key={u.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,overflow:"hidden",opacity:u.tersedia?1:0.6}}>
                      {u.foto
                        ? <img src={u.foto} alt={u.nama} style={{width:"100%",height:140,objectFit:"cover",display:"block"}} />
                        : <div style={{width:"100%",height:140,background:"#E8F0FB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>📻</div>
                      }
                      <div style={{padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                          <div style={{fontWeight:600,fontSize:14,color:"#1a1a18"}}>{u.nama}</div>
                          {!u.tersedia && <span style={{background:"#FAECE7",color:"#993C1D",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10,flexShrink:0}}>Tidak tersedia</span>}
                        </div>
                        {u.deskripsi && <p style={{fontSize:12,color:"#5F5E5A",margin:"0 0 10px",lineHeight:1.5}}>{u.deskripsi}</p>}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <span style={{fontSize:16,fontWeight:700,color:"#185FA5"}}>Rp {parseInt(u.harga||0).toLocaleString("id-ID")}</span>
                            <span style={{fontSize:11,color:"#888780"}}>/{u.satuan}</span>
                          </div>
                          {u.stok && <span style={{fontSize:11,color:"#888780"}}>Stok: {u.stok}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Jual */}
            {data.usahaEkonomi.some(u=>u.kategori==="jual") && (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{background:"#FBF3E2",color:"#C8922A",fontSize:11,fontWeight:600,padding:"3px 12px",borderRadius:20}}>🛍️ Penjualan</span>
                  <div style={{flex:1,height:1,background:"#e2e2e0"}} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                  {data.usahaEkonomi.filter(u=>u.kategori==="jual").map(u=>(
                    <div key={u.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,overflow:"hidden",opacity:u.tersedia?1:0.6}}>
                      {u.foto
                        ? <img src={u.foto} alt={u.nama} style={{width:"100%",height:140,objectFit:"cover",display:"block"}} />
                        : <div style={{width:"100%",height:140,background:"#FBF3E2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>🛍️</div>
                      }
                      <div style={{padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                          <div style={{fontWeight:600,fontSize:14,color:"#1a1a18"}}>{u.nama}</div>
                          {!u.tersedia && <span style={{background:"#FAECE7",color:"#993C1D",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10,flexShrink:0}}>Habis</span>}
                        </div>
                        {u.deskripsi && <p style={{fontSize:12,color:"#5F5E5A",margin:"0 0 10px",lineHeight:1.5}}>{u.deskripsi}</p>}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <span style={{fontSize:16,fontWeight:700,color:"#C8922A"}}>Rp {parseInt(u.harga||0).toLocaleString("id-ID")}</span>
                            <span style={{fontSize:11,color:"#888780"}}>/{u.satuan}</span>
                          </div>
                          {u.stok && <span style={{fontSize:11,color:"#888780"}}>Stok: {u.stok}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FUN FACTS ── */}
      {data.funfacts?.length > 0 && (
        <div style={{background:"#0D4A8A",padding:"36px 20px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:10,color:"#C8922A",fontWeight:600,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>Tahukah kamu?</div>
              <h2 style={{color:"#fff",fontWeight:500,fontSize:18,margin:0}}>Fun Fact Karang Taruna RW 02</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fit,minmax(150px,1fr))`,gap:10}}>
              {data.funfacts.map(f=>(
                <div key={f.id} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"18px 14px",textAlign:"center"}}>
                  <div style={{fontSize:24,marginBottom:6}}>{f.emoji}</div>
                  <div style={{fontSize:22,fontWeight:700,color:"#C8922A",lineHeight:1}}>{f.angka}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:6,lineHeight:1.4}}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SOSMED CTA ── */}
      <div style={{background:"#185FA5",padding:"40px 20px",textAlign:"center",color:"#fff"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontSize:11,opacity:0.7,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Ikuti perjalanan kami</div>
          <h2 style={{fontWeight:500,fontSize:20,margin:"0 0 8px"}}>Update kegiatan terkini</h2>
          <p style={{fontSize:13,opacity:0.8,margin:"0 0 24px"}}>Saksikan momen-momen berharga Karang Taruna RW 02 di Instagram dan YouTube kami.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://www.instagram.com/kartarr_02/" target="_blank" rel="noreferrer" style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:8,padding:"10px 20px",textDecoration:"none",fontSize:13,fontWeight:500}}>Instagram @kartarr_02</a>
            <a href="https://www.youtube.com/@karangtarunarw02kalisari70" target="_blank" rel="noreferrer" style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:8,padding:"10px 20px",textDecoration:"none",fontSize:13,fontWeight:500}}>YouTube Channel</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROFIL ────────────────────────────────────────────────────────────
function Profil({ data }) {
  const isMobile = useIsMobile();
  const stats = [
    {label:"Tahun Berdiri", val:data.profil.berdiri, icon:"📅"},
    {label:"Anggota Aktif", val:data.profil.anggota, icon:"👥"},
    {label:"Total Kegiatan", val:data.profil.kegiatan, icon:"🗂️"},
    {label:"Penghargaan", val:data.profil.penghargaan, icon:"🏆"},
  ];
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 20px"}}>

      {/* Header */}
      <div style={{marginBottom:32}}>
        <div style={{fontSize:11,color:"#185FA5",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Tentang kami</div>
        <h2 style={{fontWeight:500,margin:"0 0 6px",fontSize:26,color:"#1a1a18"}}>{data.profil.nama}</h2>
        <p style={{color:"#888780",fontSize:14,margin:0}}>{data.profil.tagline}</p>
      </div>

      {/* Stats bar */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:32}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:600,color:"#185FA5"}}>{s.val}</div>
            <div style={{fontSize:11,color:"#888780",marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Deskripsi + Visi Misi */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20,marginBottom:20}}>

        {/* Deskripsi */}
        <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24}}>
          <div style={{fontSize:11,fontWeight:500,color:"#C8922A",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Deskripsi</div>
          <p style={{fontSize:13,color:"#5F5E5A",lineHeight:1.9,margin:0}}>{data.profil.deskripsi}</p>
        </div>

        {/* Visi */}
        <div style={{background:"#E8F0FB",borderRadius:12,padding:24,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:11,fontWeight:500,color:"#185FA5",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Visi</div>
          <p style={{fontSize:14,color:"#0D4A8A",lineHeight:1.8,margin:0,fontStyle:"italic"}}>"{data.profil.visi}"</p>
        </div>
      </div>

      {/* Misi */}
      <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24,marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:500,color:"#C8922A",textTransform:"uppercase",letterSpacing:0.8,marginBottom:16}}>Misi</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
          {(Array.isArray(data.profil.misi) ? data.profil.misi : [data.profil.misi]).map((m,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#FAFAF8",borderRadius:8,padding:"12px 14px"}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:"#185FA5",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:13,color:"#5F5E5A",lineHeight:1.6}}>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nilai & Lokasi */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={{background:"#EEEDFE",borderRadius:12,padding:20}}>
          <div style={{fontSize:11,fontWeight:500,color:"#533AB7",textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Nilai organisasi</div>
          <p style={{fontSize:13,color:"#3C3489",lineHeight:1.7,margin:0}}>{data.profil.nilai || "Gotong royong, inovatif, inklusif, dan berorientasi dampak"}</p>
        </div>
        <div style={{background:"#FAEEDA",borderRadius:12,padding:20}}>
          <div style={{fontSize:11,fontWeight:500,color:"#854F0B",textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Lokasi</div>
          <p style={{fontSize:13,color:"#633806",lineHeight:1.7,margin:0}}>{data.profil.lokasi || "RW 02 Kalisari, Kecamatan Pasar Rebo, Jakarta Timur"}</p>
        </div>
      </div>

      {/* Filosofi Logo */}
      {data.profil.filosofiLogo?.length > 0 && (
        <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
            <img src="/logo-kartar.png" alt="Logo" style={{width:64,height:64,objectFit:"contain",flexShrink:0}} />
            <div>
              <div style={{fontSize:11,fontWeight:500,color:"#C8922A",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Filosofi Logo</div>
              <p style={{fontSize:13,color:"#5F5E5A",margin:0,lineHeight:1.6}}>Setiap elemen dalam logo Karang Taruna mengandung makna dan nilai yang mencerminkan jiwa serta semangat kepemudaan.</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
            {data.profil.filosofiLogo.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#FAFAF8",borderRadius:8,padding:"12px 14px"}}>
                <div style={{width:28,height:28,borderRadius:8,background:"#FBF3E2",border:"1px solid #C8922A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#C8922A",flexShrink:0}}>{i+1}</div>
                <div>
                  <div style={{fontWeight:500,fontSize:12,color:"#1a1a18",marginBottom:3}}>{f.elemen}</div>
                  <div style={{fontSize:12,color:"#5F5E5A",lineHeight:1.6}}>{f.makna}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KegiatanCard({ k, fotos }) {
  const [idx, setIdx] = useState(0);
  const prev = e => { e.stopPropagation(); setIdx(i => (i-1+fotos.length)%fotos.length); };
  const next = e => { e.stopPropagation(); setIdx(i => (i+1)%fotos.length); };
  return (
    <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,overflow:"hidden"}}>
      <div style={{position:"relative",height:180}}>
        {fotos.length > 0
          ? <img src={fotos[idx]} alt={k.judul} style={{width:"100%",height:180,objectFit:"cover",display:"block"}} />
          : <div style={{width:"100%",height:180,background:"#f0f0ee",display:"flex",alignItems:"center",justifyContent:"center",color:"#ccc",fontSize:13}}>Tidak ada foto</div>
        }
        {fotos.length > 1 && (
          <>
            <button onClick={prev} style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,lineHeight:"26px",padding:0}}>‹</button>
            <button onClick={next} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,lineHeight:"26px",padding:0}}>›</button>
            <span style={{position:"absolute",bottom:6,right:8,background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:10,padding:"2px 6px",borderRadius:10}}>{idx+1}/{fotos.length}</span>
          </>
        )}
      </div>
      <div style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><Badge kat={k.kategori} /><span style={{fontSize:11,color:"#888780"}}>{k.tanggal}</span></div>
        <div style={{fontWeight:500,fontSize:15,marginBottom:6,color:"#1a1a18"}}>{k.judul}</div>
        <p style={{fontSize:13,color:"#5F5E5A",margin:"0 0 10px",lineHeight:1.5}}>{k.deskripsi}</p>
        {k.link && <a href={k.link} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#185FA5",textDecoration:"none"}}>Lihat dokumentasi →</a>}
      </div>
    </div>
  );
}

// ── KEGIATAN ──────────────────────────────────────────────────────────
function Kegiatan({ data }) {
  const [filter, setFilter] = useState("Semua");
  const [tahun, setTahun] = useState("Semua");
  const tahunList = ["Semua", ...new Set(data.kegiatan.map(k => k.tanggal?.slice(0,4)).filter(Boolean).sort((a,b)=>b-a))];
  const filtered = data.kegiatan
    .filter(k => filter==="Semua" || k.kategori===filter)
    .filter(k => tahun==="Semua" || k.tanggal?.startsWith(tahun));
  const sorted = [...filtered].sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 20px"}}>
      <h2 style={{fontWeight:500,margin:"0 0 6px"}}>Arsip kegiatan</h2>
      <p style={{color:"#888780",marginBottom:24,fontSize:14}}>Dokumentasi program dan event yang telah kami laksanakan</p>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{background:filter===c?"#185FA5":"#fff",color:filter===c?"#fff":"#5F5E5A",border:"0.5px solid",borderColor:filter===c?"#185FA5":"#ddd",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13}}>{c}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {tahunList.map(t=>(
          <button key={t} onClick={()=>setTahun(t)} style={{background:tahun===t?"#C8922A":"#fff",color:tahun===t?"#fff":"#5F5E5A",border:"0.5px solid",borderColor:tahun===t?"#C8922A":"#ddd",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:12}}>{t}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {sorted.map(k=>{
          const fotos = k.fotos?.length ? k.fotos : (k.foto ? [k.foto] : []);
          return <KegiatanCard key={k.id} k={k} fotos={fotos} />;
        })}
      </div>
      {sorted.length===0 && <p style={{color:"#888780",textAlign:"center",marginTop:40}}>Tidak ada kegiatan di kategori ini.</p>}
    </div>
  );
}

// ── GALERI ────────────────────────────────────────────────────────────
function Galeri({ data }) {
  const [sel, setSel] = useState(null);
  const [tahun, setTahun] = useState("Semua");
  const tahunList = ["Semua", ...new Set(data.galeri.map(g => g.tahun).filter(Boolean).sort((a,b)=>b-a))];
  const filtered = tahun==="Semua" ? data.galeri : data.galeri.filter(g => g.tahun===tahun);
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 20px"}}>
      <h2 style={{fontWeight:500,margin:"0 0 6px"}}>Galeri foto</h2>
      <p style={{color:"#888780",marginBottom:24,fontSize:14}}>Momen-momen berharga dalam perjalanan 5 tahun kami</p>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {tahunList.map(t=>(
          <button key={t} onClick={()=>setTahun(t)} style={{background:tahun===t?"#C8922A":"#fff",color:tahun===t?"#fff":"#5F5E5A",border:"0.5px solid",borderColor:tahun===t?"#C8922A":"#ddd",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:12}}>{t}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {filtered.map(g=>(
          <div key={g.id} onClick={()=>setSel(g)} style={{borderRadius:10,overflow:"hidden",cursor:"pointer",aspectRatio:"1",position:"relative"}}>
            <img src={g.url} alt={g.caption} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.5))",padding:"8px",color:"#fff",fontSize:11}}>{g.caption}</div>
          </div>
        ))}
      </div>
      {sel && (
        <div onClick={()=>setSel(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,overflow:"hidden",maxWidth:600,width:"100%"}}>
            <img src={sel.url} alt={sel.caption} style={{width:"100%",display:"block"}} />
            <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,color:"#1a1a18"}}>{sel.caption}</span>
              <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:18,color:"#888780"}}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PENGURUS ──────────────────────────────────────────────────────────



function Pengurus({ data }) {
  const rawDivisiList = [...new Set(data.pengurus.map(p => p.divisi || "Umum"))];
  const divisiList = rawDivisiList.sort((a, b) => {
    const rank = d => {
      if (/ketua rw|rw 02|pembina/i.test(d)) return 0;
      if (/dewan|pertimbangan/i.test(d)) return 2;
      if (/umum/i.test(d)) return 2;
      return 1;
    };
    return rank(a) - rank(b);
  });
  const byDivisi = divisiList.map(d => ({
    divisi: d,
    anggota: data.pengurus.filter(p => (p.divisi || "Umum") === d),
  }));

  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"40px 20px"}}>
      <h2 style={{fontWeight:500,margin:"0 0 6px"}}>Struktur pengurus</h2>
      <p style={{color:"#888780",marginBottom:32,fontSize:14}}>Pengurus aktif periode 2023–2025</p>
      <div style={{marginBottom:40,borderRadius:12,overflow:"hidden",border:"0.5px solid #e2e2e0"}}>
        <img src="/struktur-organisasi.png" alt="Struktur Organisasi" style={{width:"100%",display:"block"}} />
      </div>
      {byDivisi.map(({ divisi, anggota }) => (
        <div key={divisi} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{height:1,width:16,background:"#C8922A"}} />
            <span style={{fontSize:12,fontWeight:600,color:"#C8922A",letterSpacing:0.8,textTransform:"uppercase"}}>{divisi}</span>
            <div style={{height:1,flex:1,background:"#e2e2e0"}} />
            <span style={{fontSize:11,color:"#888780"}}>{anggota.length} orang</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {anggota.map(p => (
              <div key={p.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:18,display:"flex",alignItems:"center",gap:14}}>
                <Avatar nama={p.nama} size={50} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:500,fontSize:14,color:"#1a1a18",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nama}</div>
                  {p.noAnggota && <span style={{display:"inline-block",fontSize:10,color:"#C8922A",background:"#FBF3E2",border:"0.5px solid #C8922A",borderRadius:4,padding:"1px 6px",marginTop:2}}>#{p.noAnggota}</span>}
                  <div style={{fontSize:12,color:"#185FA5",marginTop:2}}>{p.jabatan}</div>
                  {p.periode && <div style={{fontSize:11,color:"#888780",marginTop:1}}>{p.periode}</div>}
                  {p.asalRT && <div style={{fontSize:11,color:"#888780",marginTop:1}}>Asal RT: <span style={{color:"#1a1a18"}}>{p.asalRT}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PENGHARGAAN ───────────────────────────────────────────────────────
function Penghargaan({ data }) {
  const [filter, setFilter] = useState("Semua");
  const tingkats = ["Semua","Kelurahan","Kecamatan","Kota","Nasional"];
  const filtered = filter==="Semua" ? data.penghargaan : data.penghargaan.filter(p=>p.tingkat===filter);
  const sorted = [...filtered].sort((a,b)=>b.tahun.localeCompare(a.tahun));
  const total = data.penghargaan.length;
  const byTingkat = ["Kelurahan","Kecamatan","Kota","Nasional"].map(t=>({t, n:data.penghargaan.filter(p=>p.tingkat===t).length})).filter(x=>x.n>0);
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 20px"}}>
      <h2 style={{fontWeight:500,margin:"0 0 6px"}}>Penghargaan & Prestasi</h2>
      <p style={{color:"#888780",marginBottom:24,fontSize:14}}>Pengakuan atas dedikasi dan kerja keras Karang Taruna RW 02 Kalisari</p>
      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:28}}>
        <div style={{background:"#FAEEDA",borderRadius:10,padding:"16px",textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:500,color:"#854F0B"}}>{total}</div>
          <div style={{fontSize:12,color:"#854F0B",marginTop:2}}>Total Penghargaan</div>
        </div>
        {byTingkat.map(x=>(
          <div key={x.t} style={{background:tingkatBg[x.t]||"#F1EFE8",borderRadius:10,padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:500,color:tingkatColor[x.t]||"#5F5E5A"}}>{x.n}</div>
            <div style={{fontSize:12,color:tingkatColor[x.t]||"#5F5E5A",marginTop:2}}>Tingkat {x.t}</div>
          </div>
        ))}
      </div>
      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {tingkats.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{background:filter===t?"#185FA5":"#fff",color:filter===t?"#fff":"#5F5E5A",border:"0.5px solid",borderColor:filter===t?"#185FA5":"#ddd",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13}}>{t}</button>
        ))}
      </div>
      {/* List */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {sorted.map(p=>(
          <div key={p.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:22,display:"flex",gap:18,alignItems:"flex-start"}}>
            <div style={{width:56,height:56,borderRadius:12,background:"#FAEEDA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🏆</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:6}}>
                <div style={{fontWeight:500,fontSize:15,color:"#1a1a18",lineHeight:1.4,flex:1}}>{p.judul}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                  <TingkatBadge t={p.tingkat} />
                  <span style={{fontSize:12,color:"#888780",background:"#F1EFE8",padding:"3px 8px",borderRadius:6}}>{p.tahun}</span>
                </div>
              </div>
              <div style={{fontSize:13,color:"#185FA5",marginBottom:6,fontWeight:500}}>{p.penyelenggara}</div>
              <p style={{fontSize:13,color:"#5F5E5A",margin:0,lineHeight:1.6}}>{p.deskripsi}</p>
            </div>
          </div>
        ))}
      </div>
      {sorted.length===0 && <p style={{color:"#888780",textAlign:"center",marginTop:40}}>Tidak ada data penghargaan untuk filter ini.</p>}
    </div>
  );
}

// ── KONTAK ────────────────────────────────────────────────────────────
function Kontak({ isAdmin }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ nama: "", pesan: "", kategori: "Saran" });
  const [status, setStatus] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [konfirmHapus, setKonfirmHapus] = useState(null);

  useEffect(() => {
    const unsub = subscribeFeedback(setFeedbacks);
    return () => unsub();
  }, []);

  const kirim = async () => {
    if (!form.pesan.trim()) return;
    setStatus("Mengirim...");
    try {
      await kirimFeedback(form);
      setForm({ nama: "", pesan: "", kategori: "Saran" });
      setStatus("Terkirim! Terima kasih atas masukan Anda.");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Gagal mengirim. Coba lagi.");
    }
  };

  const hapus = async (id) => { await hapusFeedback(id); setKonfirmHapus(null); };
  const katColor = { Kritik: { bg:"#FAECE7", tc:"#993C1D", dot:"#E24B4A" }, Saran: { bg:"#E8F0FB", tc:"#0A3670", dot:"#185FA5" } };

  const formatWaktu = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" }) + " · " + d.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });
  };

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"40px 20px"}}>
      <h2 style={{fontWeight:500,margin:"0 0 6px"}}>Kontak & media sosial</h2>
      <p style={{color:"#888780",marginBottom:32,fontSize:14}}>Hubungi kami atau ikuti perkembangan terbaru</p>

      {/* Info kontak */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:20}}>
          <div style={{fontWeight:500,marginBottom:10,color:"#1a1a18"}}>Alamat</div>
          <p style={{fontSize:13,color:"#5F5E5A",lineHeight:1.7,margin:0}}>RW 02 Kalisari<br/>Kelurahan Kalisari, Kec. Pasar Rebo<br/>Jakarta Timur, DKI Jakarta</p>
        </div>
        <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:20}}>
          <div style={{fontWeight:500,marginBottom:10,color:"#1a1a18"}}>Media sosial</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <a href="https://www.instagram.com/kartarr_02/" target="_blank" rel="noreferrer" style={{fontSize:13,color:"#C13584",textDecoration:"none"}}>Instagram: @kartarr_02</a>
            <a href="https://www.youtube.com/@karangtarunarw02kalisari70" target="_blank" rel="noreferrer" style={{fontSize:13,color:"#FF0000",textDecoration:"none"}}>YouTube: Karang Taruna RW 02 Kalisari</a>
          </div>
        </div>
      </div>

      {/* Form kritik & saran */}
      <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24,marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:500,color:"#C8922A",textTransform:"uppercase",letterSpacing:0.8,marginBottom:16}}>Kritik & Saran</div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["Saran","Kritik"].map(k=>(
            <button key={k} onClick={()=>setForm({...form,kategori:k})}
              style={{padding:"6px 18px",borderRadius:20,border:"0.5px solid",fontSize:13,cursor:"pointer",
                background:form.kategori===k?(k==="Kritik"?"#FAECE7":"#E8F0FB"):"#fff",
                color:form.kategori===k?(k==="Kritik"?"#993C1D":"#0A3670"):"#5F5E5A",
                borderColor:form.kategori===k?(k==="Kritik"?"#E24B4A":"#185FA5"):"#ddd",
                fontWeight:form.kategori===k?500:400}}>
              {k}
            </button>
          ))}
        </div>
        <input
          placeholder="Nama (opsional)"
          value={form.nama}
          onChange={e=>setForm({...form,nama:e.target.value})}
          style={{width:"100%",boxSizing:"border-box",marginBottom:10,padding:"9px 12px",border:"0.5px solid #ddd",borderRadius:8,fontSize:13}}
        />
        <textarea
          placeholder="Tulis pesan Anda..."
          value={form.pesan}
          onChange={e=>setForm({...form,pesan:e.target.value})}
          rows={4}
          style={{width:"100%",boxSizing:"border-box",marginBottom:12,padding:"9px 12px",border:"0.5px solid #ddd",borderRadius:8,fontSize:13,resize:"vertical"}}
        />
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:12,color:status.startsWith("Gagal")?"#E24B4A":status?"#185FA5":"transparent"}}>{status||"."}</span>
          <button onClick={kirim} disabled={!form.pesan.trim()}
            style={{background:"#185FA5",color:"#fff",border:"none",padding:"9px 22px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500,opacity:form.pesan.trim()?1:0.5}}>
            Kirim
          </button>
        </div>
      </div>

      {/* Daftar feedback real-time */}
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:500,color:"#1a1a18"}}>Pesan masuk</div>
          <span style={{background:"#E8F0FB",color:"#185FA5",fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:10}}>{feedbacks.length}</span>
          <span style={{fontSize:11,color:"#888780",marginLeft:2}}>· diperbarui otomatis</span>
        </div>
        {feedbacks.length === 0 && (
          <p style={{fontSize:13,color:"#888780",textAlign:"center",padding:"32px 0"}}>Belum ada pesan. Jadilah yang pertama!</p>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {feedbacks.map(f=>{
            const c = katColor[f.kategori] || katColor.Saran;
            return (
              <div key={f.id} style={{background:"#fff",border:konfirmHapus===f.id?"1px solid #E24B4A":"0.5px solid #e2e2e0",borderRadius:12,padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:"#E8F0FB",color:"#185FA5",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:13,flexShrink:0}}>
                    {(f.nama||"A")[0].toUpperCase()}
                  </div>
                  <span style={{fontWeight:500,fontSize:13,color:"#1a1a18"}}>{f.nama||"Anonim"}</span>
                  <span style={{background:c.bg,color:c.tc,fontSize:10,fontWeight:500,padding:"2px 8px",borderRadius:10}}>{f.kategori}</span>
                  <span style={{fontSize:11,color:"#888780",marginLeft:"auto"}}>{formatWaktu(f.timestamp)}</span>
                  {isAdmin && konfirmHapus !== f.id && (
                    <button onClick={()=>setKonfirmHapus(f.id)} style={{background:"#FAECE7",color:"#993C1D",border:"none",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11,marginLeft:4}}>Hapus</button>
                  )}
                </div>
                <p style={{margin:0,fontSize:13,color:"#5F5E5A",lineHeight:1.7}}>{f.pesan}</p>
                {isAdmin && konfirmHapus===f.id && (
                  <div style={{marginTop:10,padding:"10px 12px",background:"#FAECE7",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,color:"#993C1D",fontWeight:500}}>Yakin hapus pesan ini?</span>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setKonfirmHapus(null)} style={{background:"#fff",color:"#5F5E5A",border:"0.5px solid #ddd",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Batal</button>
                      <button onClick={()=>hapus(f.id)} style={{background:"#E24B4A",color:"#fff",border:"none",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:500}}>Hapus</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  const nav = ["Beranda","Profil","Kegiatan","Galeri","Pengurus","Penghargaan","Kontak"];
  const isMobile = useIsMobile();
  return (
    <footer style={{background:"#1a1a18",color:"#ccc",marginTop:60}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"32px 20px 24px":"48px 24px 28px",display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr 1fr",gap:isMobile?24:40}}>

        {/* Kolom kiri — identitas */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <img src="/logo-kartar.png" alt="Logo" style={{width:40,height:40,objectFit:"contain"}} />
            <div>
              <div style={{fontWeight:500,fontSize:14,color:"#fff"}}>Karang Taruna Unit RW 02 Kalisari</div>
              <div style={{fontSize:11,color:"#888780",marginTop:1}}>HATI, AKSI, MANDIRI</div>
            </div>
          </div>
          <p style={{fontSize:13,lineHeight:1.8,color:"#888780",margin:"0 0 16px",maxWidth:300}}>
            Organisasi kepemudaan RW 02 Kalisari, Kec. Pasar Rebo, Jakarta Timur. Aktif sejak 2019 dalam bidang sosial, seni, olahraga, dan pendidikan.
          </p>
          <div style={{display:"flex",gap:10}}>
            <a href="https://www.instagram.com/kartarr_02/" target="_blank" rel="noreferrer"
              style={{background:"#2a2a28",color:"#ccc",padding:"7px 14px",borderRadius:8,textDecoration:"none",fontSize:12}}>
              Instagram
            </a>
            <a href="https://www.youtube.com/@karangtarunarw02kalisari70" target="_blank" rel="noreferrer"
              style={{background:"#2a2a28",color:"#ccc",padding:"7px 14px",borderRadius:8,textDecoration:"none",fontSize:12}}>
              YouTube
            </a>
          </div>
        </div>

        {/* Kolom tengah — navigasi */}
        <div>
          <div style={{fontSize:12,fontWeight:500,color:"#fff",marginBottom:14,letterSpacing:0.5}}>Navigasi</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {nav.map(n => (
              <button key={n} onClick={()=>setPage(n)}
                style={{background:"none",border:"none",color:"#888780",cursor:"pointer",fontSize:13,textAlign:"left",padding:0}}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Kolom kanan — kontak */}
        <div>
          <div style={{fontSize:12,fontWeight:500,color:"#fff",marginBottom:14,letterSpacing:0.5}}>Alamat</div>
          <p style={{fontSize:13,color:"#888780",lineHeight:1.8,margin:0}}>
            RW 02 Kalisari<br/>
            Kel. Kalisari, Kec. Pasar Rebo<br/>
            Jakarta Timur, DKI Jakarta
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{borderTop:"1px solid #C8922A",padding:"16px 24px",textAlign:"center"}}>
        <p style={{fontSize:12,color:"#555553",margin:0}}>
          © {new Date().getFullYear()} Karang Taruna RW 02 Kalisari · Hak cipta dilindungi
        </p>
      </div>
    </footer>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────
function Login({ onBack, onSuccess }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const handle = () => { if(pw===ADMIN_PASS){onSuccess();}else{setErr("Password salah. Coba lagi.");} };
  return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:16,padding:32,width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#185FA5",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:18,margin:"0 auto 12px"}}>KT</div>
          <div style={{fontWeight:500,fontSize:16}}>Login Admin</div>
          <div style={{fontSize:13,color:"#888780",marginTop:4}}>Masukkan password untuk akses panel admin</div>
        </div>
        <input type="password" placeholder="Password admin" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()} style={{width:"100%",marginBottom:8,boxSizing:"border-box"}} />
        {err && <div style={{fontSize:12,color:"#E24B4A",marginBottom:8}}>{err}</div>}
        <button onClick={handle} style={{width:"100%",background:"#185FA5",color:"#fff",border:"none",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:500,marginBottom:8}}>Masuk</button>
        <button onClick={onBack} style={{width:"100%",background:"transparent",border:"none",color:"#888780",cursor:"pointer",fontSize:13}}>Kembali ke website</button>
      </div>
    </div>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────
function Field({ label, val, onChange, type="text", textarea=false }) {
  return (
    <div style={{marginBottom:12}}>
      <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:4}}>{label}</label>
      {textarea
        ? <textarea value={val} onChange={e=>onChange(e.target.value)} rows={3} style={{width:"100%",boxSizing:"border-box",resize:"vertical"}} />
        : <input type={type} value={val} onChange={e=>onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box"}} />
      }
    </div>
  );
}

function FotoField({ label="Foto", val, onChange, folder="kegiatan" }) {
  const [loading, setLoading] = useState(false);
  const handleFile = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFoto(file, folder);
      onChange(url);
    } catch (err) {
      alert("Upload gagal: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };
  return (
    <div style={{marginBottom:12}}>
      <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:4}}>{label}</label>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input value={val} onChange={e=>onChange(e.target.value)} placeholder="Paste URL atau upload file..."
          style={{flex:1,boxSizing:"border-box",padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:13}} />
        <label style={{
          display:"inline-flex",alignItems:"center",gap:5,cursor: loading ? "default":"pointer",
          background: loading ? "#aaa" : "#185FA5",color:"#fff",
          padding:"6px 12px",borderRadius:6,fontSize:12,whiteSpace:"nowrap",flexShrink:0
        }}>
          {loading ? "Mengupload…" : "📁 Upload"}
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} style={{display:"none"}} />
        </label>
      </div>
      {val && <img src={val} alt="" style={{marginTop:8,height:64,borderRadius:6,objectFit:"cover",border:"0.5px solid #e2e2e0"}} />}
    </div>
  );
}

function AdminPanel({ data, setData, onLogout }) {
  const [tab, setTab] = useState("profil");
  const [msg, setMsg] = useState("");
  const save = async (newData) => {
    setMsg("Menyimpan...");
    try {
      await setData(newData);
      setMsg("Tersimpan!");
    } catch (e) {
      setMsg("Gagal menyimpan: " + e.message);
    }
    setTimeout(() => setMsg(""), 3000);
  };
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><div style={{fontWeight:500,fontSize:18}}>Panel Admin</div><div style={{fontSize:13,color:"#888780"}}>Kelola konten website</div></div>
        <button onClick={onLogout} style={{background:"transparent",border:"0.5px solid #ddd",padding:"7px 16px",borderRadius:8,cursor:"pointer",fontSize:13,color:"#888780"}}>Keluar</button>
      </div>
      {msg && <div style={{background:msg.startsWith("Gagal")?"#FAECE7":"#E8F0FB",color:msg.startsWith("Gagal")?"#993C1D":"#0A3670",padding:"10px 16px",borderRadius:8,marginBottom:16,fontSize:13}}>{msg}</div>}
      <div style={{display:"flex",gap:6,marginBottom:24,borderBottom:"0.5px solid #e8e8e5",paddingBottom:12,flexWrap:"wrap"}}>
        {[["profil","Profil"],["kegiatan","Kegiatan"],["galeri","Galeri"],["pengurus","Pengurus"],["penghargaan","Penghargaan"],["usaha","Usaha Ekonomi"],["kolaborasi","Kolaborasi"],["funfact","Fun Fact"],["feedback","Kritik & Saran"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?"#E8F0FB":"transparent",color:tab===k?"#0A3670":"#5F5E5A",border:"none",padding:"7px 16px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:tab===k?500:400}}>{l}</button>
        ))}
      </div>
      {tab==="profil" && <AdminProfil data={data} save={save} />}
      {tab==="kegiatan" && <AdminKegiatan data={data} save={save} />}
      {tab==="galeri" && <AdminGaleri data={data} save={save} />}
      {tab==="pengurus" && <AdminPengurus data={data} save={save} />}
      {tab==="penghargaan" && <AdminPenghargaan data={data} save={save} />}
      {tab==="usaha" && <AdminUsahaEkonomi data={data} save={save} />}
      {tab==="kolaborasi" && <AdminKolaborasi data={data} save={save} />}
      {tab==="funfact" && <AdminFunFact data={data} save={save} />}
      {tab==="feedback" && <AdminFeedback />}
    </div>
  );
}

function AdminProfil({ data, save }) {
  const [p, setP] = useState({...data.profil, misi: Array.isArray(data.profil.misi) ? data.profil.misi.join("\n") : (data.profil.misi || "")});
  const [filosofi, setFilosofi] = useState(data.profil.filosofiLogo || []);
  const upd = k => v => setP({...p,[k]:v});
  const updFilosofi = (i, k, v) => { const nl = filosofi.map((f,j)=>j===i?{...f,[k]:v}:f); setFilosofi(nl); };
  const addFilosofi = () => setFilosofi([...filosofi, { elemen:"", makna:"" }]);
  const delFilosofi = (i) => setFilosofi(filosofi.filter((_,j)=>j!==i));
  const handleSave = () => {
    const profil = {...p, misi: p.misi.split("\n").map(m=>m.trim()).filter(Boolean), filosofiLogo: filosofi.filter(f=>f.elemen||f.makna)};
    save({...data, profil});
  };
  return (
    <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24}}>
      <Field label="Nama organisasi" val={p.nama} onChange={upd("nama")} />
      <Field label="Tagline" val={p.tagline} onChange={upd("tagline")} />
      <Field label="Deskripsi" val={p.deskripsi} onChange={upd("deskripsi")} textarea />
      <Field label="Visi" val={p.visi} onChange={upd("visi")} textarea />
      <Field label="Misi (satu per baris)" val={p.misi} onChange={upd("misi")} textarea />
      <Field label="Nilai organisasi" val={p.nilai||""} onChange={upd("nilai")} />
      <Field label="Lokasi" val={p.lokasi||""} onChange={upd("lokasi")} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Tahun berdiri" val={p.berdiri} onChange={upd("berdiri")} />
        <Field label="Jumlah anggota" val={p.anggota} onChange={upd("anggota")} />
        <Field label="Total kegiatan" val={p.kegiatan} onChange={upd("kegiatan")} />
        <Field label="Penghargaan" val={p.penghargaan} onChange={upd("penghargaan")} />
      </div>

      {/* Filosofi Logo */}
      <div style={{borderTop:"0.5px solid #e8e8e5",paddingTop:16,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <label style={{fontSize:12,color:"#888780",fontWeight:500}}>Filosofi Logo</label>
          <button onClick={addFilosofi} style={{background:"#FBF3E2",color:"#C8922A",border:"0.5px solid #C8922A",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>+ Tambah</button>
        </div>
        {filosofi.map((f,i)=>(
          <div key={i} style={{background:"#FAFAF8",borderRadius:8,padding:12,marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
              <input placeholder="Elemen (contoh: Segi Tujuh)" value={f.elemen} onChange={e=>updFilosofi(i,"elemen",e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"6px 10px",border:"0.5px solid #ddd",borderRadius:6,fontSize:12}} />
              <textarea placeholder="Makna / penjelasan" value={f.makna} onChange={e=>updFilosofi(i,"makna",e.target.value)} rows={2} style={{width:"100%",boxSizing:"border-box",padding:"6px 10px",border:"0.5px solid #ddd",borderRadius:6,fontSize:12,resize:"vertical"}} />
            </div>
            <button onClick={()=>delFilosofi(i)} style={{background:"#FAECE7",color:"#993C1D",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} style={{background:"#185FA5",color:"#fff",border:"none",padding:"10px 24px",borderRadius:8,cursor:"pointer",fontWeight:500}}>Simpan profil</button>
    </div>
  );
}

function AdminKegiatan({ data, save }) {
  const emptyForm = {judul:"",kategori:"Sosial",tanggal:"",deskripsi:"",fotos:[],link:""};
  const [list, setList] = useState(data.kegiatan);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const upd = k => v => setForm(f => ({...f,[k]:v}));

  const openNew = () => { setEdit("new"); setForm(emptyForm); };
  const openEdit = k => {
    setEdit(k.id);
    // normalise: support legacy single foto field
    setForm({...k, fotos: k.fotos?.length ? k.fotos : (k.foto ? [k.foto] : [])});
  };

  const saveItem = () => {
    const item = {...form, foto: form.fotos[0]||""};
    const nl = edit==="new" ? [...list,{...item,id:Date.now()}] : list.map(k=>k.id===edit?{...item,id:edit}:k);
    setList(nl); save({...data,kegiatan:nl}); setEdit(null);
  };
  const del = id => { const nl=list.filter(k=>k.id!==id); setList(nl); save({...data,kegiatan:nl}); };

  const handleUploadMulti = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadFoto(f, "kegiatan")));
      setForm(f => ({...f, fotos:[...f.fotos, ...urls]}));
    } catch(err) { alert("Upload gagal: "+err.message); }
    finally { setUploading(false); e.target.value=""; }
  };

  const removeFoto = idx => setForm(f => ({...f, fotos:f.fotos.filter((_,i)=>i!==idx)}));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontSize:14,color:"#888780"}}>{list.length} kegiatan</span>
        <button onClick={openNew} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>
      {edit && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:14}}>
          <div style={{fontWeight:500,marginBottom:14,fontSize:14}}>{edit==="new"?"Tambah kegiatan":"Edit kegiatan"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Judul" val={form.judul} onChange={upd("judul")} />
            <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888780",display:"block",marginBottom:4}}>Kategori</label><select value={form.kategori} onChange={e=>upd("kategori")(e.target.value)} style={{width:"100%",boxSizing:"border-box"}}>{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select></div>
            <Field label="Tanggal" val={form.tanggal} onChange={upd("tanggal")} type="date" />
            <Field label="Link dokumentasi" val={form.link} onChange={upd("link")} />
          </div>
          <Field label="Deskripsi" val={form.deskripsi} onChange={upd("deskripsi")} textarea />

          {/* Multi-foto upload */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Foto kegiatan ({form.fotos.length} foto)</label>
            {/* Grid preview */}
            {form.fotos.length > 0 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                {form.fotos.map((url,idx)=>(
                  <div key={idx} style={{position:"relative",flexShrink:0}}>
                    <img src={url} alt="" style={{width:80,height:60,objectFit:"cover",borderRadius:6,display:"block",border:"0.5px solid #ddd"}} />
                    {idx===0 && <span style={{position:"absolute",top:3,left:3,background:"#185FA5",color:"#fff",fontSize:9,padding:"1px 4px",borderRadius:3}}>Cover</span>}
                    <button onClick={()=>removeFoto(idx)} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:10,lineHeight:"16px",padding:0}}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <label style={{display:"inline-flex",alignItems:"center",gap:6,cursor:uploading?"default":"pointer",background:uploading?"#aaa":"#185FA5",color:"#fff",padding:"7px 14px",borderRadius:6,fontSize:12}}>
              {uploading ? "Mengupload…" : "📁 Upload foto (bisa pilih banyak)"}
              <input type="file" accept="image/*" multiple onChange={handleUploadMulti} disabled={uploading} style={{display:"none"}} />
            </label>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEdit(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...list].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).map(k=>(
          <div key={k.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            <img src={k.fotos?.[0]||k.foto||""} alt="" style={{width:52,height:38,objectFit:"cover",borderRadius:6}} />
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:13,color:"#1a1a18"}}>{k.judul}</div>
              <div style={{fontSize:12,color:"#888780",marginTop:2}}><Badge kat={k.kategori} /> · {k.tanggal} · {(k.fotos?.length||+(!!k.foto))} foto</div>
            </div>
            <button onClick={()=>openEdit(k)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
            <button onClick={()=>del(k.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGaleri({ data, save }) {
  const [list, setList] = useState(data.galeri);
  const [url, setUrl] = useState(""); const [cap, setCap] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const add = () => { if(!url) return; const nl=[...list,{id:Date.now(),url,caption:cap}]; setList(nl); save({...data,galeri:nl}); setUrl(""); setCap(""); };
  const del = id => { const nl=list.filter(g=>g.id!==id); setList(nl); save({...data,galeri:nl}); };

  const handleMultiUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const results = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Mengupload ${i+1}/${files.length}...`);
      try {
        const uploadedUrl = await uploadFoto(files[i], "galeri");
        results.push({ id: Date.now() + i, url: uploadedUrl, caption: files[i].name.replace(/\.[^.]+$/, ""), tahun: new Date().getFullYear().toString() });
      } catch(err) { /* skip failed */ }
    }
    const nl = [...list, ...results];
    setList(nl); save({...data, galeri:nl});
    setUploading(false); setProgress(""); e.target.value="";
  };

  return (
    <div>
      <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{fontWeight:500,marginBottom:12,fontSize:14}}>Tambah foto</div>

        {/* Multi upload */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Upload banyak foto sekaligus</label>
          <label style={{display:"inline-flex",alignItems:"center",gap:6,cursor:uploading?"default":"pointer",background:uploading?"#aaa":"#185FA5",color:"#fff",padding:"8px 18px",borderRadius:8,fontSize:13}}>
            {uploading ? progress : "📁 Pilih foto (bisa banyak)"}
            <input type="file" accept="image/*" multiple onChange={handleMultiUpload} disabled={uploading} style={{display:"none"}} />
          </label>
          {uploading && <div style={{fontSize:12,color:"#888780",marginTop:6}}>{progress}</div>}
        </div>

        <div style={{height:1,background:"#e2e2e0",margin:"14px 0"}} />
        <div style={{fontSize:12,color:"#888780",marginBottom:10}}>Atau tambah satu foto via URL:</div>
        <FotoField val={url} onChange={setUrl} folder="galeri" />
        <Field label="Keterangan" val={cap} onChange={setCap} />
        <button onClick={add} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Tambah</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
        {list.map(g=>(
          <div key={g.id} style={{borderRadius:10,overflow:"hidden",position:"relative",aspectRatio:"1"}}>
            <img src={g.url} alt={g.caption} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:7}}>
              <span style={{color:"#fff",fontSize:11}}>{g.caption}</span>
              <button onClick={()=>del(g.id)} style={{background:"#E24B4A",color:"#fff",border:"none",borderRadius:4,padding:"2px 6px",cursor:"pointer",fontSize:11}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPengurus({ data, save }) {
  const [list, setList] = useState(data.pengurus);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({nama:"",jabatan:"",periode:"2023–2025"});
  const upd = k => v => setForm({...form,[k]:v});
  const saveItem = () => {
    const nl = edit==="new" ? [...list,{...form,id:Date.now()}] : list.map(p=>p.id===edit?{...form,id:edit}:p);
    setList(nl); save({...data,pengurus:nl}); setEdit(null);
  };
  const del = id => { const nl=list.filter(p=>p.id!==id); setList(nl); save({...data,pengurus:nl}); };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontSize:14,color:"#888780"}}>{list.length} pengurus</span>
        <button onClick={()=>{setEdit("new");setForm({nama:"",jabatan:"",periode:"2023–2025"});}} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>
      {edit && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Nama" val={form.nama} onChange={upd("nama")} />
            <Field label="Jabatan" val={form.jabatan} onChange={upd("jabatan")} />
            <Field label="Periode" val={form.periode} onChange={upd("periode")} />
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEdit(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {list.map(p=>(
          <div key={p.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            <Avatar nama={p.nama} size={38} />
            <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13,color:"#1a1a18"}}>{p.nama}</div><div style={{fontSize:12,color:"#185FA5"}}>{p.jabatan} · {p.periode}</div></div>
            <button onClick={()=>{setEdit(p.id);setForm({...p});}} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
            <button onClick={()=>del(p.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsahaEkonomi({ data, save }) {
  const emptyForm = { nama:"", kategori:"sewa", harga:"", satuan:"hari", deskripsi:"", foto:"", stok:"", tersedia:true };
  const [list, setList] = useState(data.usahaEkonomi || []);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const upd = k => v => setForm(f => ({...f,[k]:v}));

  const openNew = () => { setEditId("new"); setForm(emptyForm); };
  const openEdit = item => { setEditId(item.id); setForm({...item}); };
  const saveItem = () => {
    const nl = editId==="new"
      ? [...list, {...form, id:Date.now()}]
      : list.map(u => u.id===editId ? {...form, id:editId} : u);
    setList(nl); save({...data, usahaEkonomi:nl}); setEditId(null);
  };
  const del = id => { const nl=list.filter(u=>u.id!==id); setList(nl); save({...data,usahaEkonomi:nl}); };

  const handleUpload = async e => {
    const file = e.target.files[0]; if(!file) return;
    setUploading(true);
    try { const url = await uploadFoto(file,"usaha"); setForm(f=>({...f,foto:url})); }
    catch(err) { alert("Upload gagal: "+err.message); }
    finally { setUploading(false); e.target.value=""; }
  };

  const sewa = list.filter(u=>u.kategori==="sewa");
  const jual = list.filter(u=>u.kategori==="jual");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:14,color:"#888780"}}>{sewa.length} sewa · {jual.length} produk jual</span>
        <button onClick={openNew} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>

      {editId && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{fontWeight:500,marginBottom:14,fontSize:14}}>{editId==="new"?"Tambah Item":"Edit Item"}</div>

          {/* Kategori */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Kategori</label>
            <div style={{display:"flex",gap:8}}>
              {[["sewa","🔑 Penyewaan"],["jual","🛍️ Penjualan"]].map(([val,lbl])=>(
                <button key={val} onClick={()=>{ upd("kategori")(val); upd("satuan")(val==="sewa"?"hari":"pcs"); }}
                  style={{padding:"6px 16px",borderRadius:20,border:`1.5px solid ${form.kategori===val?"#185FA5":"#ddd"}`,background:form.kategori===val?"#E8F0FB":"#fff",color:form.kategori===val?"#185FA5":"#888780",fontSize:12,cursor:"pointer",fontWeight:form.kategori===val?600:400}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Nama Produk / Barang" val={form.nama} onChange={upd("nama")} />
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
              <Field label="Harga (Rp)" val={form.harga} onChange={upd("harga")} type="number" />
              <Field label="Per" val={form.satuan} onChange={upd("satuan")} />
            </div>
            <Field label="Stok / Jumlah unit" val={form.stok} onChange={upd("stok")} />
            <div style={{marginBottom:12}}>
              <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Status</label>
              <div style={{display:"flex",gap:8}}>
                {[[true,"✅ Tersedia"],[false,"❌ Tidak tersedia"]].map(([val,lbl])=>(
                  <button key={String(val)} onClick={()=>upd("tersedia")(val)}
                    style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${form.tersedia===val?"#0F6E56":"#ddd"}`,background:form.tersedia===val?"#E1F5EE":"#fff",color:form.tersedia===val?"#0F6E56":"#888780",fontSize:11,cursor:"pointer"}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Field label="Deskripsi" val={form.deskripsi} onChange={upd("deskripsi")} textarea />

          {/* Foto */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Foto Produk</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input value={form.foto} onChange={e=>upd("foto")(e.target.value)} placeholder="Paste URL atau upload..."
                style={{flex:1,padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:13,boxSizing:"border-box"}} />
              <label style={{display:"inline-flex",alignItems:"center",gap:5,cursor:uploading?"default":"pointer",background:uploading?"#aaa":"#185FA5",color:"#fff",padding:"6px 12px",borderRadius:6,fontSize:12,whiteSpace:"nowrap",flexShrink:0}}>
                {uploading?"Mengupload…":"📁 Upload"}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{display:"none"}} />
              </label>
            </div>
            {form.foto && <img src={form.foto} alt="" style={{marginTop:8,height:72,objectFit:"cover",borderRadius:6,border:"0.5px solid #e2e2e0"}} />}
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEditId(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}

      {/* List per kategori */}
      {[["sewa","🔑 Penyewaan"],["jual","🛍️ Penjualan"]].map(([kat,label])=>{
        const items = list.filter(u=>u.kategori===kat);
        if(!items.length) return null;
        return (
          <div key={kat} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:kat==="sewa"?"#185FA5":"#C8922A",marginBottom:8}}>{label}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {items.map(u=>(
                <div key={u.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
                  {u.foto
                    ? <img src={u.foto} alt={u.nama} style={{width:52,height:40,objectFit:"cover",borderRadius:6,flexShrink:0}} />
                    : <div style={{width:52,height:40,borderRadius:6,background:"#F1EFE8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{kat==="sewa"?"🔑":"🛍️"}</div>
                  }
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500,fontSize:13,color:"#1a1a18"}}>{u.nama}</div>
                    <div style={{fontSize:12,color:"#185FA5",fontWeight:600}}>Rp {parseInt(u.harga||0).toLocaleString("id-ID")}<span style={{color:"#888780",fontWeight:400}}>/{u.satuan}</span></div>
                  </div>
                  {!u.tersedia && <span style={{background:"#FAECE7",color:"#993C1D",fontSize:10,padding:"2px 8px",borderRadius:10}}>Tidak tersedia</span>}
                  {u.stok && <span style={{fontSize:11,color:"#888780"}}>{u.stok}</span>}
                  <button onClick={()=>openEdit(u)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
                  <button onClick={()=>del(u.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminKolaborasi({ data, save }) {
  const emptyForm = { nama:"", logo:"", status:"aktif" };
  const [list, setList] = useState(data.kolaborasi || []);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const upd = k => v => setForm(f => ({...f,[k]:v}));

  const openNew = () => { setEditId("new"); setForm(emptyForm); };
  const openEdit = item => { setEditId(item.id); setForm({nama:item.nama,logo:item.logo||"",status:item.status}); };

  const saveItem = () => {
    const nl = editId==="new"
      ? [...list, {...form, id:Date.now()}]
      : list.map(k => k.id===editId ? {...form, id:editId} : k);
    setList(nl); save({...data, kolaborasi:nl}); setEditId(null);
  };
  const del = id => { const nl=list.filter(k=>k.id!==id); setList(nl); save({...data,kolaborasi:nl}); };

  const handleUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadFoto(file,"kolaborasi"); upd("logo")(url); setForm(f=>({...f,logo:url})); }
    catch(err) { alert("Upload gagal: "+err.message); }
    finally { setUploading(false); e.target.value=""; }
  };

  const aktif = list.filter(k=>k.status==="aktif");
  const selesai = list.filter(k=>k.status==="selesai");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:14,color:"#888780"}}>{aktif.length} aktif · {selesai.length} selesai</span>
        <button onClick={openNew} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>

      {editId && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{fontWeight:500,marginBottom:14,fontSize:14}}>{editId==="new"?"Tambah Kolaborasi":"Edit Kolaborasi"}</div>
          <Field label="Nama Mitra / Lembaga" val={form.nama} onChange={upd("nama")} />

          {/* Logo upload */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Logo</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input value={form.logo} onChange={e=>upd("logo")(e.target.value)} placeholder="Paste URL logo..."
                style={{flex:1,padding:"6px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:13,boxSizing:"border-box"}} />
              <label style={{display:"inline-flex",alignItems:"center",gap:5,cursor:uploading?"default":"pointer",background:uploading?"#aaa":"#185FA5",color:"#fff",padding:"6px 12px",borderRadius:6,fontSize:12,whiteSpace:"nowrap",flexShrink:0}}>
                {uploading?"Mengupload…":"📁 Upload"}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{display:"none"}} />
              </label>
            </div>
            {form.logo && <img src={form.logo} alt="" style={{marginTop:8,height:56,objectFit:"contain",borderRadius:6,border:"0.5px solid #e2e2e0",background:"#f7f6f1",padding:4}} />}
          </div>

          {/* Status */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Status</label>
            <div style={{display:"flex",gap:8}}>
              {["aktif","selesai"].map(s=>(
                <button key={s} onClick={()=>upd("status")(s)} style={{padding:"6px 16px",borderRadius:20,border:`1.5px solid ${form.status===s?"#0F6E56":"#ddd"}`,background:form.status===s?"#E1F5EE":"#fff",color:form.status===s?"#0F6E56":"#888780",fontSize:12,cursor:"pointer",fontWeight:form.status===s?600:400,textTransform:"capitalize"}}>
                  {s==="aktif"?"● Aktif":"● Selesai"}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEditId(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}

      {/* List */}
      {["aktif","selesai"].map(status => {
        const filtered = list.filter(k=>k.status===status);
        if (!filtered.length) return null;
        return (
          <div key={status} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:status==="aktif"?"#0F6E56":"#888780",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>
              {status==="aktif"?"● Kolaborasi Aktif":"● Kolaborasi Selesai"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(k=>(
                <div key={k.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
                  {k.logo
                    ? <img src={k.logo} alt={k.nama} style={{width:40,height:40,objectFit:"contain",borderRadius:6,border:"0.5px solid #e2e2e0",flexShrink:0}} />
                    : <div style={{width:40,height:40,borderRadius:6,background:"#F1EFE8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤝</div>
                  }
                  <div style={{flex:1,fontWeight:500,fontSize:13,color:"#1a1a18"}}>{k.nama}</div>
                  <button onClick={()=>openEdit(k)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
                  <button onClick={()=>del(k.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminFunFact({ data, save }) {
  const emptyForm = { emoji:"🎯", angka:"", label:"" };
  const [list, setList] = useState(data.funfacts || []);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const upd = k => v => setForm(f => ({...f,[k]:v}));

  const openNew = () => { setEditId("new"); setForm(emptyForm); };
  const openEdit = item => { setEditId(item.id); setForm({emoji:item.emoji,angka:item.angka,label:item.label}); };

  const saveItem = () => {
    const nl = editId==="new"
      ? [...list, {...form, id:Date.now()}]
      : list.map(f => f.id===editId ? {...form, id:editId} : f);
    setList(nl); save({...data, funfacts:nl}); setEditId(null);
  };

  const del = id => { const nl=list.filter(f=>f.id!==id); setList(nl); save({...data,funfacts:nl}); };

  const EMOJIS = ["🎉","👥","🏆","🌱","⚽","🎨","📚","💡","🤝","🏅","🎤","🌍"];

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:14,color:"#888780"}}>{list.length} fun fact</span>
        <button onClick={openNew} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>

      {editId && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{fontWeight:500,marginBottom:14,fontSize:14}}>{editId==="new"?"Tambah Fun Fact":"Edit Fun Fact"}</div>

          {/* Emoji picker */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888780",display:"block",marginBottom:6}}>Emoji</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>upd("emoji")(e)}
                  style={{fontSize:20,padding:"4px 8px",borderRadius:6,border:`1.5px solid ${form.emoji===e?"#185FA5":"#ddd"}`,background:form.emoji===e?"#E8F0FB":"#fff",cursor:"pointer"}}>
                  {e}
                </button>
              ))}
            </div>
            <input value={form.emoji} onChange={e=>upd("emoji")(e.target.value)} placeholder="atau ketik emoji lain..."
              style={{width:80,padding:"5px 8px",border:"1px solid #ddd",borderRadius:6,fontSize:16,textAlign:"center"}} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12}}>
            <Field label="Angka / Nilai" val={form.angka} onChange={upd("angka")} />
            <Field label="Keterangan" val={form.label} onChange={upd("label")} />
          </div>

          {/* Preview */}
          <div style={{background:"#0D4A8A",borderRadius:12,padding:"20px",textAlign:"center",marginBottom:14,maxWidth:200}}>
            <div style={{fontSize:28,marginBottom:6}}>{form.emoji}</div>
            <div style={{fontSize:24,fontWeight:700,color:"#C8922A"}}>{form.angka||"—"}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginTop:6}}>{form.label||"Keterangan"}</div>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEditId(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {list.map(f=>(
          <div key={f.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:28,flexShrink:0}}>{f.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:18,color:"#C8922A",lineHeight:1}}>{f.angka}</div>
              <div style={{fontSize:13,color:"#5F5E5A",marginTop:2}}>{f.label}</div>
            </div>
            <button onClick={()=>openEdit(f)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
            <button onClick={()=>del(f.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [konfirmHapus, setKonfirmHapus] = useState(null);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    const unsub = subscribeFeedback(setFeedbacks);
    return () => unsub();
  }, []);

  const hapus = async (id) => { await hapusFeedback(id); setKonfirmHapus(null); };

  const formatWaktu = (ts) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" }) + " · " + d.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });
  };

  const filtered = filter==="Semua" ? feedbacks : feedbacks.filter(f=>f.kategori===filter);
  const jmlKritik = feedbacks.filter(f=>f.kategori==="Kritik").length;
  const jmlSaran  = feedbacks.filter(f=>f.kategori==="Saran").length;

  return (
    <div style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:12,padding:24}}>
      {/* Header stats */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{background:"#E8F0FB",borderRadius:10,padding:"12px 20px",flex:1,minWidth:100}}>
          <div style={{fontSize:22,fontWeight:600,color:"#185FA5"}}>{feedbacks.length}</div>
          <div style={{fontSize:11,color:"#5F5E5A",marginTop:2}}>Total Pesan</div>
        </div>
        <div style={{background:"#E8F0FB",borderRadius:10,padding:"12px 20px",flex:1,minWidth:100}}>
          <div style={{fontSize:22,fontWeight:600,color:"#185FA5"}}>{jmlSaran}</div>
          <div style={{fontSize:11,color:"#5F5E5A",marginTop:2}}>Saran</div>
        </div>
        <div style={{background:"#FAECE7",borderRadius:10,padding:"12px 20px",flex:1,minWidth:100}}>
          <div style={{fontSize:22,fontWeight:600,color:"#993C1D"}}>{jmlKritik}</div>
          <div style={{fontSize:11,color:"#5F5E5A",marginTop:2}}>Kritik</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["Semua","Saran","Kritik"].map(k=>(
          <button key={k} onClick={()=>setFilter(k)}
            style={{padding:"5px 14px",borderRadius:20,border:"0.5px solid",fontSize:12,cursor:"pointer",
              background:filter===k?(k==="Kritik"?"#FAECE7":k==="Saran"?"#E8F0FB":"#1a1a18"):"#fff",
              color:filter===k?(k==="Kritik"?"#993C1D":k==="Saran"?"#0A3670":"#fff"):"#5F5E5A",
              borderColor:filter===k?(k==="Kritik"?"#E24B4A":k==="Saran"?"#185FA5":"#1a1a18"):"#ddd"}}>
            {k}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 && <p style={{color:"#888780",fontSize:13,textAlign:"center",padding:"24px 0"}}>Tidak ada pesan.</p>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(f=>(
          <div key={f.id} style={{border:konfirmHapus===f.id?"1px solid #E24B4A":"0.5px solid #e2e2e0",borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontWeight:500,fontSize:13,color:"#1a1a18"}}>{f.nama||"Anonim"}</span>
              <span style={{background:f.kategori==="Kritik"?"#FAECE7":"#E8F0FB",color:f.kategori==="Kritik"?"#993C1D":"#0A3670",fontSize:10,fontWeight:500,padding:"2px 8px",borderRadius:10}}>{f.kategori}</span>
              <span style={{fontSize:11,color:"#888780",marginLeft:"auto"}}>{formatWaktu(f.timestamp)}</span>
              {konfirmHapus!==f.id && (
                <button onClick={()=>setKonfirmHapus(f.id)} style={{background:"#FAECE7",color:"#993C1D",border:"none",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Hapus</button>
              )}
            </div>
            <p style={{margin:0,fontSize:13,color:"#5F5E5A",lineHeight:1.6}}>{f.pesan}</p>
            {konfirmHapus===f.id && (
              <div style={{marginTop:10,padding:"10px 12px",background:"#FAECE7",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,color:"#993C1D",fontWeight:500}}>Yakin hapus pesan ini?</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setKonfirmHapus(null)} style={{background:"#fff",color:"#5F5E5A",border:"0.5px solid #ddd",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Batal</button>
                  <button onClick={()=>hapus(f.id)} style={{background:"#E24B4A",color:"#fff",border:"none",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:500}}>Hapus</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPenghargaan({ data, save }) {
  const [list, setList] = useState(data.penghargaan);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({judul:"",penyelenggara:"",tahun:"2024",deskripsi:"",tingkat:"Kelurahan"});
  const upd = k => v => setForm({...form,[k]:v});
  const saveItem = () => {
    const nl = edit==="new" ? [...list,{...form,id:Date.now()}] : list.map(p=>p.id===edit?{...form,id:edit}:p);
    setList(nl); save({...data,penghargaan:nl}); setEdit(null);
  };
  const del = id => { const nl=list.filter(p=>p.id!==id); setList(nl); save({...data,penghargaan:nl}); };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontSize:14,color:"#888780"}}>{list.length} penghargaan</span>
        <button onClick={()=>{setEdit("new");setForm({judul:"",penyelenggara:"",tahun:"2024",deskripsi:"",tingkat:"Kelurahan"});}} style={{background:"#185FA5",color:"#fff",border:"none",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>+ Tambah</button>
      </div>
      {edit && (
        <div style={{background:"#F7F6F1",borderRadius:12,padding:18,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Judul penghargaan" val={form.judul} onChange={upd("judul")} />
            <Field label="Penyelenggara" val={form.penyelenggara} onChange={upd("penyelenggara")} />
            <Field label="Tahun" val={form.tahun} onChange={upd("tahun")} />
            <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888780",display:"block",marginBottom:4}}>Tingkat</label><select value={form.tingkat} onChange={e=>upd("tingkat")(e.target.value)} style={{width:"100%",boxSizing:"border-box"}}>{["Kelurahan","Kecamatan","Kota","Nasional"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <Field label="Deskripsi" val={form.deskripsi} onChange={upd("deskripsi")} textarea />
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{background:"#185FA5",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Simpan</button>
            <button onClick={()=>setEdit(null)} style={{background:"transparent",border:"0.5px solid #ddd",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Batal</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...list].sort((a,b)=>b.tahun.localeCompare(a.tahun)).map(p=>(
          <div key={p.id} style={{background:"#fff",border:"0.5px solid #e2e2e0",borderRadius:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:10,background:"#FAEEDA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏆</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:13,color:"#1a1a18",marginBottom:3}}>{p.judul}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}><TingkatBadge t={p.tingkat} /><span style={{fontSize:11,color:"#888780"}}>{p.penyelenggara} · {p.tahun}</span></div>
            </div>
            <button onClick={()=>{setEdit(p.id);setForm({...p});}} style={{background:"transparent",border:"0.5px solid #ddd",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Edit</button>
            <button onClick={()=>del(p.id)} style={{background:"transparent",border:"0.5px solid #F09595",color:"#E24B4A",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Beranda");
  const [mode, setMode] = useState("public");
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState(initData);

  useEffect(() => {
    (async () => {
      try {
        const [d, p] = await Promise.all([getData(), getPengurus()]);
        if (d) setData(prev => ({ ...prev, ...d, pengurus: p || d.pengurus || prev.pengurus }));
        else if (p) setData(prev => ({ ...prev, pengurus: p }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const saveData = async (nd) => {
    setData(nd);
    await fbSave(nd);
  };

  if(mode==="login") return <Login onBack={()=>setMode("public")} onSuccess={()=>{setIsAdmin(true);setMode("admin");}} />;
  if(mode==="admin") return <div><Navbar page={page} setPage={setPage} isAdmin={isAdmin} setMode={setMode} /><AdminPanel data={data} setData={saveData} onLogout={()=>{setIsAdmin(false);setMode("public");}} /></div>;

  return (
    <div style={{background:"#FAFAF8",minHeight:"100vh"}}>
      <Navbar page={page} setPage={p=>{setPage(p);setMode("public");}} isAdmin={isAdmin} setMode={setMode} />
      {page==="Beranda" && <Beranda data={data} setPage={setPage} />}
      {page==="Profil" && <Profil data={data} />}
      {page==="Kegiatan" && <Kegiatan data={data} />}
      {page==="Galeri" && <Galeri data={data} />}
      {page==="Pengurus" && <Pengurus data={data} />}
      {page==="Penghargaan" && <Penghargaan data={data} />}
      {page==="Kontak" && <Kontak isAdmin={isAdmin} />}
      <Footer setPage={setPage} />
    </div>
  );
}
