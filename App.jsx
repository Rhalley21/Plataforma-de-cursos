import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Trash2, Pencil, Plus, X, Check, MessageCircle, Info, LayoutGrid, Play, CreditCard, Users, ShieldCheck } from "lucide-react";

const TIPOS = ["Aulas Gravadas", "Palestras", "Treinamentos", "Mentorias", "Projetos de Desenvolvimento Organizacional"];
const SETORES = ["Setor Público", "Setor Privado", "Ambos os setores"];
const TIPOS_ASSISTIVEIS = ["Aulas Gravadas"];

const PLANOS = [
  {
    id: "basico",
    nome: "Básico",
    mensal: 97,
    anual: 970,
    resumo: "Para quem está começando a aplicar os formatos no dia a dia.",
    recursos: ["Acesso às aulas gravadas", "Acesso às palestras", "2 acessos por contrato", "Suporte por e-mail"],
  },
  {
    id: "profissional",
    nome: "Profissional",
    mensal: 197,
    anual: 1970,
    destaque: true,
    resumo: "Para times que já contratam treinamentos e mentorias com frequência.",
    recursos: [
      "Tudo do plano Básico",
      "Acesso aos treinamentos",
      "Acesso às mentorias",
      "2 acessos por contrato",
      "Suporte prioritário",
    ],
  },
  {
    id: "empresarial",
    nome: "Empresarial",
    mensal: 397,
    anual: 3970,
    resumo: "Para organizações com múltiplas equipes e projetos contínuos.",
    recursos: [
      "Tudo do plano Profissional",
      "Acesso aos projetos de desenvolvimento organizacional",
      "Contratos adicionais (2 acessos cada)",
      "Gerente de conta dedicado",
    ],
  },
];

const GRADIENTES = {
  "Aulas Gravadas": "linear-gradient(135deg, #05101c, #0e3357)",
  "Palestras": "linear-gradient(135deg, #092646, #1a4a80)",
  "Treinamentos": "linear-gradient(135deg, #0a1f38, #CAA228)",
  "Mentorias": "linear-gradient(135deg, #05101c, #3a4b62)",
  "Projetos de Desenvolvimento Organizacional": "linear-gradient(135deg, #092646, #6b5620)",
};

