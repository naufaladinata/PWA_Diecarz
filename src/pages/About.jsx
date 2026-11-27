import { Github, Mail } from 'lucide-react';

const INFO = {
  author: 'Muhammad Naufal Adinata', nim: '21120124130065',
  github: 'https://github.com/naufaladinata/diecarz', email: '[naufal9495@gmail.com]',
};

export default function About() {
  return (
    <section className="page">
      <h2>Tentang DieCarz</h2>
      <p>DieCarz adalah katalog koleksi diecast: Hot Wheels, MINI GT, Tomica, Majorette, Matchbox, Inno64, dan lainnya. Simpan koleksi, tandai favorit, dan baca ulasan, bahkan saat offline.</p>
      <dl className="specs">
        <div><dt>Versi</dt><dd>1.0.0</dd></div>
        <div><dt>Pembuat</dt><dd>{INFO.author}</dd></div>
        <div><dt>NIM</dt><dd>{INFO.nim}</dd></div>
      </dl>
      <div className="row-end left">
        <a className="btn btn-ghost" href={INFO.github} target="_blank" rel="noreferrer"><Github size={16} aria-hidden="true" /> GitHub</a>
        <a className="btn btn-ghost" href={`mailto:${INFO.email}`}><Mail size={16} aria-hidden="true" /> Kontak</a>
      </div>
    </section>
  );
}
