import { css } from "@emotion/core";
import React, { FormEvent, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import ResetPasswordService from "../../services/resetPassword.service";

// reactstrap components
import { Button, Col, Form, FormGroup, Input, Row } from "reactstrap";
import logo from '../../assets/logo/logo.svg';
import circleWithArrow from '../../assets/img/svg/circleWithArrow.svg'
import sendEmail from '../../assets/img/svg/sendEmail.svg'
import locked from '../../assets/img/svg/locked.svg'
import UsuarioAppService from "../../services/usuario.app.service";
import IconButton from '../../components/icon-button/icon-button';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import Footer from '../../components/footer/footer';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import "./esqueciSenha.scss";

const ForgotPassword = () => {
    const PATH_DOCTOR = '/auth/redefinir-senha/medico/'
    const PATH_ADMIN = '/auth/redefinir-senha/admin/'
    const [t] = useTranslation();
    const history = useHistory();
    const [email, setEmail] = useState<string>()
    const [response, setResponse] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(false)
    const [equalsPass, setEqualsPass] = useState<boolean>()
    const [send, setSend] = useState<boolean>(false)
    const [password, setPassword] = useState<string>()
    const [confirmPass, setConfirmPass] = useState<string>()
    const [resetKey, setResetKey] = useState<string>()
    const [loadingResend, setLoadingResend] = useState<boolean>()
    const path = history.location.pathname
    console.log(history)

    const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
    `;

    const handleClickBack = () => {
        history.push("/auth/login")
    }

    const textOrUndefined = (text) => {
        if(!text){
            return undefined
        }else{
            return text
        }
    }
    
    const handleChangeEmail = (text: string) => {
        setEmail(textOrUndefined(text))
    }

    const handleChangePassword = (textPassword: string) => {
        setPassword(textOrUndefined(textPassword))
    }

    const handleChangeConfirmPass = (textConfirm: string) => {
        setConfirmPass(textOrUndefined(textConfirm))
    }      


    const handleOnSubmit = async (e) => {
        e.preventDefault()
        
        if(email){
            setLoading(true)
            await ResetPasswordService.sendEmail(email).then((responseData:any) => {
                if(responseData.data.tipo === 'success'){
                    setSend(true)
                    setResponse(true)
                }else{
                    setSend(false)
                    setResponse(false)
                }
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const handleOnSubmitResend = async(e) => {
        e.preventDefault()
        if(email){
            setLoadingResend(true)
            await ResetPasswordService.sendEmail(email).finally(() => {
                setLoadingResend(false)
            })
        }
    }

    const handleOnSubmitPass = async (e) => {
        e.preventDefault()
        if(confirmPass === password){
            setEqualsPass(true)
        }else{
            setEqualsPass(false)
        }

        if(password === confirmPass && email && resetKey && password){
            setLoading(true)
            if(path.includes(PATH_DOCTOR)){
                await ResetPasswordService.changePass({email, senha: password, resetKey}).then((responseData:any) => {
                    if(responseData.data.tipo === 'success'){
                        setSend(true)
                        setResponse(true)
                    }else{
                        setSend(false)
                        setResponse(false)
                    }
                }).finally(() => {
                    setLoading(false)
                })
            }

            if(path.includes(PATH_ADMIN)){
                await ResetPasswordService.changePass({login: email, senha: password, resetKey}).then((responseData:any) => {
                    if(responseData.data.tipo === 'success'){
                        setSend(true)
                        setResponse(true)
                    }else{
                        setSend(false)
                        setResponse(false)
                    }
                }).finally(() => {
                    setLoading(false)
                })
            }
        }
    }

    const FormForgotPassword = () => {
        return(
            <>
                <Row>
                    <div id='back-page' onClick={() => handleClickBack()}>
                        <Image  src={circleWithArrow}/>
                        <p>{t('management.buttons.goBack')}</p>
                    </div>
                </Row>
                {
                    send && loading === false ? 
                        <Row className="containerSend">
                            <Form onSubmit={(e) => handleOnSubmitResend(e)}>
                                <Col>
                                    <div className="container--text">
                                        <h2 className="text">{t('management.forgotPassword.send')}</h2>
                                        <Image  src={sendEmail} style={{marginBottom: '15px'}}/>
                                        <p>{t('management.forgotPassword.verifyEmail')}</p>
                                        <p>{t('management.forgotPassword.spam')}</p>
                                    </div>
                                    {
                                        loadingResend ?
                                            <Row style={{justifyContent: 'center', marginBottom:'10px'}}>
                                                <ClipLoader
                                                css={override}
                                                sizeUnit={"px"}
                                                size={50}
                                                color={"#000"}
                                                loading={loading}
                                                />
                                            </Row>
                                            :
                                            <></>
                                    }
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                        <IconButton color='green' isAlignCenter width={'174px'} height={'44px'} filled clickButton={() => {return}} fontSize="16px" noIcon>
                                            {t('management.forgotPassword.resend')}
                                        </IconButton>
                                    </div>
                                </Col>
                            </Form>
                        </Row>
                    :
                        <Form className="login-form" onSubmit={(e) => handleOnSubmit(e)}>
                            <div className="container--text">
                                <h2 className="text">{t('management.forgotPassword.title')}</h2>
                                <p>{t('management.forgotPassword.subTitle')}</p>
                            </div>
                            {
                                loading ?
                                <Row style={{justifyContent: 'center', marginBottom:'10px'}}>
                                    <ClipLoader
                                    css={override}
                                    sizeUnit={"px"}
                                    size={50}
                                    color={"#000"}
                                    loading={loading}
                                    />
                                </Row>
                                :
                                <></>
                            }
                            <Row style={{justifyContent: 'center'}}>
                                <Col md="3">
                                    <CustomTextField
                                        id='field1'
                                        placeholder={t('management.textField.Email')}
                                        value={email}
                                        onChange={(text:string) => handleChangeEmail(text)}
                                        error={undefined}
                                        errorText={t('management.forgotPassword.Error')}
                                        // onBlur={() => validateField(FieldType.COMPANY_NAME)}
                                        
                                    />
                                    {response === false &&  <p className="error--text">{t('management.forgotPassword.Error')}</p>}
                                </Col>
                            </Row>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                <IconButton color='green' isAlignCenter width={'150px'} height={'44px'} filled clickButton={() => {return}} fontSize="16px" >
                                    {t('management.buttons.send')}
                                    <div className='icon-arrow-right'/>
                                </IconButton>
                            </div>
                        </Form>
                }
            </>
        )
    }

    const FormSendNewPassword = () => {

        useEffect(() => {
            if(path.includes(PATH_DOCTOR)){
                const paramsPath = path.replace(PATH_DOCTOR, '').split('/')
                console.log(paramsPath)
                setEmail(paramsPath[0])
                setResetKey(paramsPath[1])
            }
    
            if(path.includes(PATH_ADMIN)){
                const paramsPath = path.replace(PATH_ADMIN, '').split('/')
                setEmail(paramsPath[0])
                setResetKey(paramsPath[1])
            }
        }, [])

        return(
            <>
                {
                    send && loading === false ? 
                        <Row className="containerSend">
                            <Col>
                                <div className="container--text">
                                    <h2 className="text">{t('management.forgotPassword.ChangePassword')}</h2>
                                    <Image  src={locked} style={{marginBottom: '15px'}}/>
                                    <p>{t('management.forgotPassword.TextPassConfirm')}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                    <IconButton color='green' isAlignCenter width={'174px'} height={'44px'} filled clickButton={() => history.push('/auth/login')} fontSize="16px" >
                                        {t('management.buttons.ConfirmedPass')}
                                        <div className='icon-arrow-right'/>
                                    </IconButton>
                                </div>
                            </Col>
                        </Row>
                    :
                        <Form className="login-form" onSubmit={(e) => handleOnSubmitPass(e)}>
                            <div className="container--text">
                                <h2 className="text">{t('management.forgotPassword.changeTitle')}</h2>
                                <p>{t('management.forgotPassword.changeSubTitle')}</p>
                            </div>
                            {
                                loading ?
                                <Row style={{justifyContent: 'center', marginBottom:'10px'}}>
                                    <ClipLoader
                                    css={override}
                                    sizeUnit={"px"}
                                    size={50}
                                    color={"#000"}
                                    loading={loading}
                                    />
                                </Row>
                                :
                                <></>
                            }
                            <Row style={{justifyContent: 'center'}}>
                                <Col md="3">
                                    <CustomTextField
                                        id='field1'
                                        placeholder={t('management.textField.enterYourPassword')}
                                        value={password}
                                        onChange={(text:string) => handleChangePassword(text)}
                                        error={undefined}
                                        errorText={t('management.forgotPassword.Error')}
                                        isPassword
                                        
                                        // onBlur={() => validateField(FieldType.COMPANY_NAME)}
                                    />
                                    <CustomTextField
                                        id='field2'
                                        placeholder={t('management.textField.RepeatPassword')}
                                        value={confirmPass}
                                        onChange={(text:string) => handleChangeConfirmPass(text)}
                                        isPassword
                                        style={{marginTop: '20px'}}
                                        
                                    />
                                    {equalsPass === false && <p className="error--text">{t('management.forgotPassword.IsntEqualsPasswords')}</p>}
                                </Col>
                            </Row>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                <IconButton color='green' isAlignCenter width={'150px'} height={'44px'} filled clickButton={() => {return}} fontSize="16px" noIcon>
                                    {t('management.buttons.sendNewPassword')}
                                </IconButton>
                            </div>
                        </Form>
                }
            </>
        )
    }


    return (
        <section id="esqueciSenhaView">
            <header id='header'>
                <Image  src={logo}/>
            </header>
            {
                path === '/auth/redefinir-senha' ||  path === '/auth/redefinir-senha/' ?
                FormForgotPassword()
                :
                FormSendNewPassword()
            }
            <Footer/>
        </section>
    );
}


export default ForgotPassword;