const SEED = [
  {
    id: "a1",
    titulo: "Como dar feedback sem quebrar a relação",
    tipo: "Aulas Gravadas",
    setor: "Ambos os setores",
    duracao: "22 min",
    link: "",
    capa: "",
    descricao:
      "Aula gravada com um roteiro prático para preparar e conduzir conversas de feedback que geram mudança real.",
  },
  {
    id: "a2",
    titulo: "Os 3 erros mais comuns de quem lidera pela primeira vez",
    tipo: "Aulas Gravadas",
    setor: "Ambos os setores",
    duracao: "17 min",
    link: "",
    capa: "",
    descricao:
      "Aula gravada direto ao ponto sobre os erros que toda liderança de primeira viagem comete — e como evitar cada um deles.",
  },
  {
    id: "s1",
    titulo: "Liderança no Serviço Público",
    tipo: "Palestras",
    setor: "Setor Público",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao:
      "Como desenvolver líderes mais conscientes, responsáveis e preparados para conduzir pessoas e entregar resultados.",
  },
  {
    id: "s2",
    titulo: "Gestão de Pessoas no Setor Público",
    tipo: "Palestras",
    setor: "Setor Público",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao:
      "Pessoas, comportamento, comunicação e desenvolvimento como pilares para uma gestão pública mais eficiente.",
  },
  {
    id: "s3",
    titulo: "Excelência no Atendimento ao Público",
    tipo: "Palestras",
    setor: "Setor Público",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao:
      "Atendimento humanizado, comunicação, postura profissional e a responsabilidade de representar uma instituição pública diante do cidadão.",
  },
  {
    id: "s4",
    titulo: "Liderança que Transforma",
    tipo: "Palestras",
    setor: "Setor Privado",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao: "Liderar para além do cargo: influência, comportamento, responsabilidade e desenvolvimento de pessoas.",
  },
  {
    id: "s5",
    titulo: "Gestão de Pessoas",
    tipo: "Palestras",
    setor: "Setor Privado",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao: "Como transformar pessoas, processos e comportamento em resultados para a organização.",
  },
  {
    id: "s6",
    titulo: "Excelência no Atendimento ao Cliente",
    tipo: "Palestras",
    setor: "Setor Privado",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao: "Atendimento como cultura, percepção de valor e construção de experiências que fortalecem marcas.",
  },
  {
    id: "s7",
    titulo: "Cultura Organizacional",
    tipo: "Palestras",
    setor: "Setor Privado",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao: "Cultura não é o que está escrito na parede. É o que é permitido, repetido e reconhecido todos os dias.",
  },
  {
    id: "s8",
    titulo: "Neurociência Aplicada à Liderança",
    tipo: "Palestras",
    setor: "Setor Privado",
    duracao: "até 1h30",
    link: "",
    capa: "",
    descricao:
      "Produto premium. Como o cérebro influencia comportamento, tomada de decisão, motivação, comunicação e relações dentro das organizações.",
  },
  {
    id: "s9",
    titulo: "Treinamento de Liderança e Gestão de Pessoas",
    tipo: "Treinamentos",
    setor: "Setor Público",
    duracao: "4 horas",
    link: "",
    capa: "",
    descricao: "Conteúdo aprofundado, atividades práticas, estudos de caso e aplicação à realidade do órgão.",
  },
  {
    id: "s10",
    titulo: "Treinamento de Atendimento ao Público",
    tipo: "Treinamentos",
    setor: "Setor Público",
    duracao: "4 horas",
    link: "",
    capa: "",
    descricao:
      "Comunicação, comportamento, postura, resolução de conflitos, experiência do cidadão e excelência no serviço.",
  },
  {
    id: "s11",
    titulo: "Formação de Líderes",
    tipo: "Treinamentos",
    setor: "Setor Privado",
    duracao: "4h ou 8h",
    link: "",
    capa: "",
    descricao: "Liderança, comunicação, feedback, comportamento, gestão de conflitos e desenvolvimento de equipes.",
  },
  {
    id: "s12",
    titulo: "Treinamento de RH Estratégico",
    tipo: "Treinamentos",
    setor: "Setor Privado",
    duracao: "4h ou 8h",
    link: "",
    capa: "",
    descricao:
      "Estruturação de RH, desenho de cargos, recrutamento e seleção, onboarding, gestão de desempenho e cultura.",
  },
  {
    id: "s13",
    titulo: "Treinamento de Atendimento e Experiência do Cliente",
    tipo: "Treinamentos",
    setor: "Setor Privado",
    duracao: "4h ou 8h",
    link: "",
    capa: "",
    descricao: "Da postura individual à cultura de atendimento da organização.",
  },
  {
    id: "s14",
    titulo: "Treinamento de Cultura Organizacional",
    tipo: "Treinamentos",
    setor: "Setor Privado",
    duracao: "4h ou 8h",
    link: "",
    capa: "",
    descricao: "Construção, alinhamento e fortalecimento da cultura através da liderança e dos comportamentos organizacionais.",
  },
  {
    id: "s15",
    titulo: "Mentoria para Lideranças e Gestores",
    tipo: "Mentorias",
    setor: "Ambos os setores",
    duracao: "sob combinação",
    link: "",
    capa: "",
    descricao: "Acompanhamento próximo para lideranças e gestores em decisões estratégicas.",
  },
  {
    id: "s16",
    titulo: "Diagnóstico e Desenvolvimento Organizacional",
    tipo: "Projetos de Desenvolvimento Organizacional",
    setor: "Ambos os setores",
    duracao: "sob escopo",
    link: "",
    capa: "",
    descricao: "Diagnóstico, estruturação e fortalecimento de cultura, pessoas e processos.",
  },
];

const emptyForm = {
  titulo: "",
  tipo: TIPOS[0],
  setor: SETORES[0],
  duracao: "",
  link: "",
  capa: "",
  descricao: "",
};

function ehAssistivel(item) {
  return TIPOS_ASSISTIVEIS.includes(item.tipo);
}

