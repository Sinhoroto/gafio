import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import Carousel from 'react-bootstrap/Carousel';

import './login.css';

import { InputText } from 'primereact/inputtext';
import loginFiocruzCustomImage from '../../assets/fiocruzFrente.jpeg';
import loginFiocruzCasteloImage from '../../assets/fiocruzCastelo.jpg';
import loginBanner from '../../assets/fiocruzBanner.jpg';
import api from '../../services/api';
import ToastComponent from '../../components/Toast';

// const secretWord = 'PalavraSecreta';

declare module "jsonwebtoken"{
    export function decode(
        token: string
    ): {Email: string, Nome: string, TipoUsuario: string, CodUsuario: string};
}

const Login = () => {
    const history = useHistory();

    const [, setCookies] = useCookies([]);
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    const [getEmail, setEmail] = useState<string>('');
    const [getPassword, setPassword] = useState<string>('');

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: any, e: any) => {
        setIndex(selectedIndex);
    };
     
    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        // const token = jwt.sign({email: email, senha: senha}, secretWord);
        localStorage.setItem('@gafio-user/email', getEmail);
        try{
            await api.post('session/login', {email: getEmail, senha: getPassword})
            .then(function(response){
                if(response.data.userLogin){
                    const tokenLoginResponse = jwt.decode(response.data.userToken);
                    var Email = tokenLoginResponse.Email;
                    let Nome = tokenLoginResponse.Nome;
                    let TipoUsuario = tokenLoginResponse.TipoUsuario;
                    let CodUsuario = tokenLoginResponse.CodUsuario;
                    setCookiesLogin(Email, Nome, TipoUsuario, CodUsuario);
                }else{
                    showToast('error', 'Erro!', response.data.error);
                }
            })
        }catch(err) {
            if(err.message === "Network Error"){
                showToast('error', 'Erro!', 'Não foi possível conectar ao servidor.')
            }
        }
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }
    
    async function setCookiesLogin(email: string, nome: string, tipoUsuario: string, codUsuario: string){
        let nomeArray = nome.split(' ');
        nome = nomeArray[0];
        // await api.post(`notifications/length/${codUsuario}`, {TipoUsuario: tipoUsuario}).then(response => {
        //     console.log(response)
        //     if(response.data.notificationFound){
        //         setCookies('notificationLength', {length: response.data.length})
        //     }
        // })
        setCookies('userData', {Email: email, Nome: nome, TipoUsuario: tipoUsuario, CodUsuario: codUsuario});
        history.push('/home');
    }

    useEffect(() => {
        document.title = 'GAFio | Login';
    }, []);

    return (
        <div>
            <div className="row m-5"> 
                    {/* <img className="rounded col-sm-7 " src={loginBanner} alt="Banner"/> */}
                    {/* <img className="rounded col-sm-7 " src={loginFiocruzCustomImage} alt="Banner"/> */}
                <Carousel className="rounded col-sm-7 d-none d-md-block" activeIndex={index} onSelect={handleSelect}>
                    <Carousel.Item>
                        <img className="d-block w-100" style={{"maxHeight": "440px"}} src={loginFiocruzCustomImage} alt="First slide" />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" style={{"maxHeight": "440px"}} src={loginFiocruzCasteloImage} alt="Second slide" />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" style={{"maxHeight": "440px"}} src={loginBanner} alt="Third slide" />
                    </Carousel.Item>
                </Carousel>
                <div className="card col-md-5 p-5 bg-light shadow-lg float-right text-center">
                    <form className="was-validated pb-2" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <InputText type="email" style={{width: '100%'}} id="email" name="email" onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="Digite seu email" required autoFocus autoComplete="off"/>
                        
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <InputText type="password" style={{width: '100%'}} id="password" name="senha" onChange={(e) => setPassword((e.target as HTMLInputElement).value)} minLength={8} placeholder="Digite sua senha" required/>
                        
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    {
                        getEmail.length < 8 || getPassword.length < 8
                        ? <button type="submit" className="btn btn-info btn-primary disabled mt-2 mb-3" disabled>Entrar</button>
                        : <button type="submit" className="btn btn-info btn-primary mt-2 mb-3">Entrar</button>
                    }
                    </form>
                    <div col-1>
                        <span>Ainda não possui cadastro?</span><br/>
                        <Link to="/signUp">
                            <span className="text-info">Crie já o seu</span>
                        </Link>
                    </div>
                </div>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                }
            </div>
        </div>
    )
}

export default Login;