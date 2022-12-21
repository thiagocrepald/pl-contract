import Login from "./views/Login/Login.jsx";
import UsuarioLista from "./views/Usuario/Usuario.lista.jsx"
import UsuarioCadastro from "./views/Usuario/Usuario.cadastro.jsx"
import UsuarioVisualizar from "./views/Usuario/Usuario.visualizar.jsx"
import ContratanteCadastro from "./views/Contratante/Contratante.cadastro.jsx"
import ContratanteVisualizar from "./views/Contratante/Contratante.visualizar.jsx"
import ContractsList from "./views/Contrato/contracts-list/contracts-list"
import ContractRegister from "./views/Contrato/contract-register/contract-register"
import ContratoVisualizar from "./views/Contrato/Contrato.visualizar"
import ContratoDetalhe from "./views/Contrato/contract-detail"
import EscalaLista from "./views/Escala/Escala.lista.jsx"
import EscalaCadastro from "./views/Escala/Escala.cadastro.jsx"

import GestaoEscalaLista from "./views/GestaoEscala/GestaoEscala.lista";
import GestaoEscalaTabela from "./views/GestaoEscala/GestaoEscala.tabela";
import EscalaVisualizar from "./views/Escala/Escala.visualizar.jsx"

import MedicoLista from "./views/Medico/lista/doctors-list.jsx"
import MedicoCadastro from "./views/Medico/cadastro/Medico.cadastro.jsx"
import MedicoVisualizar from "./views/Medico/visualizar/Medico.visualizar.jsx"
import Indicadores from "./views/Indicadores/Indicadores";
import ConfirmarEmail from "./views/ConfirmarEmailMedico/ConfirmarEmail";
import ForgotPassword from "./views/EsqueciSenha/esqueciSenha";
import EventoLista from "./views/Evento/Evento.lista";
import EventoDetalhe from "./views/Evento/Evento.detalhe";
import EventoCadastro from "./views/Evento/Evento.cadastro";
import Management from "./views/Management/management";
import Relatorio from "./views/Relatorios/relatorios";
import Payments from "./views/Management/payments";
import Links from "./views/Management/links";
import Results from "./views/Management/results";
import CompanyData from "./views/Management/company-data";
import AdminReport from "./views/Relatorios/admin-report";
import ImportReport from "./views/Relatorios/import-report";
import PaidHoursReport from "./views/Relatorios/paid-hours-report";
import Notification from "./views/notificações/notifications";
import AnticipationValues from "./views/Relatorios/anticipation-values";


const routes = [{
        path: "/indicadores",
        name: "Indicadores",
        //icon: "ni ni-single-copy-04 text-secondary",
        component: Indicadores,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/notifications",
        name: "Notificações",
        //icon: "ni ni-single-copy-04 text-secondary",
        component: Notification,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/cadastro-contratante/:userId",
        component: ContratanteCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/visualizar-contratante/:userId",
        component: ContratanteVisualizar,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/management",
        name: "Gerenciamento",
        component: Management,
        layout: "/admin",
        showSidebar: true,
        subRoutes: [{
                path: "/management/company-data",
                name: "Dados da Empresa",
                component: CompanyData,
                layout: "/admin",
                showSidebar: false,
            },
            {
                path: "/management/payments",
                name: "Natureza do Pagamento",
                component: Payments,
                layout: "/admin",
                showSidebar: false,
            },
            {
                path: "/management/links",
                name: "Vínculos",
                component: Links,
                layout: "/admin",
                showSidebar: false,
            },
            {
                path: "/management/results",
                name: "Centro de Resultados",
                component: Results,
                layout: "/admin",
                showSidebar: false,
            },
        ],
    },
    {
        path: "/cadastro-contratante/",
        component: ContratanteCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/contracts",
        name: "Contratos",
        //icon: "ni ni-single-copy-04 text-secondary",
        component: ContractsList,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/contract-register/:id",
        component: ContractRegister,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/contract-register/",
        component: ContractRegister,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/visualizar-contrato/:id",
        component: ContratoVisualizar,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/contract-detail/:id",
        component: ContratoDetalhe,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/relatorio",
        name: "Relatórios",
        component: Relatorio,
        layout: "/admin",
        showSidebar: true,
        subRoutes: [{
                path: "/admin-report",
                name: "Administrativo",
                component: AdminReport,
                layout: "/admin",
                showSidebar: true,
            },
            {
                path: "/import-report",
                name: "Importação",
                component: ImportReport,
                layout: "/admin",
                showSidebar: true,
            },
            {
                path: "/paid-hours-report",
                name: "Horas Pagas x Faturadas",
                component: PaidHoursReport,
                layout: "/admin",
                showSidebar: true,
            },
            {
                path: "/anticipation-values/:contractId/:timeCourse/:isClosingOfficerUser",
                name: "Antecipação de Valores",
                component: AnticipationValues,
                layout: "/admin",
                showSidebar: false,
            }
        ],
    },
    {
        path: "/escala",
        name: "Cadastro Escalas",
        //icon: "fa fa-bars text-secondary",
        component: EscalaLista,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/lista-gestao-escala",
        name: "Gestão Escalas",
        //icon: "ni ni-bullet-list-67 text-secondary",
        component: GestaoEscalaLista,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/usuario",
        name: "Usuários",
        //icon: "ni ni-single-02 text-secondary",
        component: UsuarioLista,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/cadastro-usuario/:userId",
        component: UsuarioCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/cadastro-usuario/",
        component: UsuarioCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/visualizar-usuario/:userId",
        component: UsuarioVisualizar,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/cadastro-escala/:id",
        component: EscalaCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/cadastro-escala/",
        component: EscalaCadastro,
        layout: "/admin",
        showSidebar: false,
    },

    {
        path: "/tabela-gestao-escala/:id/:nomeEscala",
        component: GestaoEscalaTabela,
        layout: "/admin",
        showSidebar: false,
    },

    {
        path: "/visualizar-escala/:id",
        component: EscalaVisualizar,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/usuarioApp",
        name: "Médicos",
        //icon: "ni ni-single-02 text-secondary",
        component: MedicoLista,
        layout: "/admin",
        showSidebar: true,
    },
    {
        path: "/cadastro-usuario-app/:userId",
        component: MedicoCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/cadastro-usuario-app/",
        component: MedicoCadastro,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/visualizar-usuario-app/:userId",
        component: MedicoVisualizar,
        layout: "/admin",
        showSidebar: false,
    },
    {
        path: "/evento",
        name: "Eventos",
        component: EventoLista,
        layout: "/admin",
        showSidebar: true
    },
    {
        path: "/detalhe-evento/:id",
        component: EventoDetalhe,
        layout: "/admin",
        showSidebar: false
    },
    {
        path: "/cadastro-evento/:id?",
        component: EventoCadastro,
        layout: "/admin",
        showSidebar: false
    },
    {
        path: "/confirmar-email/:medico",
        name: "Confirmar E-mail",
        //icon: "ni ni-user-run text-secondary",
        component: ConfirmarEmail,
        layout: "/auth",
        showSidebar: false,
    },

    {
        path: "/redefinir-senha/",
        name: "Redefinir Senha",
        //icon: "ni ni-user-run text-secondary",
        component: ForgotPassword,
        layout: '/auth',
        showSidebar: false,
    },

    //  SEMPRE POR ÚLTIMO
    {
        path: "/login",
        name: "Sair",
        //icon: "ni ni-user-run text-secondary",
        component: Login,
        layout: "/auth",
        showSidebar: true,
    },
];
export default routes;