function Capa({ item, children }) {
  const style = item.capa
    ? { backgroundImage: `url(${item.capa})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: GRADIENTES[item.tipo] || GRADIENTES["Palestras"] };
  return (
    <div className="capa" style={style}>
      {children}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("catalogo");
  const [itens, setItens] = useState(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const scrollRefs = useRef({});

  const [assinatura, setAssinatura] = useState(undefined); // undefined = carregando, null = sem assinatura
  const [ciclo, setCiclo] = useState("mensal");
  const [planoCheckout, setPlanoCheckout] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ empresa: "", acesso1: "", acesso2: "" });
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("inetris:assinatura", false);
        setAssinatura(res && res.value ? JSON.parse(res.value) : null);
      } catch (e) {
        setAssinatura(null);
      }
    })();
  }, []);

  async function persistAssinatura(dados) {
    setAssinatura(dados);
    try {
      await window.storage.set("inetris:assinatura", JSON.stringify(dados), false);
    } catch (e) {
      setErro("A assinatura foi salva nesta sessão, mas não foi possível gravar no armazenamento.");
    }
  }

  async function confirmarCheckout(e) {
    e.preventDefault();
    setConfirmando(true);
    const dados = {
      planoId: planoCheckout.id,
      planoNome: planoCheckout.nome,
      ciclo,
      empresa: checkoutForm.empresa,
      acessos: [checkoutForm.acesso1, checkoutForm.acesso2],
      ativoDesde: new Date().toISOString().slice(0, 10),
    };
    await persistAssinatura(dados);
    setConfirmando(false);
    setPlanoCheckout(null);
    setView("catalogo");
  }

  async function cancelarAssinatura() {
    await persistAssinatura(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("catalogo:formatos", true);
        if (res && res.value) {
          setItens(JSON.parse(res.value));
        } else {
          await window.storage.set("catalogo:formatos", JSON.stringify(SEED), true);
          setItens(SEED);
        }
      } catch (e) {
        setItens(SEED);
        setErro("Não foi possível carregar dados salvos. Mostrando o catálogo padrão.");
      }
    })();
  }, []);

  async function persist(novaLista) {
    setItens(novaLista);
    try {
      const res = await window.storage.set("catalogo:formatos", JSON.stringify(novaLista), true);
      if (!res) throw new Error("sem resposta");
    } catch (e) {
      setErro("O item foi salvo nesta sessão, mas não foi possível gravar no armazenamento.");
    }
  }

  function abrirNovo() {
    setForm(emptyForm);
    setEditandoId(null);
    setView("painel");
  }

  function abrirEdicao(item) {
    setForm({
      titulo: item.titulo,
      tipo: item.tipo,
      setor: item.setor,
      duracao: item.duracao,
      link: item.link,
      capa: item.capa || "",
      descricao: item.descricao,
    });
    setEditandoId(item.id);
    setView("painel");
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setSalvando(true);
    let novaLista;
    if (editandoId) {
      novaLista = itens.map((a) => (a.id === editandoId ? { ...a, ...form } : a));
    } else {
      novaLista = [{ id: `item-${Date.now()}`, ...form }, ...itens];
    }
    await persist(novaLista);
    setSalvando(false);
    setForm(emptyForm);
    setEditandoId(null);
  }

  async function excluir(id) {
    const novaLista = itens.filter((a) => a.id !== id);
    await persist(novaLista);
    if (editandoId === id) {
      setForm(emptyForm);
      setEditandoId(null);
    }
    if (selecionado && selecionado.id === id) setSelecionado(null);
  }

  const resultadosBusca = useMemo(() => {
    if (!itens || !busca.trim()) return null;
    const alvo = busca.toLowerCase();
    return itens.filter((a) =>
      `${a.titulo} ${a.tipo} ${a.setor} ${a.descricao}`.toLowerCase().includes(alvo)
    );
  }, [itens, busca]);

  const porTipo = useMemo(() => {
    if (!itens) return [];
    return TIPOS.map((t) => ({
      tipo: t,
      itens: itens.filter((a) => a.tipo === t),
    })).filter((g) => g.itens.length > 0);
  }, [itens]);

  const destaque = itens && itens.length > 0 ? itens[0] : null;

  function scrollRow(tipo, dir) {
    const el = scrollRefs.current[tipo];
    if (el) el.scrollBy({ left: dir * 480, behavior: "smooth" });
  }

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --bg: #05101c;
          --bg2: #092646;
          --bg3: #0e3357;
          --gold: #CAA228;
          --gold-dark: #A9871F;
          --text: #F5F5F1;
          --muted: rgba(245,245,241,0.62);
          --line: rgba(245,245,241,0.1);
        }

        * { box-sizing: border-box; }

        .app { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; width: 100%; }
        .brand-font { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }

        .nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 40px;
          background: linear-gradient(180deg, rgba(11,11,11,0.95), rgba(11,11,11,0.6) 70%, transparent);
        }

        .navleft { display: flex; align-items: center; gap: 28px; }
        .brand { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--gold); letter-spacing: 0.03em; }
        .navlinks { display: flex; gap: 20px; }
        .navlinks button { background: none; border: none; color: var(--muted); font-size: 14px; font-weight: 500; cursor: pointer; padding: 4px 0; }
        .navlinks button.active { color: var(--text); font-weight: 700; }
        .navright { display: flex; align-items: center; gap: 16px; }

        .searchbox { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); border: 1px solid rgba(245,245,241,0.35); border-radius: 4px; padding: 6px 10px; }
        .searchbox input { background: none; border: none; outline: none; color: var(--text); font-size: 13.5px; width: 180px; }
        .searchicon { background: none; border: none; color: var(--text); cursor: pointer; display: flex; }

        .painelbtn { display: flex; align-items: center; gap: 6px; background: var(--gold); color: #05101c; border: none; border-radius: 4px; padding: 8px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; }

        .hero { position: relative; height: 60vh; min-height: 380px; display: flex; align-items: flex-end; padding: 0 40px 56px; margin-top: -76px; }
        .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, var(--bg) 2%, rgba(11,11,11,0.15) 55%, rgba(11,11,11,0.55) 100%); z-index: 1; }
        .hero-content { position: relative; z-index: 2; max-width: 560px; }
        .hero-tag { font-size: 12.5px; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .hero h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(34px, 5.4vw, 54px); line-height: 1.04; margin: 0 0 14px; }
        .hero p { font-size: 15.5px; line-height: 1.55; color: rgba(245,245,241,0.85); margin: 0 0 20px; max-width: 48ch; }
        .hero-meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; font-size: 13px; color: var(--muted); margin-bottom: 18px; }
        .hero-meta .preco { color: #fff; font-weight: 700; }
        .hero-actions { display: flex; gap: 12px; }

        .btn-hero { display: flex; align-items: center; gap: 8px; border: none; border-radius: 4px; padding: 11px 22px; font-size: 14.5px; font-weight: 700; cursor: pointer; text-decoration: none; }
        .btn-hero.primary { background: #fff; color: #000; }
        .btn-hero.secondary { background: rgba(109,109,110,0.5); color: #fff; }
        .btn-hero:disabled { opacity: 0.5; cursor: default; }

        .rows { padding: 0 40px 60px; margin-top: 8px; }
        .row-block { margin-bottom: 40px; position: relative; }
        .row-title { font-size: 18px; font-weight: 700; margin: 0 0 12px; }
        .row-track-wrap { position: relative; }
        .row-track { display: flex; gap: 8px; overflow-x: auto; scroll-behavior: smooth; padding: 4px 2px 14px; scrollbar-width: none; }
        .row-track::-webkit-scrollbar { display: none; }

        .rowarrow { position: absolute; top: 0; bottom: 14px; width: 44px; background: rgba(11,11,11,0.55); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; font-size: 20px; opacity: 0; transition: opacity 0.15s; }
        .row-block:hover .rowarrow { opacity: 1; }
        .rowarrow.left { left: 0; }
        .rowarrow.right { right: 0; }

        .card { flex: 0 0 240px; height: 140px; border-radius: 4px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.2s ease; border: 1px solid rgba(245,245,241,0.06); }
        .card:hover { transform: scale(1.07); z-index: 3; box-shadow: 0 12px 30px rgba(0,0,0,0.6); }

        .capa { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px 12px; }
        .capa::before { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.8), transparent 65%); }
        .capa .card-title { position: relative; font-size: 13.5px; font-weight: 700; line-height: 1.25; margin-bottom: 3px; }
        .capa .card-meta { position: relative; font-size: 11px; color: rgba(245,245,241,0.8); }
        .capa .card-preco { position: relative; font-size: 11.5px; font-weight: 700; color: #fff; margin-top: 2px; }

        .vazio { padding: 60px 0; text-align: center; opacity: 0.55; font-size: 15px; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; overflow-y: auto; }
        .modal { background: var(--bg3); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; border-radius: 8px; }
        .modal-capa { height: 200px; position: relative; }
        .modal-close { position: absolute; top: 14px; right: 14px; background: rgba(20,20,20,0.8); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .modal-body { padding: 24px 28px 30px; }
        .modal-body h2 { font-size: 22px; margin: 0 0 10px; }
        .modal-body .hero-meta { margin-bottom: 14px; }
        .modal-body p { font-size: 14.5px; line-height: 1.6; color: rgba(245,245,241,0.85); margin: 0 0 20px; }

        .shell { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
        .painelhead h1 { font-size: 28px; margin: 0 0 8px; font-weight: 800; }
        .painelhead p { color: var(--muted); font-size: 14.5px; margin: 0 0 28px; }

        .formcard { background: var(--bg2); border-radius: 10px; padding: 26px; margin-bottom: 44px; border: 1px solid var(--line); }
        .formgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .field.full { grid-column: 1 / -1; }
        .field label { font-size: 12px; font-weight: 600; color: var(--muted); }
        .field input, .field select, .field textarea { font-family: 'Inter', sans-serif; font-size: 14px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--text); outline: none; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); }
        .field textarea { resize: vertical; min-height: 80px; }

        .formfoot { display: flex; gap: 12px; align-items: center; }
        .btn { font-size: 14px; font-weight: 700; padding: 11px 20px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary { background: var(--gold); color: #05101c; }
        .btn-primary:disabled { opacity: 0.5; cursor: default; }
        .btn-ghost { background: none; color: var(--muted); }

        .publicadas h2 { font-size: 17px; margin: 0 0 4px; font-weight: 700; }
        .publicadas .sub { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
        .plist { display: flex; flex-direction: column; gap: 2px; }
        .prow { display: grid; grid-template-columns: 90px 1fr auto; gap: 14px; align-items: center; padding: 10px; border-radius: 6px; }
        .prow:hover { background: var(--bg2); }
        .prow .thumb { width: 90px; height: 52px; border-radius: 4px; overflow: hidden; position: relative; }
        .prow .thumb .capa { padding: 0; }
        .prow .ptitle { font-size: 14.5px; font-weight: 600; margin: 0 0 3px; }
        .prow .pmeta { font-size: 12.5px; color: var(--muted); }
        .prow .rowactions { display: flex; gap: 6px; }

        .iconbtn { border: none; background: var(--bg); width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text); opacity: 0.7; }
        .iconbtn:hover { opacity: 1; }

        .aviso { background: #3a1f1f; border: 1px solid #7a2e2e; color: #f5c6c6; font-size: 13px; padding: 10px 14px; border-radius: 6px; margin: 0 40px 24px; }

        .assinaturabtn { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--line); color: var(--muted); border-radius: 4px; padding: 8px 12px; font-size: 13px; cursor: pointer; }
        .assinaturabtn:hover { color: var(--text); border-color: var(--gold); }

        .planos-shell { max-width: 1040px; margin: 0 auto; padding: 64px 24px 90px; }
        .planos-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 24px; max-width: 1040px; margin: 0 auto; }
        .planos-header { text-align: center; max-width: 560px; margin: 0 auto 36px; }
        .planos-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(30px, 5vw, 44px); margin: 0 0 12px; }
        .planos-header p { color: var(--muted); font-size: 15px; line-height: 1.55; margin: 0; }

        .ciclo-toggle { display: flex; justify-content: center; gap: 4px; margin-bottom: 40px; }
        .ciclo-toggle button { background: var(--bg2); border: 1px solid var(--line); color: var(--muted); font-size: 13.5px; font-weight: 600; padding: 8px 18px; cursor: pointer; }
        .ciclo-toggle button:first-child { border-radius: 999px 0 0 999px; }
        .ciclo-toggle button:last-child { border-radius: 0 999px 999px 0; }
        .ciclo-toggle button.active { background: var(--gold); color: #05101c; border-color: var(--gold); }

        .planos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
        .plano-card { background: var(--bg2); border: 1px solid var(--line); border-radius: 12px; padding: 28px 24px; display: flex; flex-direction: column; position: relative; }
        .plano-card.destaque { border-color: var(--gold); background: var(--bg3); }
        .plano-badge { position: absolute; top: -12px; left: 24px; background: var(--gold); color: #05101c; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
        .plano-nome { font-size: 19px; font-weight: 700; margin: 6px 0 8px; }
        .plano-resumo { font-size: 13.5px; color: var(--muted); line-height: 1.5; margin: 0 0 20px; min-height: 40px; }
        .plano-preco { font-size: 32px; font-weight: 800; margin-bottom: 2px; }
        .plano-preco span { font-size: 13px; font-weight: 500; color: var(--muted); }
        .plano-equivalente { font-size: 12.5px; color: var(--muted); margin-bottom: 22px; }
        .plano-lista { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .plano-lista li { display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px; line-height: 1.4; }
        .plano-lista li svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }
        .plano-btn { width: 100%; background: var(--gold); color: #05101c; border: none; border-radius: 6px; padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .plano-nota { text-align: center; font-size: 12.5px; color: var(--muted); margin-top: 32px; }

        .checkout-body { padding: 26px 28px 30px; }
        .checkout-body h2 { font-size: 20px; margin: 0 0 4px; }
        .checkout-body .checkout-sub { font-size: 13.5px; color: var(--muted); margin-bottom: 22px; }
        .checkout-nota { display: flex; gap: 8px; align-items: flex-start; background: rgba(202,162,40,0.1); border: 1px solid rgba(202,162,40,0.3); border-radius: 6px; padding: 10px 12px; font-size: 12.5px; line-height: 1.5; color: var(--text); margin-top: 4px; }
        .checkout-nota svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }

        .acessos-card { background: var(--bg2); border: 1px solid var(--line); border-radius: 10px; padding: 22px 26px; margin-bottom: 44px; }
        .acessos-card h2 { font-size: 17px; margin: 0 0 4px; font-weight: 700; }
        .acessos-card .sub { font-size: 13px; color: var(--muted); margin-bottom: 18px; }
        .acessos-linha { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }

        @media (max-width: 700px) {
          .nav { padding: 14px 18px; }
          .navlinks { display: none; }
          .rows, .hero { padding-left: 18px; padding-right: 18px; }
          .formgrid { grid-template-columns: 1fr; }
          .prow { grid-template-columns: 70px 1fr auto; }
          .planos-grid { grid-template-columns: 1fr; }
          .acessos-linha { grid-template-columns: 1fr; }
        }
      `}</style>

      {assinatura === undefined && <div className="vazio">Carregando…</div>}

      {assinatura === null && (
        <>
          <div className="planos-nav" style={{ paddingTop: 32 }}>
            <div className="brand">INETRIS</div>
          </div>
          <div className="planos-shell">
            <div className="planos-header">
              <h1 className="brand-font">Escolha o plano da INETRIS</h1>
              <p>Cada contrato inclui 2 acessos. Cancele ou troque de plano quando quiser.</p>
            </div>

            <div className="ciclo-toggle">
              <button type="button" className={ciclo === "mensal" ? "active" : ""} onClick={() => setCiclo("mensal")}>
                Mensal
              </button>
              <button type="button" className={ciclo === "anual" ? "active" : ""} onClick={() => setCiclo("anual")}>
                Anual
              </button>
            </div>

            <div className="planos-grid">
              {PLANOS.map((p) => (
                <div className={`plano-card ${p.destaque ? "destaque" : ""}`} key={p.id}>
                  {p.destaque && <div className="plano-badge">Mais escolhido</div>}
                  <div className="plano-nome">{p.nome}</div>
                  <p className="plano-resumo">{p.resumo}</p>
                  <div className="plano-preco">
                    R$ {ciclo === "mensal" ? p.mensal : Math.round(p.anual / 12)}
                    <span> /mês</span>
                  </div>
                  <div className="plano-equivalente">
                    {ciclo === "mensal" ? "Cobrado mensalmente" : `Cobrado R$ ${p.anual} por ano`}
                  </div>
                  <ul className="plano-lista">
                    {p.recursos.map((r) => (
                      <li key={r}>
                        <Check size={15} /> {r}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="plano-btn"
                    onClick={() => {
                      setPlanoCheckout(p);
                      setCheckoutForm({ empresa: "", acesso1: "", acesso2: "" });
                    }}
                  >
                    <CreditCard size={16} /> Assinar {p.nome}
                  </button>
                </div>
              ))}
            </div>

            <p className="planos-nota">
              Pagamento simulado neste protótipo — a cobrança real é ativada quando integrarmos um meio de
              pagamento (ex: Stripe, Mercado Pago).
            </p>
          </div>

          {planoCheckout && (
            <div className="modal-backdrop" onClick={() => setPlanoCheckout(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-body">
                  <button
                    className="modal-close"
                    style={{ position: "absolute", top: 14, right: 14 }}
                    onClick={() => setPlanoCheckout(null)}
                  >
                    <X size={16} />
                  </button>
                  <h2>Assinar plano {planoCheckout.nome}</h2>
                  <div className="checkout-sub">
                    {ciclo === "mensal"
                      ? `R$ ${planoCheckout.mensal}/mês`
                      : `R$ ${planoCheckout.anual}/ano`}{" "}
                    · 2 acessos incluídos neste contrato
                  </div>
                  <form onSubmit={confirmarCheckout}>
                    <div className="field">
                      <label>Nome da empresa ou contrato</label>
                      <input
                        value={checkoutForm.empresa}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, empresa: e.target.value })}
                        placeholder="Ex: Organização XPTO"
                        required
                      />
                    </div>
                    <div className="field">
                      <label>E-mail do 1º acesso</label>
                      <input
                        type="email"
                        value={checkoutForm.acesso1}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, acesso1: e.target.value })}
                        placeholder="pessoa1@empresa.com"
                        required
                      />
                    </div>
                    <div className="field">
                      <label>E-mail do 2º acesso</label>
                      <input
                        type="email"
                        value={checkoutForm.acesso2}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, acesso2: e.target.value })}
                        placeholder="pessoa2@empresa.com"
                      />
                    </div>
                    <div className="checkout-nota">
                      <Info size={14} />
                      Este é um checkout simulado para demonstração. Nenhum valor é cobrado de verdade — a
                      integração com um meio de pagamento real é o próximo passo fora deste protótipo.
                    </div>
                    <div className="formfoot" style={{ marginTop: 18 }}>
                      <button className="btn btn-primary" type="submit" disabled={confirmando}>
                        <Check size={15} /> Confirmar assinatura (simulada)
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {assinatura && itens === null && <div className="vazio">Carregando catálogo…</div>}

      {assinatura && itens !== null && (
        <>
          <div className="nav">
            <div className="navleft">
              <div className="brand">INETRIS</div>
              <div className="navlinks">
                <button className={view === "catalogo" ? "active" : ""} onClick={() => setView("catalogo")}>
                  Catálogo
                </button>
              </div>
            </div>
            <div className="navright">
              <div className="searchbox">
                <button className="searchicon" onClick={() => setBuscaAberta((v) => !v)}>
                  <Search size={16} />
                </button>
                {buscaAberta && (
                  <input
                    autoFocus
                    placeholder="Palestras, treinamentos, temas"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                )}
              </div>
              <button className="painelbtn" onClick={abrirNovo}>
                <LayoutGrid size={14} /> Painel
              </button>
              <button
                className="assinaturabtn"
                onClick={() => {
                  if (window.confirm("Cancelar a assinatura e voltar para a tela de planos?")) {
                    cancelarAssinatura();
                  }
                }}
                title="Gerenciar assinatura"
              >
                <ShieldCheck size={14} /> {assinatura.planoNome} · 2 acessos
              </button>
            </div>
          </div>

          {erro && <div className="aviso">{erro}</div>}

          {view === "catalogo" && (
            <>
              {resultadosBusca ? (
                <div className="rows" style={{ marginTop: 40 }}>
                  <div className="row-block">
                    <h2 className="row-title">Resultados para "{busca}"</h2>
                    {resultadosBusca.length === 0 ? (
                      <div className="vazio">Nada encontrado. Tente outro termo.</div>
                    ) : (
                      <div className="row-track" style={{ flexWrap: "wrap" }}>
                        {resultadosBusca.map((a) => (
                          <div className="card" key={a.id} onClick={() => setSelecionado(a)}>
                            <Capa item={a}>
                              <div className="card-title">{a.titulo}</div>
                              <div className="card-meta">{a.setor} · {a.duracao}</div>
                            </Capa>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {destaque && (
                    <div className="hero">
                      <Capa item={destaque}><div /></Capa>
                      <div className="hero-content">
                        <div className="hero-tag">{destaque.tipo}</div>
                        <h1 className="brand-font">{destaque.titulo}</h1>
                        <div className="hero-meta">
                          <span>{destaque.setor}</span>
                          <span>·</span>
                          <span>{destaque.duracao}</span>
                        </div>
                        <p>{destaque.descricao}</p>
                        <div className="hero-actions">
                          {destaque.link ? (
                            <a className="btn-hero primary" href={destaque.link} target="_blank" rel="noreferrer">
                              {ehAssistivel(destaque) ? <Play size={16} fill="#000" /> : <MessageCircle size={16} />}
                              {ehAssistivel(destaque) ? "Assistir aula" : "Conversar sobre esse formato"}
                            </a>
                          ) : (
                            <button className="btn-hero primary" disabled>
                              {ehAssistivel(destaque) ? <Play size={16} fill="#000" /> : <MessageCircle size={16} />}
                              {ehAssistivel(destaque) ? "Assistir aula" : "Conversar sobre esse formato"}
                            </button>
                          )}
                          <button className="btn-hero secondary" onClick={() => setSelecionado(destaque)}>
                            <Info size={16} /> Mais informações
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rows">
                    {porTipo.length === 0 && (
                      <div className="vazio">Nenhum item publicado ainda. Vá ao Painel para adicionar o primeiro.</div>
                    )}
                    {porTipo.map((grupo) => (
                      <div className="row-block" key={grupo.tipo}>
                        <h2 className="row-title">{grupo.tipo}</h2>
                        <div className="row-track-wrap">
                          <button className="rowarrow left" onClick={() => scrollRow(grupo.tipo, -1)}>‹</button>
                          <div className="row-track" ref={(el) => (scrollRefs.current[grupo.tipo] = el)}>
                            {grupo.itens.map((a) => (
                              <div className="card" key={a.id} onClick={() => setSelecionado(a)}>
                                <Capa item={a}>
                                  <div className="card-title">{a.titulo}</div>
                                  <div className="card-meta">{a.setor} · {a.duracao}</div>
                                </Capa>
                              </div>
                            ))}
                          </div>
                          <button className="rowarrow right" onClick={() => scrollRow(grupo.tipo, 1)}>›</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {view === "painel" && (
            <div className="shell">
              <div className="painelhead">
                <h1>Painel</h1>
                <p>Publique um novo formato (palestra, treinamento, mentoria ou projeto) ou edite os que já estão no catálogo.</p>
              </div>

              <div className="acessos-card">
                <h2>Acessos do contrato</h2>
                <div className="sub">
                  Plano {assinatura.planoNome} · {assinatura.empresa || "sem nome de contrato"} · ativo desde{" "}
                  {assinatura.ativoDesde}
                </div>
                <div className="acessos-linha">
                  <div className="field">
                    <label>E-mail do 1º acesso</label>
                    <input
                      value={assinatura.acessos?.[0] || ""}
                      onChange={(e) =>
                        persistAssinatura({
                          ...assinatura,
                          acessos: [e.target.value, assinatura.acessos?.[1] || ""],
                        })
                      }
                      placeholder="pessoa1@empresa.com"
                    />
                  </div>
                  <div className="field">
                    <label>E-mail do 2º acesso</label>
                    <input
                      value={assinatura.acessos?.[1] || ""}
                      onChange={(e) =>
                        persistAssinatura({
                          ...assinatura,
                          acessos: [assinatura.acessos?.[0] || "", e.target.value],
                        })
                      }
                      placeholder="pessoa2@empresa.com"
                    />
                  </div>
                </div>
                <div className="checkout-nota">
                  <Users size={14} />
                  Esses campos organizam quem são as 2 pessoas do contrato — este protótipo ainda não faz
                  login real. Para restringir o acesso de verdade, é preciso um sistema de autenticação por
                  trás da assinatura.
                </div>
              </div>

              <form className="formcard" onSubmit={salvar}>
                <div className="formgrid">
                  <div className="field full">
                    <label>Título</label>
                    <input
                      value={form.titulo}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                      placeholder="Ex: Liderança que Transforma"
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Tipo</label>
                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Setor</label>
                    <select value={form.setor} onChange={(e) => setForm({ ...form, setor: e.target.value })}>
                      {SETORES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Duração</label>
                    <input
                      value={form.duracao}
                      onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                      placeholder="Ex: até 1h30, 4h ou 8h"
                    />
                  </div>
                  <div className="field full">
                    <label>
                      {form.tipo === "Aulas Gravadas"
                        ? "Link do vídeo (YouTube, Vimeo, Google Drive, etc.)"
                        : "Link de contato (WhatsApp, formulário ou e-mail)"}
                    </label>
                    <input
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="field full">
                    <label>Capa (URL da imagem — opcional, sem imagem usa uma cor por tipo)</label>
                    <input
                      value={form.capa}
                      onChange={(e) => setForm({ ...form, capa: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="field full">
                    <label>Descrição</label>
                    <textarea
                      value={form.descricao}
                      onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                      placeholder="O que esse formato entrega para a organização?"
                    />
                  </div>
                </div>
                <div className="formfoot">
                  <button className="btn btn-primary" type="submit" disabled={salvando}>
                    {editandoId ? <Check size={15} /> : <Plus size={15} />}
                    {editandoId ? "Salvar alterações" : "Publicar no catálogo"}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => { setForm(emptyForm); setEditandoId(null); }}
                    >
                      <X size={15} /> Cancelar edição
                    </button>
                  )}
                </div>
              </form>

              <div className="publicadas">
                <h2>Itens no catálogo</h2>
                <div className="sub">{itens.length} publicados · visível para quem acessa o site</div>
                <div className="plist">
                  {itens.map((a) => (
                    <div className="prow" key={a.id}>
                      <div className="thumb"><Capa item={a}><div /></Capa></div>
                      <div>
                        <div className="ptitle">{a.titulo}</div>
                        <div className="pmeta">{a.tipo} · {a.setor} · {a.duracao}</div>
                      </div>
                      <div className="rowactions">
                        <button className="iconbtn" onClick={() => abrirEdicao(a)} title="Editar"><Pencil size={14} /></button>
                        <button className="iconbtn" onClick={() => excluir(a.id)} title="Excluir"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selecionado && (
            <div className="modal-backdrop" onClick={() => setSelecionado(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-capa">
                  <Capa item={selecionado}><div /></Capa>
                  <button className="modal-close" onClick={() => setSelecionado(null)}><X size={16} /></button>
                </div>
                <div className="modal-body">
                  <h2>{selecionado.titulo}</h2>
                  <div className="hero-meta">
                    <span>{selecionado.tipo}</span>
                    <span>·</span>
                    <span>{selecionado.setor}</span>
                    <span>·</span>
                    <span>{selecionado.duracao}</span>
                  </div>
                  <p>{selecionado.descricao}</p>
                  {selecionado.link ? (
                    <a className="btn-hero primary" href={selecionado.link} target="_blank" rel="noreferrer">
                      {ehAssistivel(selecionado) ? <Play size={16} fill="#000" /> : <MessageCircle size={16} />}
                      {ehAssistivel(selecionado) ? "Assistir aula" : "Conversar sobre esse formato"}
                    </a>
                  ) : (
                    <button className="btn-hero primary" disabled>
                      {ehAssistivel(selecionado) ? <Play size={16} /> : <MessageCircle size={16} />}
                      {ehAssistivel(selecionado)
                        ? "Vídeo ainda não publicado"
                        : "Contato ainda não configurado"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
