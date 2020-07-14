/****************************************
| Data: 19/06/2020                      |
| Resumo: Controlador Notificacao (CRUD)|
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

interface notificationObject{
    descricao?: string,
    CodNotificacao?: string
}

class Notification{
    async create(request: Request, response: Response){
        const {descricao, userId} = request.body;
        const notification = {
            Descricao: descricao, 
            Status: 0, 
            TipoNotificacao: "teste",
            CodUsuario: userId
        }
        await knex("Notificacao").insert(notification).then(function (notifications) {
            if(notifications){
                knex("Usuario_Notificacao").insert({"CodNotificacao": notifications[0], "CodUsuario": userId}).then(user => {
                    if(user){
                        return response.json({createdNotification: true, id: notifications[0]});
                    }else{
                        return response.json({createdNotification: false, error: "Não pode inserir em usuario."});
                    }
                })
            }else{
                return response.json({createdNotification: false, error: "Não pode inserir em notificacao."});
            }
        })
    }

    async index(request: Request, response: Response){
        const notificationDB = await knex('Notificacao').select('*');
        return response.json({notificationFound: true, content: notificationDB});
    }

    async showId(request: Request, response: Response){
        const {id} = request.params;        //UserID
        const {TipoUsuario} = request.body;
        if(TipoUsuario == 'A' || TipoUsuario == 'M'){
            const notificationDB = await knex('Usuario_Notificacao').whereNot('CodUsuario', id);
            if(notificationDB.length != 0){
                var notificationObject: any = {}, notificationList: any = [];
                var notifications: any = []
                for(let i = 0; i < notificationDB.length; i++){
                    notificationObject = notificationDB[i];
                    notificationList.push(notificationObject);
                }
                // console.log(notificationList)
                // console.log(notificationList.length)
                knex('Notificacao').where({
                    Status: 0
                }).whereNot({
                    CodUsuario: id,
                })
                .then(notificacoes => {
                    return response.json({notificationFound: true, notifications: notificacoes, length: notificacoes.length});
                })
                
                // return response.json({notificationFound: true, notifications, length: notifications.length});
                // .then(notificacoes => {
                //     console.log(notificacoes)
                //     if(notificacoes){
                //         notifications.push(notificacoes);
                //     }else{
                //         return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});                        
                //     }
                // })
            }else{
                return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});
            }
        }else{
            return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});
        }
    }

    async showNotificationLength(request: Request, response: Response){
        const {id} = request.params;        //UserID
        const {TipoUsuario} = request.body;
        if(TipoUsuario == 'A' || TipoUsuario == 'M'){
            const notificationDB = await knex('Usuario_Notificacao').whereNot('CodUsuario', id);
            if(notificationDB.length != 0){
                var notificationObject: any = {}, notificationList: any = [];
                var notifications: any = []
                for(let i = 0; i < notificationDB.length; i++){
                    notificationObject = notificationDB[i];
                    notificationList.push(notificationObject);
                }
                knex('Notificacao').where({
                    CodUsuario: notificationList[0].CodUsuario,
                    Status: 0
                })
                .then(notificacoes => {
                    if(notificacoes){
                        notifications.push(notificacoes);
                        return response.json({notificationFound: true, notifications, length: notifications.length});
                    }else{
                        return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});                        
                    }
                })
            }else{
                return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});
            }
        }else{
            return response.json({notificationFound: false, error: "Não há notificações para este usuário.", length: 0});
        }
    }

    async updateStatus(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex("Notificacao").where("CodNotificacao", id).update({
            Status: 1
        });
        if (notificationDB) {
            return response.json({ updatedNotification: true });
        } else {
            return response.json({updatedNotification: false, error: "Notificação não encontrada"});
        }
    }

    async updateStatusAccepted(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex("Notificacao").where("CodNotificacao", id).update({
            StatusAR: 'A',
            Status: 1
        });
        if (notificationDB) {
            const {notificationType} = request.body;
            if(notificationType == "Change"){
                const notificationDB1 = await knex("Notificacao").where("CodNotificacao", id);
                const userId = notificationDB1[0].CodUsuario;
                const userDB = await knex("Usuario").where("CodUsuario", userId).update({
                    TipoUsuario: 'M',
                    isVerified: 1
                })
            }
            return response.json({ updatedStatusNotification: true });
        } else {
            return response.json({updatedStatusNotification: false, error: "Notificação não encontrada"});
        }
    }

    async updateStatusRefused(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex("Notificacao").where("CodNotificacao", id).update({
            StatusAR: 'R',
            Status: 1
        });
        if (notificationDB) {
            const {notificationType} = request.body;
            if(notificationType == "Change"){
                const notificationDB1 = await knex("Notificacao").where("CodNotificacao", id);
                const userId = notificationDB1[0].CodUsuario;
                const userDB = await knex("Usuario").where("CodUsuario", userId).update({
                    requestUserType: null
                })
            }
            return response.json({ updatedStatusNotification: true });
        } else {
            return response.json({updatedStatusNotification: false, error: "Notificação não encontrada"});
        }
    }

    async delete(request: Request, response: Response){
        const {id} = request.params;
        const usuarioNotificacao = await knex("Usuario_Notificacao").where("CodNotificacao", id).del();
        const notificacao = await knex("Notificacao").where("CodNotificacao", id).del();
        if(notificacao && usuarioNotificacao){
            return response.json({deletedNotification: true});
        }else{
            return response.json({deletedNotification: false, error: "ERROR"});
        }
    }
}

export default Notification;