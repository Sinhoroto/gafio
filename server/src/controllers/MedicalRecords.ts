/****************************************
| Data: 28/08/2020                      |
| Resumo: Controlador Prontuário (CRUD) |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class ProntuarioController {
   //CRIAR PRONTUARIO
   async create(request: Request, response: Response) {
      const {
         NroProntuario,
         NroPaciente,
         DataInternacao,
         CodDoencaPrincipal,
         CodDoencaSecundario,
         SistemaAcometido,
         CodComorbidade,
         Origem,
         Alocacao,
         Coleta,
         ResultadoColeta,
         CodAtbPrimario,
         CodAtbSecundario,
         SitioInfecaoPrimario,
         TratamentoCCIH,
         IndicacaoSepse,
         DisfuncaoRenal,
         OrigemInfeccao,
         DoseCorreta,
         PosologiaCorreta
      } = request.body
      
      if (!NroProntuario || !NroPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
         return response.json({
            CreatedMedicalRecords: false,
            error: "Preencha todos os campos necessários."
         })
      }else{
         const MedicalRecordDB = await knex("Prontuario").where("NroProntuario", NroProntuario);
         const MedicalRecord = MedicalRecordDB[0];
         
         if(!MedicalRecord){
            await knex("Prontuario").insert({
               NroProntuario,
               NroPaciente,
               DataInternacao,
               CodDoencaPrincipal,
               CodDoencaSecundario,
               SistemaAcometido,
               CodComorbidade,
               Origem,
               Alocacao,
               Coleta,
               ResultadoColeta,
               CodAtbPrimario,
               CodAtbSecundario,
               SitioInfecaoPrimario,
               TratamentoCCIH,
               IndicacaoSepse,
               DisfuncaoRenal,
               OrigemInfeccao,
               DoseCorreta,
               PosologiaCorreta
            }).then(() => {
              return response.json({CreatedMedicalRecords: true});
            }).catch(error => {
               return response.json({CreatedMedicalRecords: false, error});
            })
         }else{
            return response.json({
               CreatedMedicalRecords: false,
               error: "O número de prontuário já existe."
            });
         }
      }
   }

   //FILTRO DA LISTA DE PRONTUARIOS
   async indexPagination(request: Request, response: Response){
      const {page} = request.params;
      var pageRequest = parseInt(page) / 10;
      const rows = 10;
      try{
        const MedicalRecords = await knex("Prontuario").select("*")
        .offset((pageRequest-1)*rows).limit(rows);
        
         const serializedMedicalRecords = MedicalRecords.map(MedicalRecord =>{
            return {
               NroProntuario: MedicalRecord.NroProntuario,
               NroPaciente: MedicalRecord.NroPaciente,
               DataInternacao: MedicalRecord.DataInternacao,
               Desfecho: MedicalRecord.Desfecho
            }
         })

        const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
        return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength});
      }catch(err){
        return response.json({showMedicalRecords: false, error: err});
      }
   }

   //LISTAR PRONTUARIOS
   async index(request: Request, response: Response) {
      const MedicalRecord = await knex("Prontuario").select("*");
      return response.send(MedicalRecord);
   }
   
      //FILTRAR POR NroProntuario
      async indexByNroProntuario(request: Request, response: Response) {
         const { NroProntuario } = request.params;

         if(NroProntuario){
            const MedicalRecordDB = await knex("Prontuario").where('NroProntuario', 'like', `%${NroProntuario}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuário não encontrado. Verifique o número do prontuário e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o número do prontuário para procurar."})
         }
      }
   
   //FILTROS DE BUSCA
      //FILTRAR POR NroPaciente
      async indexByNroPaciente(request: Request, response: Response) {
         const { NroPaciente } = request.params;

         if(NroPaciente){
            const MedicalRecordDB = await knex("Prontuario").where('NroPaciente', 'like', `%${NroPaciente}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuário não encontrado. Verifique o número do paciente e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o número do paciente para procurar."})
         }
      }

      //FILTRAR POR DataInternacao
      async indexByDataInternacao(request: Request, response: Response) {
         const { DataInternacao } = request.params;

         if(DataInternacao){
            const MedicalRecordDB = await knex("Prontuario").where('DataInternacao', 'like', `%${DataInternacao}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuário não encontrado. Verifique a data de internação e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite a data de internação para procurar."})
         }
      }

   //UPDATE DE DADOS
   async update(request: Request, response: Response) {
      
      const { id } = request.params
      
      if(id){
         const {
            NroPaciente,
            DataInternacao,
            CodDoencaPrincipal,
            CodDoencaSecundario,
            SistemaAcometido,
            CodComorbidade,
            Origem,
            Alocacao,
            DataDesfecho,
            Coleta,
            ResultadoColeta,
            CodAtbPrimario,
            CodAtbSecundario,
            SitioInfecaoPrimario,
            TratamentoCCIH,
            IndicacaoSepse,
            DisfuncaoRenal,
            OrigemInfeccao,
            Desfecho,
            DoseCorreta,
            PosologiaCorreta
         } = request.body
   
         if (!NroPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
            return response.json({
               updatedMedicalRecord: false,
               error: "Preencha todos os campos necessários."
            })
         }else{
            const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', id)
            const MedicalRecord = MedicalRecordDB[0]
            
            if(MedicalRecord){
               await knex('Prontuario').where('NroProntuario', id).update({
                  NroPaciente: NroPaciente,
                  DataInternacao: DataInternacao,
                  CodDoencaPrincipal: CodDoencaPrincipal,
                  CodDoencaSecundario: CodDoencaSecundario,
                  SistemaAcometido: SistemaAcometido,
                  CodComorbidade: CodComorbidade,
                  Origem: Origem,
                  Alocacao: Alocacao,
                  DataDesfecho: DataDesfecho,
                  Coleta: Coleta,
                  ResultadoColeta: ResultadoColeta,
                  CodAtbPrimario: CodAtbPrimario,
                  CodAtbSecundario: CodAtbSecundario,
                  SitioInfecaoPrimario: SitioInfecaoPrimario,
                  TratamentoCCIH: TratamentoCCIH,
                  IndicacaoSepse: IndicacaoSepse,
                  DisfuncaoRenal: DisfuncaoRenal,
                  OrigemInfeccao: OrigemInfeccao,
                  Desfecho: Desfecho,
                  DoseCorreta: DoseCorreta,
                  PosologiaCorreta : PosologiaCorreta
               }).then(() => {
                  return response.json({updatedMedicalRecord: true});
               }).catch(error => {
                  return response.json({updatedMedicalRecord: false, error});
               })
            }else{
               return response.json({updatedMedicalRecord: false, error: "O número de prontuário não existe."});
            }
         }
      }else{
         return response.json({updatedMedicalRecord: false, error: "É necessário informar o número do prontuário."});
      }
   }

   //DELETAR PRONTUARIO
   async delete(request: Request, response: Response) {
      
      //APAGAR LIGACAO DO PRONTUARIO COM O HISTORICO

      const { id } = request.params;
      const MedicalRecordDB = await knex("Prontuario").where(
         "NroProntuario",
         id
      );
      
      const MedicalRecord = MedicalRecordDB[0];

      if (MedicalRecord) {
         await knex("Prontuario").where("NroProntuario", id).delete();
         return response.json({ deletedMedicalRecord: true });
      } else {
         return response.json({
            deletedMedicalRecord: false,
            error: "Prontuário não encontrado."
         });
      }
   }
}

export default ProntuarioController;
