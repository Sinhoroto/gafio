import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "react-bootstrap/Button";
import ToastComponent from "../../components/Toast";
import Loading from "../../components/Loading";
import { Dialog } from "primereact/dialog";
import View from "./MicrobiologyView";
import Form from "./MicrobiologyForm";

import "./index.css";

import api from "../../services/api";

interface IMicrobiology {
    IdMicrobiologia: number;
    IdPaciente: number;
    IdProntuario: number;
    DataColeta: string;
    DataResultado: string;
    SwabNasal: string;
    SwabNasalObservacoes: string;
    SwabRetal: string;
    SwabRetalObservacoes: string;
    Sangue: string;
    SangueObservacoes: string;
    Urina: string;
    UrinaObservacoes: string;
    SecrecaoTraqueal: string;
    SecrecaoTraquealObservacoes: string;
    Outros: string;
    OutrosObservacoes: string;
    PerfilSensibilidade: string;
}

const Microbiology = () => {
    const [microbiologies, setMicrobiologies] = useState<IMicrobiology[]>([]);
    const [records, setRecords] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [view, setView] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedMicrobiology, setselectedMicrobiology] = useState<any>(null);

    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");

    const [tableloading, setTableLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    const rows = 10;

    useEffect(() => {
        //carrega os dados da tabela e a quantidade total de registros
        async function loadMicrobiologies() {
            try {
                const response = await api.get("/microbiology");
                const { results } = response.data;
                const { count } = response.data.count;
                setRecords(Number(count));
                setMicrobiologies(results);
                setLoading(false);
                setTableLoading(false);
            } catch (error) {
                setLoading(false);
                setTableLoading(false);
                HandleToast(
                    "error",
                    "Erro!",
                    "Falha ao carregar os registros."
                );
            }
        }

        loadMicrobiologies();
    }, []);

    //Busca os registros por página
    async function handlePage(event: any) {
        try {
            setTableLoading(true);
            const index = event.first;
            const page = Number(index) / 10 + 1;
            const response = await api.get("microbiology", {
                params: { page },
            });
            const { results } = response.data;
            setMicrobiologies(results);
            setFirst(index);
            setTableLoading(false);
        } catch (error) {
            setTableLoading(false);
            HandleToast("error", "Erro!", "Falha ao carregar os registros.");
        }
    }
   
    function onMicrobiologySelect(e: any) {
        const microbiologyData = e.data;
        const { IdMicrobiologia } = microbiologyData;
        setId(IdMicrobiologia);
        setDisplayDialog(true);
    }

    //Atualiza os dados da tabela
    async function handleTableUpdate() {
        try {
            setTableLoading(true);
            const response = await api.get("/microbiology");
            const { results } = response.data;
            const { count } = response.data.count;
            setRecords(Number(count));
            setMicrobiologies(results);
            setTableLoading(false);
        } catch (error) {
            setTableLoading(false);
            HandleToast("error", "Erro!", "Falha ao atualizar os registros.");
        }
    }

    //Deleta microbiologia
    async function handleDelete() {
        try {
            await api.delete(`/microbiology/delete/${id}`);
            setDeleteDialog(false);
            HandleToast("success", "Sucesso!", "A microbiologia foi excluída.");
            handleTableUpdate();
        } catch (error) {
            setDeleteDialog(false);
            HandleToast("error", "Erro!", "Falha ao excluir a microbiologia.");
        }
    }

    function handleUpdate() {
        setUpdate(false);
        handleTableUpdate();
    }

    function HandleToast(
        messageType: string,
        messageTitle: string,
        messageContent: string
    ) {
        setToast(false);
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500);
    }

    // Para as colunas da tabela 
    const IdBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Id</span>
                <a>{rowData.IdMicrobiologia}</a>
            </React.Fragment>
        );
    };

    const PacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Paciente</span>
                <a>{rowData.IdPaciente}</a>
            </React.Fragment>
        );
    };

    const ProntuarioBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Prontuário</span>
                <a>{rowData.IdProntuario}</a>
            </React.Fragment>
        );
    };

    const DataColetaBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Coleta</span>
                <a>{rowData.DataColeta}</a>
            </React.Fragment>
        );
    };

    const DataResultadoBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Resultado</span>
                <a>{rowData.DataResultado}</a>
            </React.Fragment>
        );
    };

    const SwabNasalBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Swab Nasal</span>
                <a>{rowData.SwabNasal}</a>
            </React.Fragment>
        );
    };

    const SwabRetalBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Swab Retal</span>
                <a>{rowData.SwabRetal}</a>
            </React.Fragment>
        );
    };

    const SangueBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Sangue</span>
                <a>{rowData.Sangue}</a>
            </React.Fragment>
        );
    };

    const UrinaBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Urina</span>
                <a>{rowData.Urina}</a>
            </React.Fragment>
        );
    };

    const SecrecaoTraquealBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Secrecao Traqueal</span>
                <a>{rowData.SecrecaoTraqueal}</a>
            </React.Fragment>
        );
    };

    const OutrosBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Outros</span>
                <a>{rowData.Outros}</a>
            </React.Fragment>
        );
    };

    const PerfilSensibilidadeTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Perfil</span>
                <a>{rowData.PerfilSensibilidade}</a>
            </React.Fragment>
        );
    };

    return (
        <>
            <div className="row m-5 px-5">
                <Link to="/microbiology/create">
                    <Button
                        variant="outline-dark"
                        className="mb-2"
                        style={{ borderRadius: "0", height: "41.5px" }}
                    >
                        Cadastrar Microbiologia
                    </Button>
                </Link>
                <Button
                    variant="outline-secondary"
                    className="mb-2 ml-2"
                    aria-controls="example-collapse-text"
                    style={{ borderRadius: "0" }}
                >
                    Buscar por microbiologia
                </Button>
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={microbiologies}
                        loading={tableloading}
                        paginator={true}
                        rows={rows}
                        totalRecords={records}
                        first={first}
                        onPage={handlePage}
                        header="Microbiologias"
                        emptyMessage="Nenhum resultado encontrado"
                        lazy={true}
                        selectionMode="single"
                        className="p-datatable-responsive-demo"
                        resizableColumns={true}
                        selection={selectedMicrobiology}
                        onSelectionChange={(e) =>
                            setselectedMicrobiology(e.value)
                        }
                        onRowSelect={(e) => {
                            onMicrobiologySelect(e);
                        }}
                    >
                        <Column field="IdMicrobiologia" header="Id" body={IdBodyTemplate}/>
                        <Column field="IdPaciente" header="Paciente" body={PacienteBodyTemplate} />
                        <Column field="IdProntuario" header="Prontuário" body={ProntuarioBodyTemplate} />
                        <Column field="DataColeta" header="Coleta" body={DataColetaBodyTemplate}/>
                        <Column field="DataResultado" header="Resultado" body={DataResultadoBodyTemplate} />
                        <Column field="SwabNasal" header="Swab Nasal" body={SwabNasalBodyTemplate} />
                        <Column field="SwabRetal" header="Swab Retal" body={SwabRetalBodyTemplate}/>
                        <Column field="Sangue" header="Sangue" body={SangueBodyTemplate}/>
                        <Column field="Urina" header="Urina" body={UrinaBodyTemplate} />
                        <Column
                            field="SecrecaoTraqueal"
                            header="Secreção Traqueal"
                            body={SecrecaoTraquealBodyTemplate}
                        />
                        <Column field="Outros" header="Outros" body={OutrosBodyTemplate}/>
                        <Column field="PerfilSensibilidade" header="Perfil" body={PerfilSensibilidadeTemplate}/>
                    </DataTable>
                </div>

                <Dialog
                    visible={displayDialog}
                    style={{ width: "50%" }}
                    header="Ações"
                    modal={true}
                    onHide={() => setDisplayDialog(false)}
                >
                    <div className="form-row text-center">
                        <div className="col">
                            <Button
                                variant="info"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setView(true);
                                }}
                            >
                                Visualizar microbiologia
                            </Button>
                        </div>
                        <div className="col">
                            <Button
                                variant="primary"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setUpdate(true);
                                }}
                            >
                                Atualizar microbiologia
                            </Button>
                        </div>

                        <div className="col">
                            <Button
                                variant="danger"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setDeleteDialog(true);
                                }}
                            >
                                Excluir microbiologia
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteDialog}
                    style={{ width: "50%" }}
                    modal={true}
                    header="Exclusão de microbiologia"
                    onHide={() => setDeleteDialog(false)}
                >
                    <p className="text-dark h5 mt-2">
                        Deseja realmente exluir esta microbiologia?
                    </p>
                    <div className="row">
                        <div className="col">
                            <Button
                                variant="outline-danger"
                                onClick={() => handleDelete()}
                                style={{ width: "100%" }}
                            >
                                Sim
                            </Button>
                        </div>
                        <div className="col">
                            <Button
                                variant="outline-info"
                                onClick={() => setDeleteDialog(false)}
                                style={{ width: "100%" }}
                            >
                                Não
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={update}
                    style={{ width: "80%" }}
                    modal={true}
                    maximizable
                    maximized
                    onHide={() => handleUpdate()}
                >
                    <Form id={id} />
                </Dialog>

                {view && (
                    <View view={view} id={id} setView={() => setView(false)} />
                )}
            </div>
            {toast && (
                <ToastComponent
                    messageType={getMessageType}
                    messageTitle={getMessageTitle}
                    messageContent={getMessageContent}
                />
            )}
            {loading && <Loading />}
        </>
    );
};

export default Microbiology;
