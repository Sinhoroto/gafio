import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState, FormEvent } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading';
import ToastComponent from '../../../components/Toast';
import { PatientService } from './PatientService';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import Collapse from 'react-bootstrap/Collapse';
import {FiRefreshCcw, FiSearch} from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import * as Yup from "yup";

import './Patient.css';

const Patient = (props: any) => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [loading1, setLoading1] = useState<boolean>(false);
    const [getFirst, setFirst] = useState(0);

    const rows = 10;
    let newUser = false;
    const email = localStorage.getItem('@gafio-user/email');


    const [datasource, setDatasource] = useState([]);
    const [paciente, setPaciente] = useState([]);
    const [getPacienteSelect, setPacienteSelect] = useState<any>(null);

    //const para listagem
    const [getPacienteSeq, setPacienteSeq] = useState<any>('');
    const [getPacienteNro, setPacienteNro] = useState<any>('');
    const [getPacienteGenero, setPacienteGenero] = useState<any>('');
    const [getPacienteNome, setPacienteNome] = useState<any>('');
    const [getPacienteDataNascimento, setPacienteDataNascimento] = useState<any>('');
    const [getPacienteProntuario, setPacienteProntuario] = useState<any>();
    const [getPacienteAvalicao, setPacienteAvaliacao] = useState<any>();

    const [getPacienteIdade, setPacienteIdade] = useState<any>('');

    const [selectedUser, setSelectedUser] = useState<any>(null);

    const patientService = new PatientService();

    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog1, setDisplayDialog1] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [displayDialog3, setDisplayDialog3] = useState(false);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    //const para atualizacao
    const [getPacienteNomeUpdate, setPacienteNomeUpdate] = useState<any>('');
    const [getPacienteDataNascimentoUpdate, setPacienteDataNascimentoUpdate] = useState<any>('');
    const [getPacienteGeneroUpdate, setPacienteGeneroUpdate] = useState<any>('');

    const [getMode, setMode] = useState<string>('N');
    const [getOptionState, setOptionState] = useState<any>(null)
    const [searchInput, setSearchInput] = useState('');
    const [open, setOpen] = useState(false);

    let optionsDropdownGenero = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' }
    ];

    //Calendario local
    const pt_br = {
        firstDayOfWeek: 1,
        dayNames: ["domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        // dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar",
    };

    useEffect(() => {
        document.title = 'GAFio | Paciente';
        try {
            // console.log(props)
            // const id = props.match.params.idPatient
        } catch (err) {
            console.log(err)
        }
        getPatientFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;
            patientService.getPatientPaginate(endIndex).then(response => getPatientFunction(response))
            setFirst(startIndex);
            setLoading(false);
        }, 300);
    }
    function getPatientFunction1(data: any) {
        setDatasource(data.patients);
        let dataSize = data.length[0]['count(`NroPaciente`)']
        setTotalRecords(dataSize);
        data = data.patients;
        for (let i = 0; i < data.length; i++) {
            if (data[i]['Genero'] === 'M') {
                data[i]['Genero'] = 'Masculino';
            } else if (data[i]['Genero'] === 'F') {
                data[i]['Genero'] = 'Feminino';
            }
        }

        setTimeout(() => {
            setPaciente(data.slice(0, rows));
            setLoading(false);
            setLoading1(false);
        }, 500);
        return
    }

    async function getPatientFunction(data?: any) {
        setLoading(true);
        setLoading1(true);
        if (!data) {
            await patientService.getPatientPaginate(10).then(data => {
                if (data.patientFound) {
                    getPatientFunction1(data);
                } else {
                    showToast('error', 'Erro!', 'Nenhum paciente encontrado.');
                    setLoading(false);
                    setLoading1(false);
                }
            })
        } else {
            getPatientFunction1(data);
        }
    }

    async function getPatientInformation() {
        var tempoAtual = new Date();
        var parseDataAniversario = getPacienteDataNascimento.split('/')
        var dataAniversario = new Date(parseDataAniversario[2], parseDataAniversario[1], parseDataAniversario[0]);
        var age = tempoAtual.getFullYear() - dataAniversario.getFullYear();
        var m = tempoAtual.getMonth() - dataAniversario.getMonth();
        if (m < 0 || (m === 0 && tempoAtual.getDate() < dataAniversario.getDate())) {
            age--;
        }
        if (age < 0) {
            setPacienteIdade(0);
        } else {
            setPacienteIdade(age);
        }

        await patientService.getPatientInformation(getPacienteSeq).then(response => {
            if (response.patientFound) {
                setPacienteProntuario(response.medicalRecordsLength);
                setPacienteAvaliacao(response.assessmentLength);
            } else {
                showToast('error', "Erro!", response.error);
            }
        })
    }

    function getPatientInformationUpdate() {
        setPacienteNomeUpdate(getPacienteNome);
        var parseDataAniversario = getPacienteDataNascimento.split('/')
        var dataNascimento = new Date(parseDataAniversario[2], parseDataAniversario[1] - 1, parseDataAniversario[0]);
        setPacienteDataNascimentoUpdate(dataNascimento);
        setPacienteGeneroUpdate(getPacienteGenero[0]);
    }

    async function handleSubmit(event: FormEvent) {
        try {
            event.preventDefault();
            const data = {
                getPacienteNomeUpdate,
                getPacienteDataNascimentoUpdate,
                getPacienteGeneroUpdate
            };
            //Validação de dados
            const schema = Yup.object().shape({
                getPacienteNomeUpdate: Yup.string().required(),
                getPacienteDataNascimentoUpdate: Yup.date().required(),
                getPacienteGeneroUpdate: Yup.string().nullable().oneOf([null, "M", "F"]).required(),
            })

            await schema.validate(data, { abortEarly: false });
            patientService.updatePatientInformation(getPacienteSeq, getPacienteNomeUpdate, getPacienteGeneroUpdate, getPacienteDataNascimentoUpdate, email).then(response => {
                if (response.updatedPatient) {
                    showToast('success', "Atualização!", "Paciente atualizado com sucesso.");
                    setDisplayDialog2(false);
                    getPatientFunction();
                } else {
                    showToast('error', "Erro!", String(response.error));
                }
            });
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                showToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
            }
            else return;
        }
    }

    async function deletePatient() {
        await patientService.deletePatient(getPacienteSeq, email).then(response => {
            if (response.deletedPatient) {
                showToast('success', "Atualização!", "Paciente excluído com sucesso.");
                setDisplayDialog3(false);
                getPatientFunction();
            } else {
                console.log(response.error)
                if (response.error.code) {
                    showToast('error', "Erro!", String(response.error.code) + ' ' + String(response.error.sqlMessage));
                } else {
                    showToast('error', "Erro!", String(response.error));
                }
            }
        });
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    const onUserSelect = (e: any) => {
        newUser = false;
        setPacienteSelect(Object.assign({}, e.data));
        var pacienteData = e.data;
        setPacienteDataNascimento(pacienteData.DataNascimento);
        setPacienteNome(pacienteData.NomePaciente);
        setPacienteGenero(pacienteData.Genero);
        setPacienteNro(pacienteData.NroPaciente);
        setPacienteSeq(pacienteData.SeqPaciente);
        setDisplayDialog(true);
    };

    const onGeneroChange = (e: { value: string }) => {
        setPacienteGeneroUpdate(e.value);
    };

    const seqPacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">SeqPaciente</span>
                <a>{rowData.SeqPaciente}</a>
            </React.Fragment>
        );
    }
    const nroPacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">NroPaciente</span>
                <a>{rowData.NroPaciente}</a>
            </React.Fragment>
        );
    }
    const generoPacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Genero</span>
                <a>{rowData.Genero}</a>
            </React.Fragment>
        );
    }
    const nomePacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">NomePaciente</span>
                <a>{rowData.NomePaciente}</a>
            </React.Fragment>
        );
    }
    const dataNascimentoPacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">DataNascimento</span>
                <a>{rowData.DataNascimento}</a>
            </React.Fragment>
        );
    }

    let options2 = [
        {name: 'Nome', cod: 'Name'},
        {name: 'Nro Paciente', cod: 'Nro'},
        {name: 'Data Nascimento', cod: 'Nas'}
    ];

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };

    function handleSearch(){
        if(!getOptionState){
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return
        }
        setLoading(true);
        if(!searchInput){
            patientService.getPatientPaginate(10).then(data => {
                getPatientFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            })
            return
        }
        setMode('S');
        patientService.searchPatientGlobal(searchInput, getOptionState.cod, getFirst+rows).then(data => {
            if(!data.patientFound){
                setLoading(false);
                setPaciente([]);
                showToast('warn', 'Resultados não encontrados!', 'Não foram encontrados resultados para a busca desejada')
                return
            }
            getPatientFunction(data)
            let searchType;
            if(getOptionState.name === 'Nome'){
                searchType = 'NomePaciente';
            }else if(getOptionState.name === 'Nro Paciente'){
                searchType = 'NroPaciente';
            }else if(getOptionState.name === 'Data Nascimento'){
                searchType = 'DataNascimento'
            }else{
                searchType = getOptionState.name
            }
            console.log(data)
            let dataSize = data.length[0]['count(`' + searchType + '`)']
            if(dataSize == 1){
                showToast('info', 'Resultado Encontrado!', `Foi encontrado ${dataSize} resultado.`)
            }else{
                showToast('info', 'Resultados Encontrados!', `Foram encontrados ${dataSize} resultados.`)
            }
        })
    }

    const header = (
        <>
            <a className="d-inline h6">Paciente(s)</a>
            <Button variant="success" className="float-right mr-lg-2" title="Atualizar" disabled={loading} onClick={() => {getPatientFunction(); showToast('info', 'Notificação', `Foram encontrados ${totalRecords} resultados.`)}}>
                {loading
                    ?
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                    : 
                        <FiRefreshCcw size={20}/>
                }
            </Button>
        </>    
    );

    return (
        <>
            <div className="row m-5 px-5">
            <Link to={location => ({ ...location, pathname: '/registrations/patient/create' })}><Button variant="outline-dark" className="mb-2" style={{ borderRadius: '0', height: '41.5px' }}>Cadastrar Paciente</Button></Link>
                <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} style={{borderRadius: '0'}}>Buscar paciente específico</Button>
                    <Collapse in={open} timeout={200}>
                        <div className="ml-2">
                            <div className="p-inputgroup">
                                <span className="p-float-label">
                                    <InputText id="float-input" type="search" value={searchInput} onChange={(e) => {setSearchInput((e.target as HTMLInputElement).value)}} onKeyPress={(ev) => {if (ev.key === 'Enter') {handleSearch(); ev.preventDefault();}}}  style={{minWidth:'4em', borderRadius: '0'}} size={30} />
                                    {getOptionState === null
                                        ? <label htmlFor="float-input">Buscar</label>
                                        : <label htmlFor="float-input">Buscar por {getOptionState.name}</label>
                                    }
                                </span>
                                {searchInput === ''
                                    ? <></>
                                    :
                                        <>
                                            <Dropdown className="mx-1" value={getOptionState} options={options2} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                            <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); getPatientFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                            <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                        </>
                                }
                            </div>
                        </div>
                    </Collapse>
                <div className="ml-auto"></div>

                <div className="datatable-responsive-demo">
                    <DataTable value={paciente} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                        emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" style={{"minWidth": "300px"}} resizableColumns={true} loading={loading}
                        first={getFirst} onPage={onPage} lazy={true} selectionMode="single" selection={selectedUser} onSelectionChange={e => setSelectedUser(e.value)}
                        onRowSelect={onUserSelect}>
                        <Column field="SeqPaciente" header="SeqPaciente" body={seqPacienteBodyTemplate} />
                        <Column field="NroPaciente" header="NroPaciente" body={nroPacienteBodyTemplate} />
                        <Column field="Genero" header="Gênero" body={generoPacienteBodyTemplate} />
                        <Column field="NomePaciente" header="NomePaciente" body={nomePacienteBodyTemplate} />
                        <Column field="DataNascimento" header="DataNascimento" body={dataNascimentoPacienteBodyTemplate} />
                    </DataTable>
                </div>
            </div>
            <Dialog visible={displayDialog} style={{ width: '50%' }} header="Ações" modal={true} onHide={() => {setDisplayDialog(false); setSelectedUser(null)}}>
                <div className="form-row">
                    <div className="col">
                        <Button variant="info" className="mt-2 mb-2 p-3" style={{ width: '100%' }} onClick={() => { getPatientInformation(); setDisplayDialog1(true); setDisplayDialog(false); setSelectedUser(null) }}>Visualizar Paciente</Button>
                    </div>
                    <div className="col ml-2">
                        <Button variant="primary" className="mt-2 mb-2 p-3" style={{ width: '100%' }} onClick={() => { getPatientInformationUpdate(); setDisplayDialog2(true); setDisplayDialog(false); setSelectedUser(null) }}>Atualizar paciente</Button>
                    </div>
                    <div className="col ml-2">
                        <Button variant="danger" className="mt-2 mb-2 p-3" style={{ width: '100%' }} onClick={() => { setDisplayDialog3(true); setDisplayDialog(false); setSelectedUser(null) }}>Excluir Paciente</Button>
                    </div>
                    {/* <div className="col mr-4">
                        <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Atualizar <br></br> prontuário</Button>
                    </div>


                    <div className="col">
                        <Button className="mx-2 mt-2 mb-2 mr-2 p-3" onClick={() => {setDisplayDialog2(true); setDisplayDialog(false)}}>Excluir <br></br> prontuário</Button>
                    </div> */}
                </div>
            </Dialog>

            {/* Caixa de dialogo de listagem de paciente */}
            <Dialog visible={displayDialog1} style={{ width: '50%' }} modal={true} onHide={() => setDisplayDialog1(false)} maximizable>
                <p className="text-dark h5 mt-2">Número: {getPacienteNro}</p>
                <p className="text-dark h5 mt-2">Sequência: {getPacienteSeq}</p>
                <p className="text-dark h5 mt-2">Nome: {getPacienteNome}</p>
                {getPacienteIdade > 1
                    ? <p className="text-dark h5 mt-2">Idade: {getPacienteIdade} anos</p>
                    : <p className="text-dark h5 mt-2">Idade: {getPacienteIdade} ano</p>
                }
                <p className="text-dark h5 mt-2">Data de nascimento: {getPacienteDataNascimento}</p>
                <p className="text-dark h5 mt-2">Gênero: {getPacienteGenero}</p>
                <br></br>
                <p className="text-dark h5 mt-2">Quantidade de <b>Prontuários</b>: {getPacienteProntuario}</p>
                <p className="text-dark h5 mt-2">Quantidade de <b>Avaliações</b>: {getPacienteAvalicao}</p>
            </Dialog>

            <Dialog visible={displayDialog2} style={{ width: '70%' }} modal={true} onHide={() => setDisplayDialog2(false)} maximizable maximized>
                <p className="text-dark h3 text-center">Atualização dos dados do(a) paciente {getPacienteNome}</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="mt-4 mb-2">
                        <span className="p-float-label">
                            <InputText id="NomeUpdate" style={{ width: '100%' }} value={getPacienteNomeUpdate} onChange={(e) => setPacienteNomeUpdate((e.target as HTMLInputElement).value)} />
                            <label htmlFor="NomeUpdate">Nome</label>
                        </span>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Dropdown className="my-2" value={getPacienteGeneroUpdate} options={optionsDropdownGenero} onChange={onGeneroChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />
                        </div>
                        <div className="col">
                            <Calendar id="DataInternacao" className="mt-2" style={{ width: '100%' }} value={getPacienteDataNascimentoUpdate} onChange={(e) => setPacienteDataNascimentoUpdate(e.value)}
                                locale="pt" dateFormat="dd/mm/yy" placeholder="Selecione a data de nascimento do paciente" showButtonBar monthNavigator showIcon showOnFocus={false} required/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                </form>
            </Dialog>

            <Dialog visible={displayDialog3} style={{ width: '50%' }} modal={true} header="Exclusão de paciente" onHide={() => setDisplayDialog3(false)}>
                <p className="text-dark h5 mt-2">Deseja exluir o paciente {getPacienteNome} de código {getPacienteSeq}?</p>
                <div className="row">
                    <div className="col">
                        <Button variant="outline-danger" onClick={() => deletePatient()} style={{ width: '100%' }}>Sim</Button>
                    </div>
                    <div className="col">
                        <Button variant="outline-info" onClick={() => setDisplayDialog3(false)} style={{ width: '100%' }}>Não</Button>
                    </div>
                </div>
            </Dialog>

            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent} />
            }
            {loading1 &&
                <Loading />
            }
        </>
    )
};

export default Patient;